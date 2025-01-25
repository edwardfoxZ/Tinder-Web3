import React, { useEffect, useState } from "react";
import { CityEntries } from "../utils/CityEntries";
import Select from "react-select";
import { AiOutlineUpload } from "react-icons/ai";
import { CiCircleRemove } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import { Connections } from "./Connections";

export const Register = () => {
  const { setWeb3Api, web3Api, isLoading, setLoading, setConnection } =
    useWeb3();
  const [imageUrl, setImageUrl] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState(18);
  const [sex, setSex] = useState(null);
  const [city, setCity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const removeTheImage = () => {
    setImageUrl(null);
  };

  const signUp = async () => {
    setErrorMessage("");

    if (!web3Api.account) {
      setErrorMessage("Please connect your wallet first.");
      return;
    }

    if (!sex) {
      setErrorMessage("Please select your gender.");
      return;
    }

    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!city || !city.value || !city.value.trim()) {
      setErrorMessage("Please select your city.");
      return;
    }

    if (!imageUrl) {
      setErrorMessage("Please upload your profile picture.");
      return;
    }

    try {
      await web3Api.contract.methods
        .register(age, sex.value, name, city.value, imageUrl)
        .send({ from: web3Api.account });
      alert("Registration successful!");
    } catch (error) {
      console.error("Failed registration:", error);
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  const options = [
    { value: 0, label: "Female" },
    { value: 1, label: "Male" },
  ];

  const genderStyles = {
    menu: (provided) => ({
      ...provided,
      width: "80%",
      maxHeight: 200,
      overflowY: "auto",
      backgroundColor: "white",
      borderRadius: 10,
    }),
    option: (provided, state) => ({
      ...provided,
      padding: 10,
      cursor: "pointer",
      backgroundColor: state.isFocused ? "#f0f0f0" : "transparent",
    }),
  };

  return (
    <div className="Register flex">
      <div className="Form flex flex-column items-center">
        <div className="Title flex flex-row justify-space-between">
          <span className="Profile flex">
            {imageUrl ? (
              <img draggable={false} src={imageUrl} alt="userprofile" />
            ) : (
              <>
                <input
                  id="upload-file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  type="file"
                  hidden
                />
                <label htmlFor="upload-file" className="cursor-pointer">
                  <AiOutlineUpload color="white" fontSize="30px" />
                </label>
              </>
            )}
          </span>
          <span>
            {imageUrl && (
              <CiCircleRemove
                onClick={removeTheImage}
                className="cursor-pointer"
                color="white"
                size="25"
              />
            )}
          </span>
          <h1>Welcome to Tinder</h1>
        </div>

        {errorMessage && (
          <div className="Errors text-danger" style={{ color: "red" }}>
            {errorMessage}
          </div>
        )}

        <div className="Form-detail flex-row">
          <input
            placeholder="Name"
            className="input-detail"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Age"
            className="input-detail"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <Select
            className="input-select"
            styles={genderStyles}
            placeholder="Sex"
            options={options}
            isSearchable={false}
            isClearable
            onChange={setSex}
            value={sex}
          />
        </div>

        <CityEntries city={city} setCity={setCity} />
        <Link to="/">Log in</Link>
        <div className="Sign-in-container flex flex-column">
          <button onClick={signUp} className="Sign-up-btn">
            Sign up
          </button>
          <p>® Privacy has been declared.</p>
        </div>
      </div>

      <Connections />
    </div>
  );
};
