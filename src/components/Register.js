import React, { useEffect, useState } from "react";
import { CityEntries } from "../utils/CityEntries";
import Select from "react-select";
import { AiOutlineUpload } from "react-icons/ai";
import { CiCircleRemove } from "react-icons/ci";
import { Link } from "react-router-dom";
import Web3 from "web3";
import TinderABI from "../contracts/Tinder.json";

export const Register = () => {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
    account: null,
    isConnect: false,
  });
  const [isLoading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState(18);
  const [sex, setSex] = useState(null);
  const [city, setCity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = window.ethereum;

        if (!provider) {
          console.error("Please install MetaMask!");
          return;
        }

        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const netId = await web3.eth.net.getId();
        const deploymentNet = TinderABI.networks[netId];

        if (!deploymentNet) {
          console.error("Contract not deployed on this network.");
          return;
        }

        const contract = new web3.eth.Contract(
          TinderABI.abi,
          deploymentNet && deploymentNet.address
        );

        setWeb3Api({
          provider,
          web3,
          contract,
          account: accounts[0] || null,
          isConnect: !!accounts[0],
        });
      } catch (error) {
        console.error("Failed connection:", error);
      }
    };

    init();

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setWeb3Api((prevState) => ({ ...prevState, account: accounts[0] }));
      } else {
        setWeb3Api((prevState) => ({ ...prevState, account: null }));
      }
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  const handleConnect = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setWeb3Api((prevState) => ({
      ...prevState,
      account: accounts[0],
      isConnect: true,
    }));
  };

  const handleDisconnect = () => {
    setWeb3Api({
      provider: null,
      web3: null,
      contract: null,
      account: null,
      isConnect: false,
    });
  };

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

        <div className="Sign-in-container flex flex-column">
          <button onClick={signUp} className="Sign-up-btn">
            Sign up
          </button>
          <Link to="/log-in">You haven't an account? Let's make one!</Link>
          <p>® Privacy has been declared.</p>
        </div>
      </div>

      <div>
        {isLoading ? (
          <p className="Connect-btn">Loading...</p>
        ) : (
          <span>
            {web3Api.isConnect ? (
              <button
                className="Connect-btn cursor-pointer bg-connect-btn-to"
                onClick={handleDisconnect}
              >
                Disconnect
                <span style={{ marginLeft: "10px" }}>
                  {web3Api.account?.slice(0, 6) || "Not connected"}
                </span>
              </button>
            ) : (
              <button
                className={`Connect-btn cursor-pointer ${
                  web3Api.isConnect ? "bg-connect-btn-to" : "bg-connect-btn"
                }`}
                onClick={handleConnect}
              >
                Connect
              </button>
            )}
          </span>
        )}
      </div>
    </div>
  );
};
