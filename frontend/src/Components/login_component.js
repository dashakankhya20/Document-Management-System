import React, { useState, useContext } from "react";
import "./login_component.css";
import { MyContext } from "./MyContext";
import axios from "axios";

const Login = () => {
  const { user, setUser } = useContext(MyContext);
  const [localUser, setLocalUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login-user", {
        email,
        password,
      });
      const data = await response.data;
      if (data.status === "ok") {
        console.log("Login Data: ", data.user);
        setLocalUser(data.user);
        setUser(localUser);
        window.localStorage.setItem("token", data.data);
        window.localStorage.setItem("loggedIn", true);
        alert("Login successful");
        window.location.href = "/";
      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  console.log(localUser);

  return (
    <div className="login-bg">
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <h3>Sign In</h3>

          <div className="form-div">
            <label>Email address</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-div">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;