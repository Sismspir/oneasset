import axios from "axios";

const BASE_URL = window.BASE_URL || "http://localhost:8000";

export const removeFromFavorites = async (user_id, session_id) => {
  //ask
  try {
    const response = await axios.post(`${BASE_URL}/unmark_favorite`, {
      "user_id": window.BASE_URL ? user_id : "spyridon.sisman",
      "session_id": session_id,
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
