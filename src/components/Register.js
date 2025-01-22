import React, { useEffect, useState } from "react";
import { CityEntries } from "../utils/CityEntries";
import Select from "react-select";
import { AiOutlineUpload } from "react-icons/ai";
import { CiCircleRemove } from "react-icons/ci";
import { Link } from "react-router-dom";
import Web3 from "web3";
import TinderABI from "../contracts/Tinder.json";
import detectEthereumProvider from "@metamask/detect-provider";

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

  useEffect(() => {}, []);

  // get data
  // console.log(name, age, sex.value, city.value);

  const handleConnect = () => {
    const init = async () => {
      setLoading(!isLoading);

      const provider = await detectEthereumProvider();
      const web3 = new Web3(provider);

      const netId = await web3.eth.net.getId();
      const deploymentNet = TinderABI.networks[netId];
      const accounts = await web3.eth.getAccounts();

      if (!deploymentNet) {
        console.error("this is not the network id of the deployment");
        return;
      }
      const contract = new web3.eth.Contract(
        TinderABI.abi,
        deploymentNet && deploymentNet.address
      );

      setWeb3Api({
        provider: provider,
        web3: web3,
        contract: contract,
        account: accounts[0],
        isConnect: true,
      });
      setLoading(false);
    };

    if (window.ethereum) {
      init();
    }
  };

  console.log(web3Api);

  const handleDisconnect = () => {
    setWeb3Api((prevStates) => ({
      ...prevStates,
      provider: null,
      web3: null,
      account: null,
      contract: null,
      isConnect: false,
    }));
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

  const signUp = () => {};

  const options = [
    { value: 0, label: "Female" },
    { value: 1, label: "Male" },
  ];

  const genderStyles = {
    menu: (provided) => ({
      ...provided,
      width: "80%", // Adjust width as needed
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
        <div className="Form-detail flex-row">
          <input
            placeholder="name"
            className="input-detail"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="age"
            className="input-detail"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <Select
            className="input-select"
            styles={genderStyles}
            placeholder="sex"
            options={options}
            isSearchable={false}
            isClearable
            onChange={(selectedOption) => setSex(selectedOption)}
            value={sex}
          />
        </div>
        <CityEntries city={city} setCity={setCity} />
        <div className="Sign-in-container flex flex-column">
          <button onClick={() => signUp()} className="Sing-up-btn">
            Sign up
          </button>
          <Link to="/log-in">you haven't account let's make one</Link>
          <p>® The privacy has been declared for.</p>
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
        <span>{web3Api.account}</span>
      </div>
    </div>
  );
};
