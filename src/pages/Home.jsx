import './Home.css';
import React from "react";
import BookCard from "../components/BookCard";
import { useNavigate } from 'react-router-dom';

function Home() {
  const featuredBooks = [
    { title: "The Singing Tortoise", author: "Ama Ata Aidoo", cover: "🐢" },
    { title: "Anansi and the Sky God", author: "Kwame Nyong'o", cover: "🕷️" },
    { title: "Why Mosquitoes Buzz", author: "Yaa Mensah", cover: "🦟" },
    { title: "The Magic Calabash", author: "Kofi Asante", cover: "🪣" },
    { title: "Lion's Whisker", author: "Esi Edugyan", cover: "🦁" },
    { title: "The Clever Rabbit", author: "Akua Darko", cover: "🐰" },
    { title: "Dance of the Drums", author: "Nana Kwesi", cover: "🥁" },
    { title: "The Golden Stool", author: "Abena Serwaa", cover: "👑" },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Read Stories. Level Up. 📚✨</h1>
          <p className="hero-subtitle">
            Discover African folktales and modern stories while building your reading streak
          </p>
          <div className="hero-buttons">
            <button className="cta-button primary">Start Reading Free</button>
            <button className="cta-button secondary">Browse Stories</button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Stories</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Readers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">🔥</span>
            <span className="stat-label">Daily Streaks</span>
          </div>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="featured-section">
        <h2 className="section-title">✨ Trending Stories</h2>
        <div className="book-grid">
          {featuredBooks.map((book, index) => (
            <BookCard key={index} {...book} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📖</div>
            <h3>Read Stories</h3>
            <p>Choose from hundreds of African folktales and modern fiction</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎮</div>
            <h3>Earn Badges</h3>
            <p>Complete reading challenges and unlock achievements</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔥</div>
            <h3>Build Streaks</h3>
            <p>Read daily to maintain your streak and level up</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Start Your Reading Journey?</h2>
        <p>Join thousands of readers building their reading habit</p>
        <button className="cta-button primary large">Get Started - It's Free</button>
      </section>
    </div>
  );
}

export default Home;