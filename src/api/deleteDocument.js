import axios from "axios";

const BASE_URL = window.BASE_URL || "http://localhost:8000";

export const deleteDocument = async (document) => {
  console.log(`this is document ${document}`);
  try {
    
    const response = await axios.post(`${BASE_URL}/delete_pdf`, {
        "filename": `${document}`,
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
