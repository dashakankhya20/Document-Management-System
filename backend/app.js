import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import Request from "./Requests.js";
import PdfDetails from "./pdfDetails.js";
import UserInfo from "./userDetails.js";
import Notifications from "./Notifications.js";
import Department from "./departmentSchema.js";

dotenv.config();

const app = express();

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use("/files", express.static("files"));


// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // Add this option for MongoDB driver upgrade
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

// Controller and route functions for Forms
// Model and upload setup

const upload = multer({ storage: storage });

// Code for nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "akankhyadash20@gnu.ac.in",
    pass: "dzym qxen wvpa vrpq",
  },
});

// Endpoints for OTP Verification and Password change
let otpCache = {};

app.post("/sendOTP", (req, res) => {
  const { email } = req.body;
  const otp = otpGenerator.generate(4, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });

  const mailOptions = {
    from: "akankhyadash20@gnu.ac.in",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP for password change is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.json({ success: false });
    } else {
      otpCache[email] = otp;
      res.json({ success: true });
    }
  });
});
console.log(otpCache);
app.post("/verifyOTP", (req, res) => {
  const { email, otp } = req.body;
  if (otp === otpCache[email]) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.post("/updatePassword", async (req, res) => {
  const { email, newPassword } = req.body;
  const encryptedPassword = await bcrypt.hash(newPassword, 10);

  try {
    const user = await UserInfo.findOne({ email });
    if (!user) {
      return res.json({ error: "User not found" });
    }

    await UserInfo.updateOne({ email }, { password: encryptedPassword });

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST endpoint for file upload
app.post("/upload-files", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const docName = req.body.docName;
  const docNumber = req.body.docNumber;
  const fileName = req.file.filename;
  const department = req.body.department;
  try {
    await PdfDetails.create({
      docName: docName,
      docNumber: docNumber,
      pdf: fileName,
      department: department,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// GET endpoint to retrieve files
app.get("/get-files", async (req, res) => {
  try {
    const data = await PdfDetails.find({});
    res.send({ status: "ok", data: data });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// GET endpoint for retriving public files for users
app.get("/get-public-files", async (req, res) => {
  try {
    const publicData = await PdfDetails.find({ accessControl: "public" });
    res.send({ status: "ok", data: publicData });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// GET endpoint to retrieve a PDF by ID
app.get("/get-file/:id", async (req, res) => {
  const fileId = req.params.id;
  try {
    const file = await PdfDetails.findById(fileId);
    if (!file) {
      return res
        .status(404)
        .json({ status: "error", message: "File not found" });
    }
    res.send({ status: "ok", data: file });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// DELETE endpoint to delete a file by ID
app.delete("/delete-file/:id", async (req, res) => {
  const fileId = req.params.id;

  try {
    const file = await PdfDetails.findById(fileId);
    if (file) {
      await PdfDetails.findByIdAndDelete(fileId);
      const filePath = `./files/${file.pdf}`;
      fs.unlinkSync(filePath); // Remove the file from storage
      const updatedForms = await PdfDetails.find({});
      res.send({ status: "ok", data: updatedForms });
    } else {
      res.status(404).json({ status: "File not found" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Edit endpoint to update a file by ID
app.put("/update-file/:id", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const fileId = req.params.id;
  const { docName, docNumber, department, remarks } = req.body;

  try {
    // Find the file by its ID
    const fileToUpdate = await PdfDetails.findById(fileId);
    if (!fileToUpdate) {
      return res.status(404).json({ status: "File not found" });
    }

    // Find the latest version number for the document
    const latestVersionFile = await PdfDetails.findOne({
      docName,
      department,
    }).sort({ version: -1 }); // Sort in descending order to get the latest version first

    let nextVersion = "01"; // Default version if no previous versions found
    if (latestVersionFile) {
      const currentVersion = parseInt(latestVersionFile.version, 10);
      nextVersion = (currentVersion + 1).toString().padStart(2, "0");
    }

    // Create a new entry for the updated document
    const updatedFile = new PdfDetails({
      pdf: req.file.filename,
      docName,
      docNumber,
      department,
      remarks,
      version: nextVersion,
    });

    // Save the updated file to the database
    await updatedFile.save();

    // Fetch and return all forms
    const updatedForms = await PdfDetails.find();

    res.json({ status: "ok", data: updatedForms });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});


// PUT endpoint for changing the access control
app.put("/access-control/:pdfId", async (req, res) => {
  const { pdfId } = req.params;
  const { accessControl } = req.body;
  try {
    // Find the PDF document by ID
    const pdfDocument = await PdfDetails.findById(pdfId);

    if (!pdfDocument) {
      return res.status(404).json({ error: "PDF document not found" });
    }

    // Update the access control field
    pdfDocument.accessControl = accessControl;
    await pdfDocument.save();

    return res.json({
      message: "Access control updated successfully",
      pdfDocument,
    });
  } catch (error) {
    console.error("Error updating access control:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Show document information

// Default route
app.get("/", async (req, res) => {
  res.send("Success!!!!!!");
});



app.post("/register", async (req, res) => {
  const {
    fname,
    lname,
    email,
    password,
    userType,
    phone,
    department,
    gender,
    profilePicture,
  } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await UserInfo.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    await UserInfo.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      userType,
      phone,
      department,
      gender,
      profilePicture,
    });
    const allUsers = await UserInfo.find();
    res.json({ status: "ok", users: allUsers });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserInfo.findOne({ email });

    if (!user) {
      return res.json({ error: "User Not found" });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email }, JWT_SECRET, {
        expiresIn: "15m",
      });

      // Update isLoggedIn field to true for the logged-in user
      await UserInfo.findOneAndUpdate({ email }, { isLoggedIn: true });

      // Fetch the updated user
      const updatedUser = await UserInfo.findOne({ email });

      // Include user details and isLoggedIn value in the response
      return res.json({
        status: "ok",
        data: token,
        user: updatedUser,
        isLoggedIn: true,
      });
    } else {
      return res.json({ error: "Invalid Password" });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/log-out", async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await UserInfo.findOne({ email });

    if (!user) {
      return res.json({ error: "User not found" });
    }

    // Update isLoggedIn field to false for the logged-out user
    await UserInfo.updateOne({ email }, { isLoggedIn: false });

    return res.json({ status: "ok", message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    //console.log(user);
    if (user == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }

    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
});

app.listen(5000, () => {
  console.log("Server Started");
});

app.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await UserInfo.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
  }
});

app.post("/deleteUser", async (req, res) => {
  const { userid } = req.body;
  try {
    UserInfo.deleteOne({ _id: userid }, function (err, res) {
      console.log(err);
    });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});

app.patch("/editUser/:id", async (req, res) => {
  const userId = req.params.id;
  const { updatedUserData } = req.body;

  try {
    const updatedUser = await UserInfo.findOneAndUpdate(
      { _id: userId },
      { $set: updatedUserData },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).send({ status: "Error", data: "User not found" });
    }

    const updatedUsers = await UserInfo.find(); // Get updated users collection

    res.send({ status: "Ok", data: updatedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "Error", data: "Internal Server Error" });
  }
});

// Route for edit profile

app.put("/editProfile/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { fname, lname, email, gender, department, phone } = req.body;

  try {
    const user = await UserInfo.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    user.fname = fname || user.fname;
    user.lname = lname || user.lname;
    user.email = email || user.email;
    user.gender = gender || user.gender;
    user.department = department || user.department;
    user.phone = phone || user.phone;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
// get info about a particular user

app.post("/upload-image", async (req, res) => {
  const { base64 } = req.body;
  try {
    await Images.create({ image: base64 });
    res.send({ Status: "ok" });
  } catch (error) {
    res.send({ Status: "error", data: error });
  }
});

//controller functions for requests

app.post("/submit-request", async (req, res) => {
  try {
    const { userId, documentId, content } = req.body;
    console.log(req.body);
    const newRequest = new Request({
      userId,
      documentId,
      content,
    });
    const savedRequest = await newRequest.save();
    res.status(201).json({
      success: true,
      status: "ok",
      message: "Request submitted successfully",
      data: savedRequest,
    });
  } catch (error) {
    console.error("Error submitting request:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/getAllRequests", async (req, res) => {
  try {
    const requests = await Request.find({})
      .populate("userId", "fname lname")
      .populate("documentId", "docName pdf version remarks");

    res.status(200).json({ success: true, requests: requests });
  } catch (error) {
    console.error("Error fetching requests:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error fetching requests" });
  }
});

app.put("/requests/:requestId", async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  try {
    // Find the request by ID
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Update the request status
    request.requestStatus = status;
    await request.save();

    res
      .status(200)
      .json({ message: "Request status updated successfully", request });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// user creation code

// ...

app.post("/createuser", async (req, res) => {
  const { fname, lname, email, password } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await UserInfo.findOne({ email });

    if (existingUser) {
      return res.json({ error: "User Already Exists" });
    }

    await UserInfo.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      userType: "user", // Assuming you want to set a default user type as "user".
      phone,
      department,
      gender,
    });

    res.send({ status: "ok" });
  } catch (error) {
    console.error(error);
    res.json({ status: "error", message: "User creation failed" });
  }
});

// separate controller function for fetching key metrics for admin dashboard

app.get("/getKeyMetricsForAdminDashboard", async (req, res) => {
  try {
    // Query the database to count the total number of documents
    const totalDocumentsUploaded = await PdfDetails.countDocuments();

    // Query the database to count the total number of draft documents
    const totalDraftDocuments = await PdfDetails.countDocuments({
      accessControl: "private",
    });

    // Count total number of requests made by the user
    const totalRequests = await Request.countDocuments();

    // Query the database for users whose userType is not 'Admin'
    const totalNonAdminUsers = await UserInfo.countDocuments({
      userType: "User",
    });

    // Query the database for users whose userType is 'Admin'
    const totalAdminUsers = await UserInfo.countDocuments({
      userType: "Admin",
    });

    // Query the database for users who are currently logged in (online)
    const totalOnlineUsers = await UserInfo.countDocuments({
      isLoggedIn: true,
    });

    // Send the total count of non-admin users, total documents uploaded, total draft documents, and total admin users as the response
    res.status(200).json({
      totalNonAdminUsers: totalNonAdminUsers,
      totalAdminUsers: totalAdminUsers,
      totalDocumentsUploaded: totalDocumentsUploaded,
      totalRequests: totalRequests,
      totalDraftDocuments: totalDraftDocuments,
      totalOnlineUsers: totalOnlineUsers,
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: error.message });
  }
});

// Controller function for creating notifications for users depending upon the department
app.post("/createNotification", async (req, res) => {
  try {
    const { message, department } = req.body;

    // Find all users belonging to the Admin department
    const adminUsers = await UserInfo.find({ department: department });

    // Extract the ObjectIds of admin users
    const adminUserIds = adminUsers.map((user) => user._id);

    // Create a notification with multiple recipients
    const notification = new Notifications({
      message: message,
      recipients: adminUserIds, // Set the recipients array
      recipientsGroup: department,
    });

    // Save the notification document
    const createdNotification = await notification.save();

    res.status(201).json({ success: true, notification: createdNotification });
  } catch (error) {
    console.error("Error creating notifications:", error.message);
    res.status(500).json({
      success: false,
      message: "Error creating notifications",
    });
  }
});

// Controller function for fetching notifications based on the currently logged-in user's _id
app.get("/getNotificationsByUserId/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // Assuming the user's _id is available in the req.user object

    // Find notifications where recipients array contains the user's _id
    const notifications = await Notifications.find({ recipients: userId });

    res.status(200).json({ success: true, notifications: notifications });
  } catch (error) {
    console.error("Error fetching notifications by user ID:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications by user ID",
    });
  }
});

// Controller function for upadting the value of readBy
app.put("/markNotificationAsRead", async (req, res) => {
  try {
    // Extract user ID from request body
    const { userId, notificationId } = req.body;

    // Check if the user exists
    const user = await UserInfo.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the notification exists
    const notification = await Notifications.findById(notificationId);
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    // Add user ID to the readBy array if not already present
    if (!notification.readBy.includes(userId)) {
      notification.readBy.push(userId);
      await notification.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Creating notification controller for a separate user
app.post("/sendNotification/:userId", async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.params.userId;

    // Create a notification for a specific user
    const notification = new Notifications({
      message: message,
      recipients: [userId], // Set the recipient as an array with the provided userId
    });

    // Save the notification document
    const createdNotification = await notification.save();

    res.status(201).json({ success: true, notification: createdNotification });
  } catch (error) {
    console.error("Error sending notification:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error sending notification" });
  }
});

// controller and endpoint for Department
app.post("/department/new", async (req, res) => {
  const { name, description, manager } = req.body;
  try {
    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      res.status(400).json({ message: "Department must be unique!" });
    }
    const newDepartment = new Department({ name, description, manager });
    await newDepartment.save();
    const allDepartments = await Department.find({}, "name");
    res.status(201).json({
      message: "Department added successfully.",
      departments: allDepartments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all departments
app.get("/departments", async (req, res) => {
  try {
    const departments = await Department.find({}, "name");
    res.status(200).json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
