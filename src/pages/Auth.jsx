// Auth.jsx 
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setDebugInfo("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setDebugInfo("");

    try {
      const endpoint = isLogin ? 'login' : 'register';
      const url = `https://litty-backend.onrender.com/api/auth/${endpoint}`;
      
      setDebugInfo(`Sending request to: ${url}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isLogin ? {
          username: form.username,
          password: form.password
        } : {
          username: form.username,
          password: form.password,
          email: form.email
        })
      });

      setDebugInfo(`Response status: ${response.status}`);
      
      const data = await response.json();
      setDebugInfo(prev => prev + ` | Response: ${JSON.stringify(data)}`);

      if (response.ok) {
        // Save token and user info
        localStorage.setItem('littyToken', data.access_token);
        localStorage.setItem('littyUsername', data.user.username);
        localStorage.setItem('littyUserId', data.user.id);
        localStorage.setItem('littyUserEmail', data.user.email);
        
        alert(`Welcome ${isLogin ? 'back' : ''} to Litty, ${data.user.username}!`);
        onLogin();
        navigate('/dashboard');
      } else {
        setError(data.detail || `${isLogin ? 'Login' : 'Registration'} failed.`);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setDebugInfo(prev => prev + ` | Error: ${error.message}`);
      setError('Network error. Please check if the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAuth = () => {
    if (isLogin) {
      alert(`Welcome back to Litty, ${form.username || 'Demo User'}!`);
      localStorage.setItem('littyUsername', form.username || 'Demo User');
      localStorage.setItem('littyToken', 'demo-token');
      localStorage.setItem('littyUserId', 'demo-123');
      localStorage.setItem('littyUserEmail', 'demo@litty.com');
      onLogin();
      navigate('/dashboard');
    } else {
      if (form.password.length < 8) {
        setError("Password must be at least 8 characters long");
        return;
      }
      if (!form.email) {
        setError("Email is required for registration");
        return;
      }
      alert(`Welcome to Litty, ${form.username}! Your account has been created.`);
      localStorage.setItem('littyUsername', form.username);
      localStorage.setItem('littyToken', 'demo-token');
      localStorage.setItem('littyUserId', 'demo-123');
      localStorage.setItem('littyUserEmail', form.email);
      onLogin();
      navigate('/dashboard');
    }
  };

  return (
    <div style={{
      minHeight: "100vh", 
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0A2E5C 0%, #1A3A6B 100%)",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "white",
        padding: "2.5rem",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(10, 46, 92, 0.3)"
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ 
            margin: "0 0 0.5rem 0",
            fontSize: "2.5rem",
            fontWeight: "800",
            background: "linear-gradient(135deg, #FF6B35, #E55A2B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Litty
          </h1>
          <p style={{
            color: "#4A5568",
            margin: "0",
            fontWeight: "500"
          }}>
            {isLogin ? "Welcome back!" : "Join the reading revolution!"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: "#FED7D7",
            color: "#E53E3E",
            padding: "0.75rem 1rem",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
            fontWeight: "500",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        {/* Debug Info */}
        {debugInfo && (
          <div style={{
            backgroundColor: "#E6FFFA",
            color: "#234E52",
            padding: "0.75rem 1rem",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            fontSize: "0.8rem",
            fontWeight: "500",
            textAlign: "center",
            border: "1px solid #4ECDC4"
          }}>
            Debug: {debugInfo}
          </div>
        )}

        {/* Rest of your form remains exactly the same */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{
              display: "block",
              fontSize: "0.9rem",
              fontWeight: "600",
              color: "#0A2E5C",
              marginBottom: "0.5rem"
            }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              disabled={isLoading}
              style={{
                width: "100%",
                borderRadius: "12px",
                border: "2px solid #E2E8F0",
                padding: "1rem 1.25rem",
                fontSize: "1rem",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: "500",
                outline: "none",
                transition: "all 0.3s ease",
                opacity: isLoading ? 0.7 : 1
              }}
              onFocus={(e) => {
                if (!isLoading) {
                  e.target.style.borderColor = "#FF6B35";
                  e.target.style.boxShadow = "0 0 0 3px rgba(255, 107, 53, 0.1)";
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E2E8F0";
                e.target.style.boxShadow = "none";
              }}
              placeholder="Enter your username"
            />
          </div>

          {!isLogin && (
            <div>
              <label style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "#0A2E5C",
                marginBottom: "0.5rem"
              }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required={!isLogin}
                disabled={isLoading}
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  border: "2px solid #E2E8F0",
                  padding: "1rem 1.25rem",
                  fontSize: "1rem",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "500",
                  outline: "none",
                  transition: "all 0.3s ease",
                  opacity: isLoading ? 0.7 : 1
                }}
                onFocus={(e) => {
                  if (!isLoading) {
                    e.target.style.borderColor = "#FF6B35";
                    e.target.style.boxShadow = "0 0 0 3px rgba(255, 107, 53, 0.1)";
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E2E8F0";
                  e.target.style.boxShadow = "none";
                }}
                placeholder="Enter your email"
              />
            </div>
          )}

          <div>
            <label style={{
              display: "block",
              fontSize: "0.9rem",
              fontWeight: "600",
              color: "#0A2E5C",
              marginBottom: "0.5rem"
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              style={{
                width: "100%",
                borderRadius: "12px",
                border: "2px solid #E2E8F0",
                padding: "1rem 1.25rem",
                fontSize: "1rem",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: "500",
                outline: "none",
                transition: "all 0.3s ease",
                opacity: isLoading ? 0.7 : 1
              }}
              onFocus={(e) => {
                if (!isLoading) {
                  e.target.style.borderColor = "#FF6B35";
                  e.target.style.boxShadow = "0 0 0 3px rgba(255, 107, 53, 0.1)";
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E2E8F0";
                e.target.style.boxShadow = "none";
              }}
              placeholder="Enter your password"
            />
            {!isLogin && (
              <p style={{
                fontSize: "0.8rem",
                color: "#718096",
                marginTop: "0.5rem",
                fontWeight: "500"
              }}>
                Password must be at least 8 characters long
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              backgroundColor: isLoading ? "#CBD5E0" : "#FF6B35",
              color: "white",
              border: "none",
              padding: "1rem",
              borderRadius: "12px",
              fontSize: "1rem",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              marginTop: "0.5rem"
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = "#E55A2B";
                e.target.style.transform = "translateY(-1px)";
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = "#FF6B35";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            {isLoading ? "Please wait..." : (isLogin ? "Login to Litty" : "Create Account")}
          </button>
        </form>

        {/* Demo Mode Button */}
        <button
          onClick={handleDemoAuth}
          disabled={isLoading}
          style={{
            width: "100%",
            backgroundColor: "transparent",
            color: "#FF6B35",
            border: "2px solid #FF6B35",
            padding: "0.75rem",
            borderRadius: "12px",
            fontSize: "0.9rem",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "600",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            marginTop: "1rem",
            opacity: isLoading ? 0.7 : 1
          }}
          onMouseOver={(e) => {
            if (!isLoading) {
              e.target.style.backgroundColor = "#FFF5F0";
              e.target.style.transform = "translateY(-1px)";
            }
          }}
          onMouseOut={(e) => {
            if (!isLoading) {
              e.target.style.backgroundColor = "transparent";
              e.target.style.transform = "translateY(0)";
            }
          }}
        >
          Try Demo Mode
        </button>

        <p style={{
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#718096",
          marginTop: "2rem",
          fontWeight: "500"
        }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setDebugInfo("");
              setForm({ username: "", password: "", email: "" });
            }}
            disabled={isLoading}
            style={{
              background: "none",
              border: "none",
              color: "#FF6B35",
              fontWeight: "700",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "0.9rem",
              fontFamily: "'Poppins', sans-serif",
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>

        {/* Backend Status */}
        <div style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#F7FAFC",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <p style={{
            margin: 0,
            fontSize: "0.8rem",
            color: "#4A5568",
            fontWeight: "500"
          }}>
            {isLoading ? "Connecting to backend..." : "Backend: Ready"}
          </p>
        </div>
      </div>
    </div>
  );
}