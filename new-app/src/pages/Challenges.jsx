import React, { useState, useEffect } from 'react';
import './Challenges.css';

function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [userStreak, setUserStreak] = useState({});
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);

  // Fetch challenges and user progress
  useEffect(() => {
    fetchChallengesData();
  }, []);

  const fetchChallengesData = async () => {
    try {
      const token = localStorage.getItem('littyToken');
      
      // Fetch all available challenges
      const challengesRes = await fetch('http://localhost:8000/api/challenges', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!challengesRes.ok) {
        throw new Error('Failed to fetch challenges');
      }
      
      const challengesData = await challengesRes.json();
      setChallenges(challengesData);

      // Fetch user's challenge progress
      const userChallengesRes = await fetch('http://localhost:8000/api/user/challenges', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (userChallengesRes.ok) {
        const userChallengesData = await userChallengesRes.json();
        setUserChallenges(userChallengesData);
      }

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

    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  // Start a new challenge
  const startChallenge = async (challengeId) => {
    try {
      setEnrolling(challengeId);
      const token = localStorage.getItem('littyToken');
      
      const response = await fetch(`http://localhost:8000/api/challenges/${challengeId}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to start challenge');
      }
      
      // Refresh data to show the newly enrolled challenge
      await fetchChallengesData();
      alert('Challenge started! Your progress will be tracked automatically.');
      
    } catch (error) {
      console.error('Error starting challenge:', error);
      alert(error.message);
    } finally {
      setEnrolling(null);
    }
  };

  // Abandon a challenge
  const abandonChallenge = async (challengeId) => {
    if (!window.confirm('Are you sure you want to abandon this challenge?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('littyToken');
      
      const response = await fetch(`http://localhost:8000/api/challenges/${challengeId}/abandon`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to abandon challenge');
      }
      
      // Refresh data
      await fetchChallengesData();
      alert('Challenge abandoned.');
      
    } catch (error) {
      console.error('Error abandoning challenge:', error);
      alert('Failed to abandon challenge');
    }
  };

  // Log reading session (updates streaks and challenge progress)
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
      
      if (!response.ok) {
        throw new Error('Failed to log reading session');
      }
      
      // Refresh data to show updated streaks and progress
      await fetchChallengesData();
      alert('Reading session logged! Your streaks and challenge progress have been updated.');
    } catch (error) {
      console.error('Error logging reading:', error);
      alert('Failed to log reading session');
    }
  };

  if (loading) {
    return (
      <div className="challenges-container">
        <div className="loading">Loading challenges...</div>
      </div>
    );
  }

  // Helper to find user progress for a challenge
  const getUserChallengeProgress = (challengeId) => {
    return userChallenges.find(uc => uc.challenge_id === challengeId);
  };

  // Check if user is enrolled in a challenge
  const isUserEnrolled = (challengeId) => {
    return userChallenges.some(uc => uc.challenge_id === challengeId);
  };

  return (
    <div className="challenges-container">
      {/* Header Section */}
      <div className="challenges-header">
        <h1>Reading Challenges</h1>
        <p>Complete challenges to build consistent reading habits and earn rewards!</p>
      </div>

      {/* Streak Overview */}
      <div className="streak-section">
        <div className="streak-card">
          <div className="streak-count">
            <span className="streak-number">{userStreak.current_streak || 0}</span>
            <span className="streak-label">Current Streak</span>
          </div>
          <div className="streak-count">
            <span className="streak-number">{userStreak.longest_streak || 0}</span>
            <span className="streak-label">Longest Streak</span>
          </div>
          <div className="streak-count">
            <span className="streak-number">{userStreak.current_week_count || 0}/7</span>
            <span className="streak-label">This Week</span>
          </div>
        </div>

        {/* Quick Action Button */}
        <button className="log-reading-btn" onClick={logReadingSession}>
          📖 Log Today's Reading
        </button>
      </div>

      {/* Challenges Grid */}
      <div className="challenges-grid">
        {challenges.map(challenge => {
          const userProgress = getUserChallengeProgress(challenge.id);
          const isEnrolled = isUserEnrolled(challenge.id);
          const isCompleted = userProgress?.is_completed;
          const progress = userProgress?.progress || 0;
          const progressPercentage = Math.min((progress / challenge.target_value) * 100, 100);
          
          return (
            <div key={challenge.id} className={`challenge-card ${isCompleted ? 'completed' : isEnrolled ? 'enrolled' : ''}`}>
              <div className="challenge-header">
                <h3>{challenge.name}</h3>
                <span className="reward-badge">{challenge.reward_points} pts</span>
              </div>
              
              <p className="challenge-description">{challenge.description}</p>
              
              {/* Progress Section - Only show if enrolled */}
              {isEnrolled && (
                <div className="progress-section">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {progress}/{challenge.target_value}
                  </span>
                </div>
              )}

              {/* Status Badge */}
              <div className="challenge-status">
                {isCompleted ? (
                  <span className="status-badge completed-badge">✅ Completed</span>
                ) : isEnrolled ? (
                  <span className="status-badge in-progress-badge">🎯 In Progress ({progressPercentage.toFixed(0)}%)</span>
                ) : (
                  <span className="status-badge not-started-badge">🔒 Not Started</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="challenge-actions">
                {!isEnrolled ? (
                  <button 
                    className="start-challenge-btn"
                    onClick={() => startChallenge(challenge.id)}
                    disabled={enrolling === challenge.id}
                  >
                    {enrolling === challenge.id ? 'Starting...' : 'Start Challenge'}
                  </button>
                ) : !isCompleted ? (
                  <button 
                    className="abandon-challenge-btn"
                    onClick={() => abandonChallenge(challenge.id)}
                  >
                    Abandon Challenge
                  </button>
                ) : (
                  <span className="completed-text">Challenge Completed! 🎉</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {challenges.length === 0 && (
        <div className="empty-state">
          <h3>No challenges available</h3>
          <p>Check back later for new reading challenges!</p>
        </div>
      )}
    </div>
  );
}

export default Challenges;