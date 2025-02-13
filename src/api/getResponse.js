import axios from "axios";

const BASE_URL = window.BASE_URL || "http://localhost:8000";

export const fetchGptAnswer = async (username, question, newMsgId) => {
  //ask
  console.log(`inside fetchGptAnswer ${username} ${question} ${newMsgId}`)
  try {
    const response = await axios.post(`${BASE_URL}/gpt_answer`, {
        "user_id": window.BASE_URL ? username : "spyridon.sisman",
        "user_input": question,
        "message_id": newMsgId
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
