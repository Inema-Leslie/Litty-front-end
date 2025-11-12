import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Analytics from './pages/Analytics';
import Library from './pages/Library';
import BookDetail from './pages/BookDetail';
import Challenges from './pages/Challenges';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on app start
  useEffect(() => {
    const token = localStorage.getItem('littyToken');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  // Handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('littyToken');
    localStorage.removeItem('littyUsername');
    localStorage.removeItem('littyUserId');
    localStorage.removeItem('littyUserEmail');
    setIsAuthenticated(false);
  };

  // If still loading, show loading screen
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: '#F8F9FC'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <h2 style={{ color: '#0A2E5C', marginBottom: '1rem' }}>Loading Litty...</h2>
          <p style={{ color: '#4A5568' }}>Checking authentication</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* Show header and footer only when authenticated */}
      {isAuthenticated && <Header onLogout={handleLogout} />}
      
      <Routes>
        {/* Public routes */}
        <Route 
          path="/auth" 
          element={
            !isAuthenticated ? 
            <Auth onLogin={handleLogin} /> : 
            <Navigate to="/dashboard" />
          } 
        />
        <Route path="/home" element={<Home />} />
        
        {/* Protected routes - redirect to auth if not authenticated */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
            <Dashboard /> : 
            <Navigate to="/auth" />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <Dashboard /> : 
            <Navigate to="/auth" />
          } 
        />
        <Route 
          path="/library" 
          element={
            isAuthenticated ? 
            <Library /> : 
            <Navigate to="/auth" />
          } 
        />
        <Route 
          path="/analytics" 
          element={
            isAuthenticated ? 
            <Analytics /> : 
            <Navigate to="/auth" />
          } 
        />
        <Route 
          path="/challenges" 
          element={
            isAuthenticated ? 
            <Challenges /> : 
            <Navigate to="/auth" />
          } 
        />
        <Route 
          path="/book/:id" 
          element={
            isAuthenticated ? 
            <BookDetail /> : 
            <Navigate to="/auth" />
          } 
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ?
            <Profile onLogout={handleLogout}/> :
            <Navigate to="/auth" />
          }
        />
        
        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} />} />
      </Routes>
      
      {isAuthenticated && <Footer />}
    </BrowserRouter>
  );
}

export default App;