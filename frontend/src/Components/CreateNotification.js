import axios from 'axios';

const createNotification = async (message, department) => {
  try {
    const response = await axios.post('http://localhost:5000/createNotification', {
      message: message,
      department: department
    });

    console.log(response.data); // Log the response from the server

    // Handle success response here if needed
    return response.data; // Return the created notification data
  } catch (error) {
    console.error('Error creating notification:', error.message);
    throw error; // Rethrow the error to handle it in the calling code
  }
};

export default createNotification;
