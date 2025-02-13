import axios from "axios";

const BASE_URL = window.BASE_URL || "http://localhost:8000";

export const triggerLogout = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/logout`);
        const { logout_url } = response.data;
        window.location.href = logout_url; // Redirect the user
    } catch (error) {
        console.error('Error triggering the logout:', error);
    }
};
