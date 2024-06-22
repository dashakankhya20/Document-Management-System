import axios from 'axios';

const sendNotification = async (message, userId) => {
  try {
    const response = await axios.post(`http://localhost:5000/sendNotification/${userId}`, {
      message: message
    });

    console.log(response.data); // Log the response from the server

    // Handle success response here if needed
    return response.data; // Return the created notification data
  } catch (error) {
    console.error('Error sending notification:', error.message);
    throw error; // Rethrow the error to handle it in the calling code
  }
};

export default sendNotification;
