import React from "react";

function BookDetail() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ color: "#333" }}>Book Details</h1>
      <p>Here you’ll find information about the selected book.</p>

      <div style={{
        marginTop: "1.5rem",
        padding: "1rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px"
      }}>
        <h3>Book Title</h3>
        <p>Author: Unknown</p>
        <p>Description: This section will display the book’s summary.</p>
        <button style={{
          backgroundColor: "orange",
          color: "#fff",
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}>
          Add to My Library
        </button>
      </div>
    </div>
  );
}

export default BookDetail;
