import axios from "axios";

const BASE_URL = window.BASE_URL || "http://localhost:8000";

export const getDocumentNames = async (owner) => {
  //ask
  console.log(`BASE_URL: ${BASE_URL}`)
  console.log(`This is the owner passed to backend ${owner}`)
  try {
    const response = await axios.post(`${BASE_URL}/get_document_names`, {
      "pdf_owner": owner
    }, {
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
