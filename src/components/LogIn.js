import React from "react";
import { Link } from "react-router-dom";

export const LogIn = () => {
  return (
    <div className="Register flex">
      <div className="Form flex flex-column items-center">
        <div className="Title flex flex-row justify-space-between">
          <h1>Welcome Back to Tinder</h1>
        </div>
        <div className="Form-detail flex-row"></div>
        <div className="Sign-in-container flex flex-column">
          <button className="Sing-up-btn">Log In</button>
          <Link to="/">If you haven't registered sign up for free!</Link>
          <p>® The privacy has been declared for.</p>
        </div>
      </div>
    </div>
  );
};
