import React from "react";
import GoogleLoginButton from "../components/GoogleLoginButton";


const Profile = ({ user, onLogout,onLoginSuccess }) => {
  return (
    <div className="profile-container">
      {user ? (
        <div className="user-info">
          <h2>Welcome, {user.name}!</h2>
          <p>Email: {user.email}</p>
          <button onClick={onLogout} className="logout-button">Logout</button>
        </div>
      ) : (
        <div className="login-container">
          <p>Please sign in to view your profile:</p>
          <GoogleLoginButton onLoginSuccess={onLoginSuccess} />
        </div>
      )}
    </div>
  );
};

export default Profile;
