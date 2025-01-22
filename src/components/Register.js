import React from "react";
import { CityEntries } from "../utils/CityEntries";
import Select from "react-select";

export const Register = () => {
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
          <span className="Profile flex"></span>
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
        <div className="Sign-btn">
          <button>Sign in</button>
        </div>
      </div>
    </div>
  );
};
