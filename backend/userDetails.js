import mongoose from "mongoose";

const UserDetailsSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true
    },
    lname: {
      type: String,
      required: true
    },
    email: { 
      type: String, 
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    userType: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"]
    },
    department: String,
    phone: {
      type: String,
      validate: {
        validator: function(phone) {
          return phone.length === 10; // Check if phone length is exactly 10
        },
        message: "Phone number must be exactly 10 digits long"
      }
    },
    profilePicture: {
      type: String,
      default: ""
    },
    isLoggedIn: { type: Boolean, default: false },
  },
  {
    collection: "UserInfo",
    timestamps: true,
  }
);

const UserInfo = mongoose.model("UserInfo", UserDetailsSchema);

export default UserInfo;
