import axios from "axios";

const BASE_URL = window.BASE_URL || "http://localhost:8000";

export const getHistory = async (userId) => {
  //ask
  console.log("getting history for", userId)
  console.log(`BASE_URL: ${BASE_URL}`)
  try {
    const response = await axios.post(`${BASE_URL}/get_user_conversations`, {
        "user_id":  window.BASE_URL ? userId : "spyridon.sisman"
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
    return response.data
  } catch (error) {
    console.error("Error fetching GPT history:", error);
    throw error;
  }
};
