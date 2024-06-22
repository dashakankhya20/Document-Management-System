import React from 'react'
import { useContext } from 'react';
import "./userProfile.css";
import { useNavigate } from 'react-router-dom';
import femaleImage from "./../images/girl1.jpg";
import maleImage from "./../images/blank-male.jfif";
import { MyContext } from './MyContext';

const UserProfile = () => {
  const {user, setUser} = useContext(MyContext);
  const navigate = useNavigate();
  const handleEditProfile = () => {
    navigate("/edit-profile");
  }
  return (
    user && (
      <div className='userprofile'>
      <p>{user.userType == "Admin" && "Admin"}</p>
        <div className='userprofile_img'>

           {user.gender == "female" ? (
            <img src={femaleImage} alt="Female Icon" />
           ) : (
            <img src={maleImage} alt="Male Icon" />
           )}
        </div>
        <div className='userprofile_info'>
            <h4>{user.fname}{" "}{user.lname}</h4>
            <p className='user_email'>{user.email}</p>
            {/* <p>Gender: {user.gender}</p> */}
            <button
            onClick={handleEditProfile}
            >
                Edit Profile
            </button>
            <div className='userprofile_line'>

            </div>
        </div>
    </div>
    )
   
  )
}

export default UserProfile