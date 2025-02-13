import axios from "axios";

const BASE_URL = window.BASE_URL || "http://localhost:8000";
// const BASE_URL = "https://xsegdaasaieus2devas.azurewebsites.net";
// const BASE_URL = "https://athenafinanceeus2devas.azurewebsites.net";

export const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/user-details`);
      console.log(`This is the response ${response} and data ${response.data} and name ${response.data.name}`);
      return window.BASE_URL ? response.data.name : "spyridon.sismanis@effem.com";
    } catch (error) {
      console.error('Error fetching the user name:', error);
    }
  };
