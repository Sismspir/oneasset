import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import ImageResize from "quill-image-resize-module-react"; // Import the image resize module

// ReactQuill.Quill.register("modules/imageResize", ImageResize);

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [selectedFields, setSelectedFields] = useState([]);
  const [progress, setProgress] = useState(0);
  const [newArticle, setNewArticle] = useState({
    title: "",
    file: null,
    image: null,
    summary: "",
  });
  const [editArticle, setEditArticle] = useState({
    id: null,
    title: "",
    contentHtml: "",
    image: null,
    summary: "", // New field
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
    setProgress(0);

    const formData = new FormData();
    formData.append("file", newArticle.file);

    try {
      // Start listening for progress updates
      const eventSource = new EventSource("http://localhost:8000/progress");

      eventSource.onmessage = (event) => {
        const progressValue = parseInt(event.data, 10);
        setProgress(progressValue);
        if (progressValue >= 100) {
          eventSource.close();
          setUploading(false);
          console.log();
          alert(`The document was successfully uploaded`);
        }
      };

      // Send file to back-end
      const response = await fetch("http://localhost:8000/process_pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      alert(`Failed to upload article: ${error.message}`);
    }
  };

  const navigate = useNavigate();

  const goHome = () => {
    navigate("/home");
  };

  // useEffect(() => {
  //   uploading &&
  //     progress == 100 &&
  //     alert(`The document was successfully uploaded`);
  // }, [uploading]);

  return (
    <div className="container mx-auto px-4 py-8 -mt-64">
      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        Upload Documents
      </h1>

      {/* New or Edit Article Form */}
      <div className=" bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Upload New Document
        </h2>
        <div className="space-y-4">
          {/* Render the ReactQuill editor with image resizing only when editing */}
          {editArticle.id && (
            <ReactQuill
              theme="snow"
              value={editArticle.contentHtml}
              onChange={(value) =>
                setEditArticle((prev) => ({ ...prev, contentHtml: value }))
              }
              className="w-full border border-gray-300 rounded-lg shadow-sm"
            />
          )}
          {/* File Upload */}
          <div className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus-within:ring focus-within:ring-blue-300">
            <label
              htmlFor="fileInput"
              className="block text-gray-600 cursor-pointer font-semibold mb-1"
            >
              Choose Document (pdf)
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
              className={`bg-[#001529] hover:bg-[#314f6c] text-white font-bold  py-1 px-3 rounded-lg shadow-md transition duration-300 ${
                uploading ? "cursor-not-allowed" : ""
              }`}
            >
              {uploading
                ? "Uploading..."
                : editArticle.id
                ? "Save Changes"
                : "Upload Document"}
            </button>
            <button
              onClick={goHome}
              className="mt-10 cursor-pointer bg-[#445754] hover:bg-[#314f6c] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
            >
              Back To Homepage
            </button>
          </div>

          {uploading && (
            <div className="w-full bg-[#868888] rounded-r-full mt-5">
              <div
                className="bg-green-600 text-sm font-sold text-white text-center py-2 pl-2 leading-none rounded-r-full"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
