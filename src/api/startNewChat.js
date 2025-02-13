import axios from "axios";

const BASE_URL = window.BASE_URL || "http://localhost:8000";

export const startNewChat = async (user_id) => {
  //ask
  console.log(`get Name function is executed for ${user_id}`)
  try {
    const response = await axios.post(`${BASE_URL}/start_new_chat`, {
      "user_id": window.BASE_URL ? user_id : "spyridon.sisman",
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    console.log(response.data, "New chat generated successfully");
    return response.data
  } catch (error) {
    console.error("Error starting new chat:", error);
    throw error;
  }
};


