import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

export const CityEntries = () => {
  const [options, setOptions] = useState([]);

  const citiesStyles = {
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

  const fetchCities = async (inputValue) => {
    if (!inputValue) return;

    const apiUrl = `https://api.api-ninjas.com/v1/city?name=${inputValue}`;
    const apiKey = "KKTS4K1PJ//Zah95+vFdBg==VijwajBFBwY9Tj1Q";

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          "X-Api-Key": apiKey,
        },
      });

      if (response.status === 200) {
        const cityOptions = response.data.map((city) => ({
          label: `${city.name}, ${city.country}`,
          value: city.name,
        }));
        setOptions(cityOptions);
      } else {
        console.error("Error:", response.status, response.data);
      }
    } catch (error) {
      console.error("Failed to fetch city details:", error);
    }
  };

  const handleInputChange = (inputValue) => {
    fetchCities(inputValue);
  };

  return (
    <Select
      options={options}
      onInputChange={handleInputChange}
      isClearable
      placeholder="Search for a city"
      onMenuOpen={() => console.log("Menu opened")}
      className="Select-option"
      styles={citiesStyles}
    />
  );
};
