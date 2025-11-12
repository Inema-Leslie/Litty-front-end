// pages/Library.jsx
import React, { useState, useEffect } from "react";

function Library() {
  const [libraryBooks, setLibraryBooks] = useState([]);
  const [currentReadingBook, setCurrentReadingBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [bookContent, setBookContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);

  // Load books from localStorage on component mount
  useEffect(() => {
    const savedLibrary = localStorage.getItem('littyLibrary');
    if (savedLibrary) {
      setLibraryBooks(JSON.parse(savedLibrary));
    }
  }, []);

  const calculateProgress = (pagesRead, totalPages) => {
    return totalPages > 0 ? Math.round((pagesRead / totalPages) * 100) : 0;
  };

  // Fetch content from backend when starting to read
  const startReading = async (book) => {
    setCurrentReadingBook(book);
    setCurrentPage(book.pagesRead || 0);
    setLoadingContent(true);
    setBookContent(null);

    try {
      console.log('📖 Fetching content for:', book.title);
      const response = await fetch(`http://localhost:8000/api/books/search-and-read?query=${encodeURIComponent(book.title)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const bookData = await response.json();
      console.log('✅ Full content loaded:', bookData.content.length, 'characters');
      setBookContent(bookData.content);
    } catch (error) {
      console.error('❌ Error loading book content:', error);
      // Fallback: use whatever content we have in localStorage
      setBookContent(book.content || "Content not available. Please try searching for this book again on the Dashboard.");
    } finally {
      setLoadingContent(false);
    }
  };

  const closeReader = () => {
    setCurrentReadingBook(null);
    setCurrentPage(0);
    setBookContent(null);
  };

  const updateReadingProgress = (bookId, pagesRead) => {
    const updatedBooks = libraryBooks.map(b => 
      b.id === bookId ? { ...b, pagesRead: pagesRead, lastRead: new Date().toISOString() } : b
    );
    setLibraryBooks(updatedBooks);
    localStorage.setItem('littyLibrary', JSON.stringify(updatedBooks));
  };

  // Use the freshly fetched content instead of localStorage content
  const getCurrentPageContent = () => {
    if (loadingContent) {
      return { text: "📥 Loading full book content...", totalPages: 1 };
    }
    
    if (!bookContent) {
      return { text: "No content available", totalPages: 1 };
    }
    
    const totalPages = currentReadingBook.totalPages || 1;
    const words = bookContent.split(/\s+/);
    const wordsPerPage = Math.ceil(words.length / totalPages);
    
    const startIndex = currentPage * wordsPerPage;
    const endIndex = Math.min(startIndex + wordsPerPage, words.length);
    
    return {
      text: words.slice(startIndex, endIndex).join(' '),
      totalPages: totalPages
    };
  };

  const nextPage = () => {
    const contentInfo = getCurrentPageContent();
    if (currentPage < contentInfo.totalPages - 1) {
      setCurrentPage(currentPage + 1);
      const newPagesRead = Math.max(currentReadingBook.pagesRead || 0, currentPage + 1);
      updateReadingProgress(currentReadingBook.id, newPagesRead);
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const removeFromLibrary = (bookId) => {
    const updatedLibrary = libraryBooks.filter(book => book.id !== bookId);
    setLibraryBooks(updatedLibrary);
    localStorage.setItem('littyLibrary', JSON.stringify(updatedLibrary));
    alert('Book removed from library!');
  };

  // FULL SCREEN Reading Modal Component
  const ReadingModal = () => {
    if (!currentReadingBook) return null;

    const contentInfo = getCurrentPageContent();
    const totalPages = currentReadingBook.totalPages || contentInfo.totalPages;
    const currentProgress = calculateProgress(currentPage + 1, totalPages);

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#F8F9FC',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        fontFamily: "'Poppins', sans-serif"
      }}>
        {/* Header Bar */}
        <div style={{
          backgroundColor: 'white',
          padding: '1rem 2rem',
          borderBottom: '2px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '40px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              {currentReadingBook.cover && currentReadingBook.cover.startsWith('http') ? (
                <img 
                  src={currentReadingBook.cover} 
                  alt={currentReadingBook.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <span style={{ fontSize: '1.5rem' }}>{currentReadingBook.cover || '📖'}</span>
              )}
            </div>
            <div>
              <h2 style={{ 
                margin: 0, 
                color: '#0A2E5C',
                fontSize: '1.3rem',
                fontWeight: '700'
              }}>
                {currentReadingBook.title}
              </h2>
              <p style={{ 
                margin: 0, 
                color: '#4A5568',
                fontSize: '0.9rem'
              }}>
                by {currentReadingBook.author}
              </p>
              {loadingContent && (
                <p style={{ 
                  margin: '0.25rem 0 0 0', 
                  color: '#FF6B35',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  📥 Loading full book content...
                </p>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {/* Progress Info */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: '#4A5568' }}>
                Page {currentPage + 1} of {totalPages}
              </div>
              <div style={{ fontSize: '1rem', color: '#FF6B35', fontWeight: 'bold' }}>
                {currentProgress}% Complete
              </div>
            </div>
            
            {/* Progress Bar */}
            <div style={{ width: '200px' }}>
              <div style={{
                width: '100%',
                backgroundColor: '#E2E8F0',
                borderRadius: '10px',
                overflow: 'hidden',
                height: '8px',
                marginBottom: '0.25rem'
              }}>
                <div
                  style={{
                    width: `${currentProgress}%`,
                    backgroundColor: '#FF6B35',
                    height: '100%',
                    borderRadius: '10px',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
              <div style={{ fontSize: '0.8rem', color: '#718096', textAlign: 'center' }}>
                {currentPage + 1} / {totalPages} pages
              </div>
            </div>

            <button
              onClick={closeReader}
              style={{
                backgroundColor: '#FF6B35',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#E55A2B';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#FF6B35';
              }}
            >
              Close
            </button>
          </div>
        </div>

        {/* Main Content Area - FULL SCREEN */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem',
          maxWidth: '900px',
          margin: '0 auto',
          width: '100%',
          overflow: 'hidden'
        }}>
          {/* Book Content */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            lineHeight: '1.8',
            fontSize: '1.2rem',
            color: '#2D3748',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginBottom: '2rem'
          }}>
            <div style={{
              whiteSpace: 'pre-wrap',
              textAlign: 'left',
              maxWidth: 'none'
            }}>
              {contentInfo.text}
            </div>
            
            {/* End of Book Message */}
            {currentPage + 1 === totalPages && (
              <div style={{
                textAlign: 'center',
                marginTop: '3rem',
                padding: '3rem',
                backgroundColor: '#E6FFFA',
                borderRadius: '12px',
                border: '2px solid #4ECDC4'
              }}>
                <h3 style={{ color: '#234E52', marginBottom: '1rem', fontSize: '1.5rem' }}>🎉 Congratulations!</h3>
                <p style={{ color: '#234E52', margin: 0, fontSize: '1.1rem' }}>
                  You've finished reading "{currentReadingBook.title}"!
                </p>
                <p style={{ color: '#234E52', margin: '0.5rem 0 0 0', fontSize: '1rem' }}>
                  You read {totalPages} pages in total.
                </p>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            padding: '0 1rem'
          }}>
            <button
              onClick={previousPage}
              disabled={currentPage === 0}
              style={{
                backgroundColor: currentPage === 0 ? '#E2E8F0' : '#0A2E5C',
                color: currentPage === 0 ? '#A0AEC0' : 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                minWidth: '150px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (currentPage !== 0) {
                  e.target.style.backgroundColor = '#082447';
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== 0) {
                  e.target.style.backgroundColor = '#0A2E5C';
                }
              }}
            >
              ← Previous Page
            </button>

            <div style={{
              fontSize: '1rem',
              color: '#4A5568',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              Page {currentPage + 1} of {totalPages}
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage + 1 >= totalPages}
              style={{
                backgroundColor: currentPage + 1 >= totalPages ? '#E2E8F0' : '#FF6B35',
                color: currentPage + 1 >= totalPages ? '#A0AEC0' : 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                cursor: currentPage + 1 >= totalPages ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                minWidth: '150px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (currentPage + 1 < totalPages) {
                  e.target.style.backgroundColor = '#E55A2B';
                }
              }}
              onMouseOut={(e) => {
                if (currentPage + 1 < totalPages) {
                  e.target.style.backgroundColor = '#FF6B35';
                }
              }}
            >
              Next Page →
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      padding: "2rem",
      maxWidth: "1200px",
      margin: "0 auto",
      minHeight: "80vh",
      fontFamily: "'Poppins', sans-serif"
    }}>
      {/* Reading Modal */}
      <ReadingModal />

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{
          color: "#0A2E5C",
          marginBottom: "0.5rem",
          fontSize: "2.5rem",
          fontWeight: "bold"
        }}>
          My Library 📚
        </h1>
        <p style={{
          color: "#4A5568",
          fontSize: "1.1rem",
          marginBottom: "1.5rem"
        }}>
          {libraryBooks.length} books in your collection
        </p>
      </div>

      {/* Stats Overview */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        <div style={{
          backgroundColor: "#FF6B35",
          color: "white",
          padding: "1.5rem",
          borderRadius: "16px",
          textAlign: "center",
          boxShadow: "0 6px 20px rgba(255, 107, 53, 0.3)"
        }}>
          <h3 style={{ margin: 0, fontSize: "2rem" }}>{libraryBooks.length}</h3>
          <p style={{ margin: 0 }}>Total Books</p>
        </div>

        <div style={{
          backgroundColor: "#0A2E5C",
          color: "white",
          padding: "1.5rem",
          borderRadius: "16px",
          textAlign: "center",
          boxShadow: "0 6px 20px rgba(10, 46, 92, 0.3)"
        }}>
          <h3 style={{ margin: 0, fontSize: "2rem" }}>
            {libraryBooks.filter(book => book.pagesRead > 0).length}
          </h3>
          <p style={{ margin: 0 }}>Started Reading</p>
        </div>

        <div style={{
          backgroundColor: "#4ECDC4",
          color: "white",
          padding: "1.5rem",
          borderRadius: "16px",
          textAlign: "center",
          boxShadow: "0 6px 20px rgba(78, 205, 196, 0.3)"        
        }}>
          <h3 style={{ margin: 0, fontSize: "2rem" }}>
            {libraryBooks.filter(book => book.pagesRead === book.totalPages).length}
          </h3>
          <p style={{ margin: 0 }}>Completed</p>
        </div>
      </div>

      {/* Books Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "1.5rem"
      }}>
        {libraryBooks.map((book) => {
          const progress = calculateProgress(book.pagesRead, book.totalPages);

          return (
            <div key={book.id} style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "1.5rem",
              boxShadow: "0 8px 25px rgba(10, 46, 92, 0.1)",     
              border: "none",
              transition: "all 0.3s ease",
              fontFamily: "'Poppins', sans-serif"
            }}>
              {/* Book Cover and Basic Info */}
              <div style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
                marginBottom: "1rem"
              }}>
                <div style={{
                  width: "80px",
                  height: "110px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  overflow: "hidden",
                  flexShrink: 0,
                  backgroundColor: "#f8f9fa"
                }}>
                  {book.cover && book.cover.startsWith('http') ? (
                    <img 
                      src={book.cover} 
                      alt={book.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "2.5rem" }}>{book.cover || "📖"}</span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    margin: "0 0 0.25rem 0",
                    color: "#0A2E5C",
                    fontSize: "1.2rem",
                    fontWeight: "700"
                  }}>
                    {book.title}
                  </h3>
                  <p style={{
                    margin: "0 0 0.5rem 0",
                    color: "#4A5568",
                    fontSize: "0.9rem",
                    fontWeight: "500"
                  }}>
                    by {book.author}
                  </p>
                  <div style={{
                    fontSize: "0.8rem",
                    color: "#718096",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontWeight: "500"
                  }}>
                    <span>📖 {book.totalPages} pages</span>    
                    {book.lastRead && (
                      <span>📅 {new Date(book.lastRead).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: "1rem" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem"
                }}>
                  <span style={{
                    fontSize: "0.9rem",
                    color: "#4A5568",
                    fontWeight: "600"
                  }}>
                    Progress
                  </span>
                  <span style={{
                    fontSize: "0.9rem",
                    color: "#FF6B35",
                    fontWeight: "bold"
                  }}>
                    {progress}%
                  </span>
                </div>
                <div style={{
                  width: "100%",
                  backgroundColor: "#E2E8F0",
                  borderRadius: "10px",
                  overflow: "hidden",
                  height: "8px"
                }}>
                  <div
                    style={{
                      width: `${progress}%`,
                      backgroundColor: "#FF6B35",
                      height: "100%",
                      transition: "width 0.3s ease",
                      borderRadius: "10px"
                    }}
                  />
                </div>
                <div style={{
                  fontSize: "0.8rem",
                  color: "#718096",
                  marginTop: "0.25rem",
                  fontWeight: "500"
                }}>
                  {book.pagesRead} of {book.totalPages} pages read
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: "flex",
                gap: "0.5rem"
              }}>
                <button
                  onClick={() => startReading(book)}       
                  style={{
                    flex: 1,
                    backgroundColor: "#FF6B35",
                    color: "white",
                    border: "none",
                    padding: "0.75rem 1rem",
                    borderRadius: "12px",
                    fontSize: "0.9rem",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#E55A2B";
                    e.target.style.transform = "translateY(-1px)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#FF6B35";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  {book.pagesRead > 0 ? "Continue Reading" : "Start Reading"}
                </button>

                <button
                  onClick={() => removeFromLibrary(book.id)}
                  style={{
                    backgroundColor: "transparent",
                    color: "#718096",
                    border: "1px solid #E2E8F0",
                    padding: "0.75rem",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: '600',
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#FED7D7";  
                    e.target.style.color = "#E53E3E";
                    e.target.style.transform = "translateY(-1px)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#718096";
                    e.target.style.transform = "translateY(0)";  
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {libraryBooks.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "3rem",
          color: "#4A5568",
          fontFamily: "'Poppins', sans-serif",
          marginTop: "2rem"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📚</div>
          <h3 style={{ color: "#0A2E5C", fontWeight: "700", marginBottom: "1rem" }}>Your library is empty</h3>
          <p style={{ fontWeight: "500", marginBottom: "2rem" }}>Search for books on the Dashboard and add them to your library to get started!</p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            style={{
              backgroundColor: "#FF6B35",
              color: "white",
              border: "none",
              padding: "1rem 2rem",
              borderRadius: "12px",
              fontSize: "1rem",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#E55A2B";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#FF6B35";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

export default Library;