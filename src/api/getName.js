
import axios from "axios";

const BASE_URL = window.BASE_URL || "http://localhost:8000";

export const fetchUserName = async () => {
    console.log(`BASE_URL: ${BASE_URL}`)
    try {
      
      const response = await axios.get(`${BASE_URL}/api/user`);
      return  window.BASE_URL ? (response.data.name == null ?  "spyridon.sisman" : response.data.name) : "spyridon.sisman"; 
      // return "spyridon.sisman"
    } catch (error) {
      console.error('Error fetching the user name:', error);
    }
  };
