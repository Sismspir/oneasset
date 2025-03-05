import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getDocumentNames } from "../api/getDocumentNames";

const SmartComparison = () => {
  const BASE_URL = window.BASE_URL || "http://localhost:8000";
  const [uploading, setUploading] = useState(false);
  const [documentNames, setDocumentNames] = useState([]);
  const [selectedDocument1, setSelectedDocument1] = useState("");
  const [selectedDocument2, setSelectedDocument2] = useState("");
  const [comparison, setComparison] = useState("");

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
    Comparison_Type: "General",
    Comparison_Focus: "Balanced",
    Detail_Level: "Moderate",
    Output_Format: "Structured",
  });

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setSummaryOptions((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentChange = (e, inputNumber) => {
    if (inputNumber === 1) {
      setSelectedDocument1(e.target.value);
      if (selectedDocument2 === e.target.value) {
        setSelectedDocument2("");
      }
    } else {
      setSelectedDocument2(e.target.value);
      if (selectedDocument1 === e.target.value) {
        setSelectedDocument1("");
      }
    }
  };

  const handleGenerateSummary = async () => {
    if (!selectedDocument1 || !selectedDocument2) {
      alert(
        "Please select two different documents before generating the comparison."
      );
      return;
    }

    setUploading(true);

    const requestData = {
      File_name1: selectedDocument1,
      File_name2: selectedDocument2,
      Comparison_Type: summaryOptions.Comparison_Type,
      Comparison_Focus: summaryOptions.Comparison_Focus,
      Detail_Level: summaryOptions.Detail_Level,
      Output_Format: summaryOptions.Output_Format,
    };

    try {
      const response = await fetch(`${BASE_URL}/compare_documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate comparison");
      }

      const data = await response.json();
      setComparison(data.comparison);
    } catch (error) {
      alert(`Failed to generate comparison: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-2 relative top-0 left-0 h-[90.65vh] w-full overflow-x-hidden overflow-y-auto bg-white rounded-3xl">
      <h1 className="text-3xl font-bold text-[#19315e] mt-4 mb-8 text-center">
        Smart Comparison
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[1, 2].map((num) => (
            <div key={num}>
              <label className="block text-gray-700 font-semibold">
                Select Document {num}
              </label>
              <select
                name={`document${num}`}
                value={num === 1 ? selectedDocument1 : selectedDocument2}
                onChange={(e) => handleDocumentChange(e, num)}
                className="p-2 border rounded w-full"
              >
                <option value="">-- Select a Document --</option>
                {documentNames
                  .filter(
                    (doc) =>
                      doc !==
                      (num === 1 ? selectedDocument2 : selectedDocument1)
                  )
                  .map((doc, index) => (
                    <option key={index} value={doc}>
                      {doc}
                    </option>
                  ))}
              </select>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {Object.entries({
            Comparison_Type: [
              "General",
              "Chronological",
              "Thematic",
              "Strategic",
              "Data-focused",
            ],
            Comparison_Focus: ["Similarities", "Differences", "Balanced"],
            Detail_Level: ["Brief", "Moderate", "Comprehensive"],
            Output_Format: ["Narrative", "Structured", "Executive"],
          }).map(([key, options]) => (
            <div key={key}>
              <label className="block text-gray-700">
                {key.replace(/_/g, " ")}
              </label>
              <select
                name={key}
                value={summaryOptions[key]}
                onChange={handleOptionChange}
                className="p-2 border rounded w-full"
              >
                {options.map((option) => (
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
          disabled={!selectedDocument1 || !selectedDocument2 || uploading}
        >
          {uploading ? "Generating..." : "Generate Smart Comparison"}
        </button>
      </div>

      {comparison && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Generated Comparison:
          </h2>
          <div className="text-gray-700 whitespace-pre-line">
            <ReactMarkdown>
              {comparison
                ? comparison
                    ?.replace(/(?:\n|^)(#+\s)/g, "")
                    ?.replace(/^\d+\.\s+/gm, "• ")
                : "No comparison available"}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartComparison;
