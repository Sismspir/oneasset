import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const BASE_URL = window.BASE_URL || "http://localhost:8000";
  const [uploading, setUploading] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: "",
    file: null,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewArticle((prev) => ({ ...prev, file }));
  };

  const handleUpload = async () => {
    if (!newArticle.file) {
      alert("Please select a file before uploading.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", newArticle.file);

    try {
      const response = await fetch(`${BASE_URL}/process_pdf`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to start processing");
      }

      // Polling to check progress every 3 seconds
      const checkProgress = async () => {
        try {
          const progressResponse = await fetch(`${BASE_URL}/progress`);
          const progressData = await progressResponse.json();

          if (progressData.progress < 100) {
            setTimeout(checkProgress, 3000); // Poll every 3 seconds
          } else {
            // Stop polling when upload is complete
            setTimeout(() => {
              setUploading(false);
              alert("The document was successfully uploaded");
            }, 90000);
          }
        } catch (error) {
          console.error("Error fetching progress:", error);
          setUploading(false);
        }
      };

      checkProgress(); // Start polling
    } catch (error) {
      alert(`Failed to upload article: ${error.message}`);
      setUploading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        Upload Documents
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Upload New Document
        </h2>
        <div className="space-y-4">
          <div className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus-within:ring focus-within:ring-blue-300">
            <label
              htmlFor="fileInput"
              className="block text-gray-600 cursor-pointer font-semibold mb-1"
            >
              Choose Document (PDF)
            </label>
            <div className="relative">
              <input
                type="file"
                id="fileInput"
                accept=".pdf,.ppt"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
              <div className="flex items-center justify-between bg-stone-100 p-2 rounded-lg">
                <span className="text-gray-500">
                  {newArticle.file?.name || "No document selected"}
                </span>
                <span className="bg-[#001529] text-white text-sm px-3 py-1 rounded-lg shadow-md">
                  Browse
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`bg-[#001529] hover:bg-[#314f6c] text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ${
                uploading ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {uploading ? "Uploading..." : "Upload Document"}
            </button>
            <button
              onClick={() => navigate("/home")}
              className="bg-[#445754] hover:bg-[#314f6c] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
            >
              Back To Homepage
            </button>
          </div>

          {/* Moving Loader Bar */}
          {uploading && (
            <div className="w-full bg-gray-300 h-2 rounded-full mt-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1/3 h-2 bg-green-600 animate-pingLoader"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
