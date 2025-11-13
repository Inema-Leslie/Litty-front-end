import React from "react";

function Analytics() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ color: "#333" }}>Analytics</h1>
      <p>Track your reading activity and time spent on Litty here.</p>

      <div style={{
        marginTop: "1.5rem",
        padding: "1rem",
        backgroundColor: "#f8f8f8",
        borderRadius: "8px"
      }}>
        <h3>Your Stats</h3>
        <ul>
          <li>Books read: 0</li>
          <li>Challenges completed: 0</li>
          <li>Time spent reading: 0 hrs</li>
        </ul>
      </div>
    </div>
  );
}

export default Analytics;
