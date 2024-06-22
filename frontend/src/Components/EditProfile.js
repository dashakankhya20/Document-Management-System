import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";
import { MyContext } from "./MyContext";

const EditProfile = () => {
  const { setUser } = useContext(MyContext);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();

  // Initialize state variables with default values or empty strings if user is null
  const [fname, setFname] = useState(user ? user.fname : "");
  const [lname, setLname] = useState(user ? user.lname : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [phone, setPhone] = useState(user ? user.phone : "");
  const [department, setDepartment] = useState(user ? user.department : "");
  const [gender, setGender] = useState(user ? user.gender : "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fname") {
      setFname(value);
    } else if (name === "lname") {
      setLname(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "phone") {
      setPhone(value);
    } else if (name === "department") {
      setDepartment(value);
    } else if (name === "gender") {
      setGender(value);
    }
  };

  const handleUpdate = async () => {
    const formData = { fname, lname, email, phone, department, gender };
    try {
      const response = await fetch(
        `http://localhost:5000/editProfile/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      setUser(result.user);
      console.log(JSON.stringify(result.user, null, 2));

      alert("Your profile has been updated!");

      // Navigate to "/" after updating the profile
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="form-container">
      <form>
        <div className="form-item">
          <label>First Name:</label>
          <input
            type="text"
            name="fname"
            value={fname}
            onChange={handleChange}
          />
        </div>

        <div className="form-item">
          <label>Last Name:</label>
          <input
            type="text"
            name="lname"
            value={lname}
            onChange={handleChange}
          />
        </div>

        <div className="form-item">
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>

        <button type="button" onClick={handleUpdate}>
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
