import React, { useState } from "react";
import { CityEntries } from "../utils/CityEntries";
import Select from "react-select";
import { AiOutlineUpload } from "react-icons/ai";
import { CiCircleRemove } from "react-icons/ci";

export const Register = () => {
  const [imageUrl, setImageUrl] = useState(null);

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
          <input placeholder="name" className="input-detail" type="text" />
          <input placeholder="age" className="input-detail" type="number" />
          <Select
            className="input-select"
            styles={genderStyles}
            placeholder="sex"
            options={options}
            isSearchable={false}
            isClearable
          />
        </div>
        <CityEntries />
        <div className="Sign-in-container flex flex-column">
          <button className="Sing-up-btn">Sign up</button>
          <a href="">you haven't account let's make one</a>
          <p>® The privacy has been declared for.</p>
        </div>
      </div>
    </div>
  );
};
