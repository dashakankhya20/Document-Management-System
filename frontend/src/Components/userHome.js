import React, { Component, useEffect, useState } from "react";

export default function UserHome({ userData }) {
  // const logOut = () => {
  //   window.localStorage.clear();
  //   window.location.href = "./sign-in";
  // };
  return (
    <div style={{
      display:"flex",
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center",
      color:"red"
    }}>
      <h3>{userData.fname} {userData.userType == "Admin" && "(Admin)"}</h3>
      <h4>{userData.email}</h4>
      {/* Name<h1>{userData.fname}</h1>
          Email <h1>{userData.email}</h1> */}
      {/* <br /> */}
      {/* <button onClick={logOut} className="btn btn-primary">
            Log Out
          </button> */}
    </div>
  );
}
