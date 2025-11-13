// components/BookCard.jsx
import React from "react";

function BookCard({ title, author, cover, onAddToLibrary, showAddButton = true }) {
  return (
    <div className="book-card" style={{
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '1rem',
      width: '160px',
      textAlign: 'center',
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}>
      {/* Updated cover section to handle both emoji and image URLs */}
      <div style={{
        width: '100px',
        height: '140px',
        margin: '0 auto 0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {cover && cover.startsWith('http') ? (
          <img 
            src={cover} 
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <span>{cover || '📖'}</span>
        )}
      </div>
      
      <h3 style={{ 
        margin: '0.5rem 0', 
        fontSize: '1rem',
        color: '#333',
        height: '2.4rem',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      }}>
        {title}
      </h3>
      <p style={{ 
        margin: '0.25rem 0', 
        fontSize: '0.8rem',
        color: '#666',
        height: '1.2rem',
        overflow: 'hidden'
      }}>
        {author}
      </p>
      
      {showAddButton && onAddToLibrary && (
        <button 
          onClick={onAddToLibrary}
          style={{
            backgroundColor: '#FF6B35',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '0.5rem',
            width: '100%',
            fontSize: '0.8rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#E55A2B';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#FF6B35';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Add to Library
        </button>
      )}
    </div>
  );
}

export default BookCard;