import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/main.scss";
import { Connections } from "./Connections";
import { useWeb3 } from "../context/Web3Context";

export const LogIn = () => {
  const { web3Api, setConnection, setLoading, isLoading } = useWeb3();

  const navigate = useNavigate();

  const handleLogIn = async () => {
    setLoading(isLoading);
    const userAddress = await web3Api.account;

    setLoading(!isLoading);

    navigate(`/${userAddress}-profile`);
  };

  return (
    <div className="Register flex">
      <div className="Form flex flex-column items-center">
        <div className="Title flex flex-row justify-space-between">
          <h1>Welcome Back to Tinder</h1>
        </div>
        <div className="Sign-in-container flex flex-column">
          <button onClick={handleLogIn} className="Log-in-btn">
            Log In
          </button>
          <div>
            <Link to="/Sign-up">
              If you haven't registered sign up for free!
            </Link>
          </div>
          <p>® The privacy has been declared for.</p>
        </div>
      </div>

      <Connections />
    </div>
  );
};
