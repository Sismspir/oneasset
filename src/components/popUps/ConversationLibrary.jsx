import { useState, useEffect } from "react";
import { getDocumentNames } from "../../api/getDocumentNames";
import DocumentTable from "../DocumentTable";

const ConversationLibrary = () => {
  const [documentNames, setDocumentNames] = useState([]);

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

  const handleDeleteDocument = (deletedDoc) => {
    // Update the state to remove the deleted document
    setDocumentNames((prevDocs) =>
      prevDocs.filter((doc) => doc !== deletedDoc)
    );
  };

  return (
    <div className="max-w-full h-full w-full">
      <div className="rounded-md my-2 bg-white w-full h-[90.5vh]">
        <DocumentTable
          documents={documentNames}
          onDelete={handleDeleteDocument}
        />
      </div>
    </div>
  );
};

export default ConversationLibrary;
