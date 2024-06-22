import React from "react";
import "./SearchBar.css";

const SearchBar = () => {
  return (
    <div className="search-box-container">
      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder=" Type document name or number..."
        />
        <button>Search</button>
      </div>
      <i class="fa-solid fa-bell"></i>
    </div>
  );
};

export default SearchBar;
