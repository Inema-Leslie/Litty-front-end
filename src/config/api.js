// src/config/api.js
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://Litty-backend.onrender.com';

// Helper function for authenticated requests (matches your current pattern)
const authFetch = (url, options = {}) => {
  const token = localStorage.getItem('littyToken'); // Using your existing token name
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });
};

// Response handler to match your current error handling
export const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Network error' }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const api = {
  // === AUTHENTICATION ===
  login: (username, password) => 
    authFetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  
  register: (userData) =>
    authFetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getCurrentUser: () => authFetch(`${API_BASE_URL}/auth/me`),
  
  checkUsername: (username) => 
    authFetch(`${API_BASE_URL}/auth/check-username/${username}`),

  // === BOOKS & READING ===
  searchAndReadBook: (query) => 
    authFetch(`${API_BASE_URL}/books/search-and-read?query=${encodeURIComponent(query)}`),
  
  getPopularBooks: () => authFetch(`${API_BASE_URL}/books/popular-books`),
  
  testGutenbergSearch: (query = "sherlock holmes") =>
    authFetch(`${API_BASE_URL}/books/test-gutenberg-search?query=${encodeURIComponent(query)}`),
  
  testGutenbergBook: (bookId) =>
    authFetch(`${API_BASE_URL}/books/test-gutenberg-book/${bookId}`),

  // === CHALLENGES ===
  getChallenges: () => authFetch(`${API_BASE_URL}/challenges/`),
  getUserChallenges: () => authFetch(`${API_BASE_URL}/challenges/user/progress`),
  startChallenge: (challengeId) =>
    authFetch(`${API_BASE_URL}/challenges/${challengeId}/start`, {
      method: 'POST',
    }),
  abandonChallenge: (challengeId) =>
    authFetch(`${API_BASE_URL}/challenges/${challengeId}/abandon`, {
      method: 'POST',
    }),
  getUserStreak: () => authFetch(`${API_BASE_URL}/challenges/user/streak`),

  // === READING SESSIONS ===
  logReadingSession: (readingData) =>
    authFetch(`${API_BASE_URL}/reader/log-reading`, {
      method: 'POST',
      body: JSON.stringify(readingData),
    }),
};