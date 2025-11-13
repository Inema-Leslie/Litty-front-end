import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import './Dashboard.css';

const Dashboard = () => {
  const userName = localStorage.getItem('littyUsername') || "Reader";
  
  const recommendedBooks = [
    { 
      id: 1, 
      title: "Dracula", 
      author: "Bram Stoker",
      cover: "https://covers.openlibrary.org/b/id/10372354-M.jpg",
      searchQuery: "dracula"
    },
    { 
      id: 2, 
      title: "Frankenstein", 
      author: "Mary Shelley",
      cover: "https://covers.openlibrary.org/b/id/8255505-M.jpg",
      searchQuery: "frankenstein"
    },
    { 
      id: 3, 
      title: "Pride and Prejudice", 
      author: "Jane Austen",
      cover: "https://covers.openlibrary.org/b/id/8264674-M.jpg",
      searchQuery: "pride and prejudice"
    },
    { 
      id: 4, 
      title: "The Adventures of Sherlock Holmes", 
      author: "Arthur Conan Doyle",
      cover: "https://covers.openlibrary.org/b/id/12697370-M.jpg",
      searchQuery: "sherlock holmes"
    },
    { 
      id: 5, 
      title: "Moby Dick", 
      author: "Herman Melville",
      cover: "https://covers.openlibrary.org/b/id/8226458-M.jpg",
      searchQuery: "moby dick"
    },
    { 
      id: 6, 
      title: "The Odyssey", 
      author: "Homer",
      cover: "https://covers.openlibrary.org/b/id/12880633-M.jpg",
      searchQuery: "odyssey"
    }
  ];

  const [currentBook, setCurrentBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState('');
  const [addingBook, setAddingBook] = useState(false);
  const [userStreak, setUserStreak] = useState({ current_streak: 0, longest_streak: 0 });
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user data including streak and challenges
  useEffect(() => {
    fetchUserData();
    const savedLibrary = JSON.parse(localStorage.getItem('littyLibrary') || '[]');
    const readingBook = savedLibrary.find(book => book.pagesRead > 0 && book.pagesRead < book.totalPages);
    setCurrentBook(readingBook || null);
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('littyToken');
      
      // Fetch user streak data
      const streakRes = await fetch('http://localhost:8000/api/user/streak', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (streakRes.ok) {
        const streakData = await streakRes.json();
        setUserStreak(streakData);
      }

      // Fetch user's active challenges
      const challengesRes = await fetch('http://localhost:8000/api/user/challenges', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (challengesRes.ok) {
        const challengesData = await challengesRes.json();
        // Filter for active (not completed) challenges
        const active = challengesData.filter(challenge => !challenge.is_completed);
        setActiveChallenges(active.slice(0, 3)); // Show top 3 active challenges
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookContent = async (searchQuery) => {
    try {
      console.log('🔍 Fetching book:', searchQuery);
      const response = await fetch(`http://localhost:8000/api/books/search-and-read?query=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const bookData = await response.json();
      console.log('📊 Book data received:', {
        title: bookData.book.title,
        contentLength: bookData.content?.length,
        wordCount: bookData.word_count,
        estimatedPages: bookData.estimated_pages
      });
      
      return bookData;
    } catch (error) {
      console.error('❌ Fetch error:', error);
      throw error;
    }
  };

  const searchBooks = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError('');

    try {
      const bookData = await fetchBookContent(searchQuery);
      setSearchResult(bookData);
    } catch (error) {
      setError('Book not found or service unavailable');
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const addToLibrary = (bookData) => {
    const existingLibrary = JSON.parse(localStorage.getItem('littyLibrary') || '[]');
    
    // Check if book already exists in library
    const existingBook = existingLibrary.find(book => 
      book.title.toLowerCase() === bookData.book.title.toLowerCase()
    );
    
    if (existingBook) {
      alert(`"${bookData.book.title}" is already in your library!`);
      return;
    }

    // Use estimated_pages from backend if available, otherwise calculate
    const estimatedPages = bookData.estimated_pages || Math.max(50, Math.ceil(bookData.word_count / 250));

    // Find matching cover from our recommended books
    const matchedBook = recommendedBooks.find(recBook => 
      recBook.title.toLowerCase().includes(bookData.book.title.toLowerCase()) ||
      bookData.book.title.toLowerCase().includes(recBook.title.toLowerCase())
    );

    const newBook = {
      id: Date.now(),
      title: bookData.book.title,
      author: bookData.book.author,
      cover: matchedBook ? matchedBook.cover : "📖",
      pagesRead: 0,
      totalPages: estimatedPages,
      lastRead: null,
      content: bookData.content
    };

    console.log('💾 Saving book to library:', {
      title: newBook.title,
      totalPages: newBook.totalPages,
      contentLength: newBook.content.length
    });

    const updatedLibrary = [newBook, ...existingLibrary];
    localStorage.setItem('littyLibrary', JSON.stringify(updatedLibrary));
    
    setSearchResult(null);
    setSearchQuery('');
    alert(`🎉 Added "${bookData.book.title}" to your library! (${estimatedPages} pages)`);
  };

  const addRecommendedToLibrary = async (book) => {
    const existingLibrary = JSON.parse(localStorage.getItem('littyLibrary') || '[]');
    
    // Check if book already exists
    const existingBook = existingLibrary.find(libBook => 
      libBook.title.toLowerCase() === book.title.toLowerCase()
    );
    
    if (existingBook) {
      alert(`"${book.title}" is already in your library!`);
      return;
    }

    setAddingBook(true);

    try {
      // Get REAL book content from external APIs via your backend
      const bookData = await fetchBookContent(book.searchQuery);
      
      // Use estimated_pages from backend if available, otherwise calculate
      const estimatedPages = bookData.estimated_pages || Math.max(50, Math.ceil(bookData.word_count / 250));

      const newBook = {
        id: Date.now(),
        title: book.title, // Use the clean title from our recommended list
        author: book.author, // Use the clean author from our recommended list
        cover: book.cover,
        pagesRead: 0,
        totalPages: estimatedPages,
        lastRead: null,
        content: bookData.content
      };

      console.log('💾 Saving recommended book to library:', {
        title: newBook.title,
        totalPages: newBook.totalPages,
        contentLength: newBook.content.length
      });

      const updatedLibrary = [newBook, ...existingLibrary];
      localStorage.setItem('littyLibrary', JSON.stringify(updatedLibrary));
      alert(`🎉 Added "${book.title}" to your library! (${estimatedPages} pages)`);
      
    } catch (error) {
      console.error('Failed to fetch book content:', error);
      
      // Fallback with proper page count
      const newBook = {
        id: Date.now(),
        title: book.title,
        author: book.author,
        cover: book.cover,
        pagesRead: 0,
        totalPages: 300, // Default page count
        lastRead: null,
        content: `# ${book.title}\n\n## by ${book.author}\n\nThis book has been added to your library. The full text content could not be loaded at this time.\n\nPlease try searching for this book to get the complete content.`
      };

      const updatedLibrary = [newBook, ...existingLibrary];
      localStorage.setItem('littyLibrary', JSON.stringify(updatedLibrary));
      alert(`📚 Added "${book.title}" to your library! (Limited content)`);
    } finally {
      setAddingBook(false);
    }
  };

  const readPreview = (bookData) => {
    const preview = `
📖 ${bookData.book.title}
by ${bookData.book.author}

${bookData.content.substring(0, 500)}...

[Content continues...]

📊 ${bookData.word_count} words • ${bookData.source}
    `;
    alert(preview);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchBooks();
  };

  // Log reading session to update streaks and challenges
  const logReadingSession = async () => {
    try {
      const token = localStorage.getItem('littyToken');
      const response = await fetch('http://localhost:8000/api/reader/log-reading', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reading_seconds: 1800, // 30 minutes
          page_count: 15
        })
      });
      
      if (response.ok) {
        // Refresh user data to show updated streaks and progress
        await fetchUserData();
        alert('Reading session logged! Your progress has been updated.');
      }
    } catch (error) {
      console.error('Error logging reading:', error);
    }
  };

  const getStreakMessage = (streak) => {
    if (streak === 0) return "Start your reading streak today!";
    if (streak === 1) return "Great start! Keep it going tomorrow!";
    if (streak < 7) return `You're on a ${streak}-day streak! 🔥`;
    if (streak < 30) return `Amazing ${streak}-day streak! 🚀`;
    return `Incredible ${streak}-day streak! 🌟`;
  };

  return (
    <div className="dashboard">
      {addingBook && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</div>
            <div>Adding book to your library...</div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="dashboard-header">
        <h1>Hello, {userName}! 👋</h1>
        <div className="avatar">🧑</div>
      </header>

      {/* Reading Stats Section */}
      <section className="stats-section">
        <div className="streak-card">
          <div className="streak-info">
            <h2>🔥 {userStreak.current_streak || 0}-Day Streak</h2>
            <p>{getStreakMessage(userStreak.current_streak || 0)}</p>
            <button className="log-reading-btn" onClick={logReadingSession}>
              📖 Log Today's Reading
            </button>
          </div>
          <div className="streak-details">
            <div className="streak-stat">
              <span className="stat-number">{userStreak.longest_streak || 0}</span>
              <span className="stat-label">Longest Streak</span>
            </div>
          </div>
        </div>
      </section>

      {/* Active Challenges */}
      {activeChallenges.length > 0 && (
        <section className="active-challenges">
          <h2>🎯 Active Challenges</h2>
          <div className="challenges-mini">
            {activeChallenges.map(challenge => {
              const progressPercentage = Math.min((challenge.progress / challenge.challenge.target_value) * 100, 100);
              return (
                <div key={challenge.id} className="challenge-mini-card">
                  <div className="challenge-mini-header">
                    <h4>{challenge.challenge.name}</h4>
                    <span className="reward-mini">{challenge.challenge.reward_points} pts</span>
                  </div>
                  <div className="progress-bar-mini">
                    <div 
                      className="progress-fill-mini"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className="progress-text-mini">
                    {challenge.progress}/{challenge.challenge.target_value} ({progressPercentage.toFixed(0)}%)
                  </span>
                </div>
              );
            })}
          </div>
          <div className="challenges-cta">
            <a href="/challenges" className="view-all-challenges">
              View All Challenges →
            </a>
          </div>
        </section>
      )}

      {/* Search Section */}
      <section className="search-section">
        <h2>🔍 Discover New Books</h2>
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for classic books..."
            className="search-input"
          />
          <button type="submit" disabled={isSearching} className="search-button">
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        <div className="search-tips">
          <span>💡 Try: dracula, frankenstein, sherlock, moby dick, pride and prejudice</span>
        </div>

        {searchResult && (
          <div className="search-result">
            <h3>📚 Search Result</h3>
            <div className="result-content">
              <div className="result-book-cover">📖</div>
              <div className="result-book-info">
                <h4>{searchResult.book?.title}</h4>
                <p className="author">by {searchResult.book?.author}</p>
                <p className="book-meta">
                  {searchResult.word_count} words • {searchResult.estimated_pages} pages • {searchResult.source}
                </p>
                <div className="result-actions">
                  <button onClick={() => addToLibrary(searchResult)} className="btn-primary">
                    Add to Library
                  </button>
                  <button onClick={() => readPreview(searchResult)} className="btn-secondary">
                    Read Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Continue Reading */}
      {currentBook && (
        <section className="continue-reading">
          <h2>📖 Continue Reading</h2>
          <div className="book-card">
            <div className="book-cover">
              {currentBook.cover?.startsWith('http') ? (
                <img 
                  src={currentBook.cover} 
                  alt={currentBook.title}
                  style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                />
              ) : (
                <span>{currentBook.cover || "📖"}</span>
              )}
            </div>
            <div className="book-info">
              <h3>{currentBook.title}</h3>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.round((currentBook.pagesRead / currentBook.totalPages) * 100)}%` }}></div>
              </div>
              <span>{Math.round((currentBook.pagesRead / currentBook.totalPages) * 100)}% done</span>
            </div>
          </div>
        </section>
      )}

      {/* Recommended Books */}
      <section className="recommendations">
        <h2>✨ Classic Books for You</h2>
        <div className="book-grid">
          {recommendedBooks.map((book) => (
            <BookCard
              key={book.id}
              title={book.title}
              author={book.author}
              cover={book.cover}
              onAddToLibrary={() => addRecommendedToLibrary(book)}
              showAddButton={true}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;