import React, { useEffect, useState } from "react";
import "../styles/main.scss";
import { useAccount } from "../Hooks/useAccount";
import { useContract } from "../Hooks/useContract";

export const Profile = () => {
  const { account } = useAccount();
  const { contract } = useContract();
  const [profile, setProfile] = useState({});
  const [imageURL, setImageURL] = useState("default-placeholder.png"); // Default image

  useEffect(() => {
    const fetchProfile = async () => {
      if (account && contract) {
        try {
          const userProfile = await contract.methods.getUser(account).call();
          setProfile(userProfile);

          // Check if image is valid binary, else set default
          if (userProfile.image) {
            const blob = new Blob([userProfile.image], { type: "image/jpeg" }); // Adjust type if needed
            const url = URL.createObjectURL(blob);
            setImageURL(url);
          } else {
            setImageURL("default-placeholder.png"); // Fallback to default image
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          setImageURL("default-placeholder.png"); // Use default on error
        }
      }
    };

    fetchProfile();
  }, [account, contract]);

  return (
    <div className="Profile">
      <div className="Header-profile-container justify-space-between items-center">
        <h1 className="Title">Your Profile</h1>
        <p className="Account">{account || "Not Found"}</p>
      </div>
      <div className="Profile-detail">
        <div className="Image">
          <img src={imageURL} alt="Profile" />
        </div>
        <div>
          <h1>Name: {profile.name || "N/A"}</h1>
          <p>Age: {profile.age || "N/A"}</p>
          <p>City: {profile.city || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};
