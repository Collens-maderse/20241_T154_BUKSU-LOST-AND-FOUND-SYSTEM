import React from 'react';
import '../styles/About.css'; // Ensure correct path for the About page's styling

function About() {
  return (
    <div className="about">
      <div className="about-container">
        <h2>About BukSU Lost and Found System</h2>
        <p>
          Welcome to the BukSU Lost and Found System! This platform is dedicated to helping 
          students and staff at Bukidnon State University easily find and return lost items. 
          By fostering a sense of community and responsibility, this system ensures that 
          misplaced belongings are promptly reunited with their rightful owners.
        </p>
        <p>
          Whether you’ve lost something valuable or found an item that belongs to someone 
          else, our system is here to assist you. Join us in creating a supportive environment 
          where everyone plays a role in maintaining trust and goodwill within our campus.
        </p>
        <p>
          <strong>Key Features:</strong>
        </p>
        <ul>
          <li>Easily post and search for lost or found items.</li>
          <li>Secure and user-friendly interface.</li>
          <li>Support for various item categories.</li>
        </ul>
        <p>
          Let’s work together to ensure that no item remains lost for too long. Thank you for 
          using the BukSU Lost and Found System!
        </p>
      </div>
    </div>
  );
}

export default About;
