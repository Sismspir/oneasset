import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getDocumentNames } from "../api/getDocumentNames";

const Adherence = () => {
  const BASE_URL = window.BASE_URL || "http://localhost:8000";
  const [uploading, setUploading] = useState(false);
  const [documentNames, setDocumentNames] = useState([]);
  const [selectedDocument1, setSelectedDocument1] = useState("");
  const [selectedDocument2, setSelectedDocument2] = useState("");
  const [adherence, setAdherence] = useState("");

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

  const [adherenceOptions, setAdherenceOptions] = useState({
    Master_Doc: "Guidelines.pdf",
    Target_Doc: "Contract.pdf",
    Adherence_Type: "Guideline Compliance",
    Analysis_Depth: "Standard",
    Focus_Area: "General Content",
    Output_Style: "Detailed Report",
  });

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setAdherenceOptions((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentChange = (e, inputNumber) => {
    if (inputNumber === "Master") {
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
      Master_Doc: selectedDocument1,
      Target_Doc: selectedDocument2,
      Comparison_Type: adherenceOptions.Comparison_Type,
      Comparison_Focus: adherenceOptions.Comparison_Focus,
      Detail_Level: adherenceOptions.Detail_Level,
      Output_Format: adherenceOptions.Output_Format,
    };

    try {
      const response = await fetch(`${BASE_URL}/adherence_analysis`, {
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
      setAdherence(data.result);
    } catch (error) {
      alert(`Failed to generate comparison: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-2 relative top-0 left-0 h-[90.65vh] w-full overflow-x-hidden overflow-y-auto bg-white rounded-3xl">
      <h1 className="text-3xl font-bold text-[#19315e] mt-4 mb-8 text-center">
        Document Adherence
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {["Master", "Target"].map((type) => (
            <div key={type}>
              <label className="block text-gray-700 font-semibold">
                Select {type} Document
              </label>
              <select
                name={`document${type}`}
                value={
                  type === "Master" ? selectedDocument1 : selectedDocument2
                }
                onChange={(e) => handleDocumentChange(e, type)}
                className="p-2 border rounded w-full"
              >
                <option value="">-- Select a Document --</option>
                {documentNames
                  .filter(
                    (doc) =>
                      doc !==
                      (type === "Master"
                        ? selectedDocument2
                        : selectedDocument1)
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
            Adherence_Type: [
              "Guideline Compliance",
              "Content Completeness",
              "Structural Alignment",
              "Factual Consistency",
              "Procedural Adherence",
            ],
            Analysis_Depth: ["Essential", "Standard", "Comprehensive"],
            Focus_Area: [
              "Contractual Terms",
              "Financial Elements",
              "Technical Specifications",
              "Process Descriptions",
              "Legal Compliance",
              "General Content",
            ],
            Output_Style: [
              "Summary",
              "Detailed Report",
              "Action Items",
              "Compliance Matrix",
            ],
          }).map(([key, options]) => (
            <div key={key}>
              <label className="block text-gray-700">
                {key.replace(/_/g, " ")}
              </label>
              <select
                name={key}
                value={adherenceOptions[key]}
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
          {uploading ? "Generating..." : "Generate Document Adherence"}
        </button>
      </div>

      {adherence && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Generated adherence:
          </h2>
          <div className="text-gray-700 whitespace-pre-line">
            <ReactMarkdown>
              {adherence
                ? adherence
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

export default Adherence;
