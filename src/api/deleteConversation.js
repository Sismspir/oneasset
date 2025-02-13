import axios from "axios";

const BASE_URL = window.BASE_URL || "http://localhost:8000";

export const deleteConversation = async (user_id, sessionId) => {
  //ask
  try {
    
    const response = await axios.post(`${BASE_URL}/delete_session`, {
        "user_id": window.BASE_URL ? user_id : "spyridon.sisman",
        "session_id": sessionId,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
    const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
    console.log(data);
    return response.data
  } catch (error) {
    console.error("Error fetching GPT history:", error);
    throw error;
  }
};
