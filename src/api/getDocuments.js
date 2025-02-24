const BASE_URL = window.BASE_URL || "http://localhost:8000";

export const getDocuments = async (filename) => {
    try {
        const response = await fetch(`${BASE_URL}/get_document_info`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ filename }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch documents");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching documents:", error);
        return null;
    }
};
