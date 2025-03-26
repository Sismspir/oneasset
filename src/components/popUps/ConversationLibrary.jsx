import { useState, useEffect } from "react";
import { getDocumentNames } from "../../api/getDocumentNames";
import { fetchUserName } from "../../api/getName";
import DocumentTable from "../DocumentTable";

const ConversationLibrary = () => {
  const [documentNames, setDocumentNames] = useState([]);
  const [userName, setUserName] = useState("");

  const fetchDocuments = async () => {
    try {
      const result = await getDocumentNames(userName);
      setDocumentNames(result);
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  useEffect(() => {
    getName();
    fetchDocuments();
  }, [userName]);

  const handleDeleteDocument = (deletedDoc) => {
    // Update the state to remove the deleted document
    setDocumentNames((prevDocs) =>
      prevDocs.filter((doc) => doc !== deletedDoc)
    );
  };

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  const getName = async () => {
    try {
      const result = await fetchUserName();
      console.log(result);
      const match = result.match(/^([a-zA-Z]+)\.([a-zA-Z]+)@[\w.-]+$/);
      if (match) {
        const fullName = `${capitalize(match[1])} ${capitalize(match[2])}`;
        setUserName(fullName);
        console.log(fullName); // Spyridon Sismanis
      }
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-full h-full w-full">
      <div className="rounded-md bg-white w-full h-[90.5vh]">
        <DocumentTable
          documents={documentNames}
          onDelete={handleDeleteDocument}
          userName={userName}
        />
      </div>
    </div>
  );
};

export default ConversationLibrary;
