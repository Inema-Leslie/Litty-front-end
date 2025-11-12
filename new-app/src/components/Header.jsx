// components/Header.jsx - Updated without emojis
import React from "react";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  const headerStyle = {
    backgroundColor: '#0A1931', // Navy
    color: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 20px rgba(10, 25, 49, 0.15)',
    fontFamily: "'Nunito', sans-serif"
  };

  const navLinkStyle = (isActive) => ({
    color: 'white',
    textDecoration: 'none',
    fontWeight: isActive ? '800' : '600',
    padding: '0.75rem 1.25rem',
    borderRadius: '50px',
    backgroundColor: isActive ? '#CC5500' : 'transparent',
    transition: 'all 0.3s ease',
    fontSize: '1rem'
  });

  return (
    <header style={headerStyle}>
      <Link to="/dashboard" style={{ 
        textDecoration: 'none', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '2rem', 
          fontWeight: '800',
          background: 'linear-gradient(135deg, #FFD166, #CC5500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Litty
        </h1>
      </Link>
      <Link to="/profile" style={{
        textDecoration: 'none',
        color: '#0A2E5C',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        👤 Profile
        </Link> 
      
      <nav style={{ display: 'flex', gap: '0.5rem' }}>
        <Link to="/dashboard" style={navLinkStyle(location.pathname === '/dashboard')}>
          Dashboard
        </Link>
        <Link to="/library" style={navLinkStyle(location.pathname === '/library')}>
          Library
        </Link>
        <Link to="/challenges" style={navLinkStyle(location.pathname === '/challenges')}>
          Challenges
        </Link>
        <Link to="/analytics" style={navLinkStyle(location.pathname === '/analytics')}>
          Analytics
        </Link>
      </nav>
    </header>
  );
}

export default Header;
