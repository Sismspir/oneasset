import axios from "axios";

const BASE_URL = window.BASE_URL || "http://localhost:8000";

export const getDocumentNames = async (userId) => {
  //ask
  console.log("getting history for", userId)
  console.log(`BASE_URL: ${BASE_URL}`)
  try {
    const response = await axios.get(`${BASE_URL}/get_document_names`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    console.log("documens inside", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching GPT history:", error);
    throw error;
  }
};
