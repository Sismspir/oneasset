import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import { deleteDocument } from "../api/deleteDocument";
import { getDocuments } from "../api/getDocuments";

const DocumentTable = ({ documents, onDelete }) => {
  const [docInfo, setDocInfo] = useState();
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleDelete = async (doc) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${doc}"?`
    );
    if (!confirmDelete) return;

    try {
      await deleteDocument(doc);
      onDelete(doc); // Remove document from state in parent component
      alert(`"${doc}" deleted successfully.`);
    } catch (error) {
      alert(`Failed to delete "${doc}": ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchDocumentsInfo = async () => {
      if (!documents || documents.length === 0) return;

      try {
        const fetchedDocs = await Promise.all(
          documents.map(async (doc) => {
            const data = await getDocuments(doc);
            return data || { filename: doc, error: "No info available" };
          })
        );

        setDocInfo(fetchedDocs);
      } catch (error) {
        console.error("Error fetching document info:", error);
      }
    };

    fetchDocumentsInfo();
  }, [documents]);

  return (
    <div className="mt-2 relative top-0 left-0 border-b-2 border-white w-full overflow-x-hidden overflow-y-auto bg-white rounded-3xl z-30">
      {/* Document Table */}
      <table className="w-full border-collapse rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="py-3 px-4 text-left">Document Name</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {docInfo?.length > 0 ? (
            docInfo?.map((doc, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition-all cursor-pointer"
                onClick={() => setSelectedDoc(doc)}
              >
                <td className="py-3 px-4">{doc.file_name}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(doc.file_name);
                    }}
                    className="text-red-500 hover:text-red-700 transition-all"
                  >
                    X
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="py-4 text-center text-gray-500">
                No documents available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Document Details Section */}
      {selectedDoc && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50 shadow-md">
          <h2 className="text-lg font-semibold mb-3">Document Details</h2>

          <p className="mb-4">
            <strong>File Name:</strong> {selectedDoc.file_name} (
            {selectedDoc.number_of_pages} pages)
          </p>

          <p className="mb-4">
            <strong>Owner:</strong> {selectedDoc.owner}
          </p>

          <p className="mb-4">
            <strong>Upload Date:</strong> {selectedDoc.upload_date}
          </p>

          <div className="text-justify mb-4">
            <strong>Summary:</strong>
            <ReactMarkdown>
              {selectedDoc.summary
                ? selectedDoc.summary
                    ?.replace(/(?:\n|^)(#+\s)/g, "")
                    ?.replace(/^\d+\.\s+/gm, "• ")
                    ?.replace(/(?<!\w)-|-(?!\w)/g, "`  `")
                : "No summary available"}
            </ReactMarkdown>
          </div>

          <div className="mb-4 flex gap-4 align-center">
            <strong>Tags: </strong>
            <div className="flex flex-wrap gap-2">
              {JSON.parse(selectedDoc?.tags)?.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-400 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <button
            className="mt-3 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            onClick={() => setSelectedDoc(null)}
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};

DocumentTable.propTypes = {
  documents: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DocumentTable;
