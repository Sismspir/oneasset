import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getDocumentNames } from "../api/getDocumentNames";

const SmartSummary = () => {
  const BASE_URL = window.BASE_URL || "http://localhost:8000";
  const [uploading, setUploading] = useState(false);
  const [documentNames, setDocumentNames] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [summary, setSummary] = useState("");

  const fetchDocuments = async () => {
    try {
      const result = await getDocumentNames();
      setDocumentNames(result);
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const [summaryOptions, setSummaryOptions] = useState({
    length: "Medium",
    tone: "Neutral",
    detail: "Balanced",
    orientation: "General",
  });

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setSummaryOptions((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentChange = (e) => {
    setSelectedDocument(e.target.value);
  };

  const handleGenerateSummary = async () => {
    if (!selectedDocument) {
      alert("Please select a document before generating the summary.");
      return;
    }

    setUploading(true);

    const requestData = {
      File_name: selectedDocument,
      Length: summaryOptions.length,
      Tone: summaryOptions.tone,
      "Detail Level": summaryOptions.detail,
      Orientation: summaryOptions.orientation,
    };

    try {
      const response = await fetch(`${BASE_URL}/generate_summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      alert(`Failed to generate summary: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-2 relative top-0 left-0 h-[85vh] w-full overflow-x-hidden overflow-y-auto bg-white rounded-3xl ">
      <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-6 text-center">
        Smart Summary
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">
            Select Document
          </label>
          <select
            name="document"
            value={selectedDocument}
            onChange={handleDocumentChange}
            className="p-2 border rounded w-full"
          >
            <option value="">-- Select a Document --</option>
            {documentNames.map((doc, index) => (
              <option key={index} value={doc}>
                {doc}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {Object.keys(summaryOptions).map((key) => (
            <div key={key}>
              <label className="block text-gray-700">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <select
                name={key}
                value={summaryOptions[key]}
                onChange={handleOptionChange}
                className="p-2 border rounded w-full"
              >
                {["Short", "Medium", "Long"].includes(summaryOptions[key]) &&
                  ["Short", "Medium", "Long"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                {["Neutral", "Formal", "Informal"].includes(
                  summaryOptions[key]
                ) &&
                  ["Neutral", "Formal", "Informal"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                {["High", "Balanced", "Concise"].includes(
                  summaryOptions[key]
                ) &&
                  ["High", "Balanced", "Concise"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                {[
                  "Business",
                  "Tech",
                  "Academic",
                  "Legal",
                  "General",
                  "Other",
                ].includes(summaryOptions[key]) &&
                  [
                    "Business",
                    "Tech",
                    "Academic",
                    "Legal",
                    "General",
                    "Other",
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            </div>
          ))}
        </div>

        <button
          onClick={handleGenerateSummary}
          className="bg-blue-500 hover:bg-blue-400 hover:cursor-pointer text-white p-2 rounded flex w-1/2 justify-self-center items-center justify-center"
          disabled={!selectedDocument || uploading}
        >
          {uploading ? "Generating..." : "Generate Smart Summary"}
        </button>
      </div>

      {summary && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Generated Summary:
          </h2>
          <div className="text-gray-700 whitespace-pre-line">
            {
              <ReactMarkdown>
                {summary
                  ? summary
                      ?.replace(/(?:\n|^)(#+\s)/g, "")
                      ?.replace(/^\d+\.\s+/gm, "• ")
                  : "No summary available"}
              </ReactMarkdown>
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSummary;
