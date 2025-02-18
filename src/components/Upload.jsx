import React, { useState, useEffect } from "react";
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

    const formData = new FormData();
    formData.append("file", newArticle.file);
    console.log(`before sending the request ${formData}`);
    try {
      const response = await fetch("http://localhost:8000/process_pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      // setProgress(10); // Start progress bar
      // const requestId = data.request_id;

      // const interval = setInterval(async () => {
      //   const res = await fetch(`http://localhost:8000/progress/${requestId}`);
      //   const progressData = await res.json();
      //   setProgress(progressData.progress);

      //   if (progressData.progress >= 100) {
      //     clearInterval(interval);
      //     alert("Processing complete!");
      //   }
      // }, 1000);

      alert(data.message);
      setNewArticle({ title: "", file: null, image: null, summary: "" });
      setSelectedFields([]);
    } catch (error) {
      console.error("Error uploading article:", error);
      alert(`Failed to upload article: ${error.message}`);
    } finally {
      setUploading(false);
      alert(`File was uploaded successfully!`);
    }
  };

  const handleSaveEdit = async () => {
    setUploading(true);
    const formData = new FormData();

    formData.append("title", editArticle.title);
    formData.append("content_html", editArticle.contentHtml);
    formData.append("summary", editArticle.summary); // Add summary

    if (editArticle.image) {
      formData.append("image", editArticle.image);
    }

    try {
      const response = await fetch(
        `http://localhost:5000/articles/${editArticle.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error: ${response.status} - ${errorText}`);
        alert(`Failed to update article: ${errorText}`);
        return;
      }

      alert("Article updated successfully!");
      setEditArticle({
        id: null,
        title: "",
        contentHtml: "",
        image: null,
        summary: "",
      });
    } catch (error) {
      console.error("Error updating article:", error);
      alert(`Failed to update article: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
    ],
    imageResize: {}, // Enable image resizing
  };

  return (
    <div className="container mx-auto px-4 py-8 ">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Upload Documents
      </h1>

      {/* New or Edit Article Form */}
      <div className="mb-8 bg-white shadow-lg rounded-lg p-6">
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
              modules={modules}
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

          <button
            onClick={editArticle.id ? handleSaveEdit : handleUpload}
            disabled={uploading}
            className={`bg-[#001529] hover:bg-[#314f6c] text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ${
              uploading ? "cursor-not-allowed" : ""
            }`}
          >
            {uploading
              ? "Uploading..."
              : editArticle.id
              ? "Save Changes"
              : "Upload Document"}
          </button>
          {/* 
          <div className="w-full bg-gray-200 rounded-full mt-5">
            <div
              className="bg-blue-600 text-xs font-medium text-white text-center p-0.5 leading-none rounded-full"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Upload;
