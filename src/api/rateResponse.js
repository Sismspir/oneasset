import axios from 'axios';

const BASE_URL = window.BASE_URL || "http://localhost:8000";

export const rateResponse = async (message_id, feedback_tag, feedback, feedback_text) => {
    const feedback_comment = feedback_text;
    console.log(`MESSAGE ID !!!!! ${message_id}`)
    try {
      const response = await axios.post(`${BASE_URL}/update_feedback`, {
        message_id,
        feedback_comment,
        feedback_tag,
        feedback,
      });
      return response.data; // Return only the data part of the response
    } catch (error) {
      console.error("Error submitting rating:", error);
      throw error; // Re-throw error to handle it in the calling component
    }
  };