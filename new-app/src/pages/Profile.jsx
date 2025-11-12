import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ onLogout }) => {
  const navigate = useNavigate();
  
  // Get user data from localStorage
  const username = localStorage.getItem('littyUsername') || 'User';
  const email = localStorage.getItem('littyUserEmail') || 'No email provided';
  const userId = localStorage.getItem('littyUserId') || 'Unknown';
  
  // Mock reading stats (you can replace with real data later)
  const readingStats = {
    totalBooks: localStorage.getItem('littyLibrary') ? JSON.parse(localStorage.getItem('littyLibrary')).length : 0,
    readingStreak: 7,
    totalReadingTime: '15h 30m',
    favoriteGenre: 'Classic Literature'
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Fallback logout
      localStorage.removeItem('littyToken');
      localStorage.removeItem('littyUsername');
      localStorage.removeItem('littyUserId');
      localStorage.removeItem('littyUserEmail');
      navigate('/auth');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Clear all user data
      localStorage.clear();
      if (onLogout) onLogout();
      navigate('/auth');
      alert('Account deleted successfully');
    }
  };

  return (
    <div style={{
      padding: "2rem",
      maxWidth: "800px",
      margin: "0 auto",
      minHeight: "80vh",
      fontFamily: "'Poppins', sans-serif"
    }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{
          color: "#0A2E5C",
          marginBottom: "0.5rem",
          fontSize: "2.5rem",
          fontWeight: "bold"
        }}>
          My Profile 👤
        </h1>
        <p style={{
          color: "#4A5568",
          fontSize: "1.1rem"
        }}>
          Manage your account and reading preferences
        </p>
      </div>

      <div style={{
        display: "grid",
        gap: "2rem",
        gridTemplateColumns: "1fr 1fr"
      }}>
        {/* Left Column - User Info */}
        <div>
          {/* Profile Card */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 8px 25px rgba(10, 46, 92, 0.1)",
            marginBottom: "2rem"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              marginBottom: "2rem"
            }}>
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#FF6B35",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                color: "white",
                fontWeight: "bold"
              }}>
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{
                  margin: "0 0 0.5rem 0",
                  color: "#0A2E5C",
                  fontSize: "1.5rem"
                }}>
                  {username}
                </h2>
                <p style={{
                  margin: "0",
                  color: "#718096",
                  fontSize: "1rem"
                }}>
                  {email}
                </p>
                <p style={{
                  margin: "0.25rem 0 0 0",
                  color: "#A0AEC0",
                  fontSize: "0.8rem"
                }}>
                  User ID: {userId}
                </p>
              </div>
            </div>

            {/* Account Actions */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem"
            }}>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "#FF6B35",
                  color: "white",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "600",
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
                🚪 Logout
              </button>

              <button
                onClick={handleDeleteAccount}
                style={{
                  backgroundColor: "transparent",
                  color: "#E53E3E",
                  border: "2px solid #E53E3E",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#FED7D7";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                🗑️ Delete Account
              </button>
            </div>
          </div>

          {/* Reading Preferences */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 8px 25px rgba(10, 46, 92, 0.1)"
          }}>
            <h3 style={{
              color: "#0A2E5C",
              marginBottom: "1.5rem",
              fontSize: "1.3rem"
            }}>
              Reading Preferences ⚙️
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "#0A2E5C",
                  marginBottom: "0.5rem"
                }}>
                  Daily Reading Goal
                </label>
                <select style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "2px solid #E2E8F0",
                  fontSize: "1rem",
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "#0A2E5C",
                  marginBottom: "0.5rem"
                }}>
                  Preferred Book Language
                </label>
                <select style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "2px solid #E2E8F0",
                  fontSize: "1rem",
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>Other</option>
                </select>
              </div>

              <button style={{
                backgroundColor: "#0A2E5C",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                fontSize: "1rem",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: "600",
                cursor: "pointer",
                marginTop: "1rem"
              }}>
                Save Preferences
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Reading Stats */}
        <div>
          {/* Reading Statistics */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 8px 25px rgba(10, 46, 92, 0.1)",
            marginBottom: "2rem"
          }}>
            <h3 style={{
              color: "#0A2E5C",
              marginBottom: "1.5rem",
              fontSize: "1.3rem"
            }}>
              Reading Statistics 📊
            </h3>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem",
                backgroundColor: "#F7FAFC",
                borderRadius: "12px"
              }}>
                <div style={{
                  fontSize: "2rem"
                }}>
                  📚
                </div>
                <div>
                  <div style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#0A2E5C"
                  }}>
                    {readingStats.totalBooks}
                  </div>
                  <div style={{
                    fontSize: "0.9rem",
                    color: "#718096"
                  }}>
                    Books in Library
                  </div>
                </div>
              </div>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem",
                backgroundColor: "#F7FAFC",
                borderRadius: "12px"
              }}>
                <div style={{
                  fontSize: "2rem"
                }}>
                  🔥
                </div>
                <div>
                  <div style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#0A2E5C"
                  }}>
                    {readingStats.readingStreak} days
                  </div>
                  <div style={{
                    fontSize: "0.9rem",
                    color: "#718096"
                  }}>
                    Current Streak
                  </div>
                </div>
              </div>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem",
                backgroundColor: "#F7FAFC",
                borderRadius: "12px"
              }}>
                <div style={{
                  fontSize: "2rem"
                }}>
                  ⏱️
                </div>
                <div>
                  <div style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#0A2E5C"
                  }}>
                    {readingStats.totalReadingTime}
                  </div>
                  <div style={{
                    fontSize: "0.9rem",
                    color: "#718096"
                  }}>
                    Total Reading Time
                  </div>
                </div>
              </div>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem",
                backgroundColor: "#F7FAFC",
                borderRadius: "12px"
              }}>
                <div style={{
                  fontSize: "2rem"
                }}>
                  ❤️
                </div>
                <div>
                  <div style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#0A2E5C"
                  }}>
                    {readingStats.favoriteGenre}
                  </div>
                  <div style={{
                    fontSize: "0.9rem",
                    color: "#718096"
                  }}>
                    Favorite Genre
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 8px 25px rgba(10, 46, 92, 0.1)"
          }}>
            <h3 style={{
              color: "#0A2E5C",
              marginBottom: "1.5rem",
              fontSize: "1.3rem"
            }}>
              Achievements 🏆
            </h3>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem"
            }}>
              {['📖', '🔥', '⚡', '🌟', '🎯', '💎'].map((badge, index) => (
                <div key={index} style={{
                  textAlign: "center",
                  padding: "1rem",
                  backgroundColor: "#F7FAFC",
                  borderRadius: "12px"
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                    {badge}
                  </div>
                  <div style={{
                    fontSize: "0.7rem",
                    color: "#718096",
                    fontWeight: "600"
                  }}>
                    {['First Book', '7-Day Streak', 'Speed Reader', 'Book Worm', 'On Target', 'Dedicated'][index]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;