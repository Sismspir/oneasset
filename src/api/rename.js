import axios from "axios";

const BASE_URL = window.BASE_URL || "http://localhost:8000";

export const rename = async (session_id, session_name) => {
  //rename
  try {
    const response = await axios.post(`${BASE_URL}/update_session_name`, {
        "session_id": session_id,
        "session_name": session_name
    }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    console.log(response.data);
    return response.data
  } catch (error) {
    console.error("Error fetching GPT answer:", error);
    throw error;
  }
};