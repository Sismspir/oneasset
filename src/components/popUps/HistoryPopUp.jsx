import { useState } from "react";
import PropTypes from "prop-types";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaExchangeAlt } from "react-icons/fa";

const HistoryPopUp = (props) => {
  const { questions, removeFavQuestion, toggleHistory } = props;
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to highlight the search term in the question
  const highlightSearchTerm = (text, search) => {
    if (!search.trim()) {
      return text;
    }

    const regex = new RegExp(`(${search})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-300">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Filtered questions based on the search term
  const filteredQuestions = questions.filter((question) =>
    question.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="absolute top-0 h-full max-h-fit overflow-y-auto shadow-picShadow rounded-md bg-[#aff3d3] text-[#112447] w-[20%] border-r-2 border-b-2 border-[#161555] flex flex-col text-sm">
      <div>
        <div className="mt-5 pb-4 border-b border-[#2d2525] font-medium flex justify-center gap-2">
          <div>Favorites</div>
          <div
            className="my-auto cursor-pointer"
            onClick={() => toggleHistory()}
          >
            <FaExchangeAlt />
          </div>
        </div>
        <div>
          <form className="flex justify-center">
            <input
              type="text"
              placeholder="Search by keyword..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="p-2 my-2 bg-[#dfece6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#80b990]"
            />
          </form>
        </div>
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-[#c9eeda] text-[#112447] font-medium hover:bg-[#9ed3b7] hover:cursor-pointer rounded-md mb-2 flex justify-between"
            >
              {highlightSearchTerm(item.name, searchTerm)}
              <button
                className=""
                onClick={() => {
                  removeFavQuestion(item.id), setShowPopup(true);
                  setTimeout(() => {
                    setShowPopup(false);
                  }, 3000);
                }}
              >
                <RiDeleteBin6Line />
              </button>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">No results found</div>
        )}
      </div>
      {showPopup && (
        <div className="fixed bottom-8 left-1 transform  bg-red-400 text-white p-2 rounded-lg shadow-md">
          Question deleted from favorites!
        </div>
      )}
    </div>
  );
};

HistoryPopUp.propTypes = {
  questions: PropTypes.array.isRequired,
  removeFavQuestion: PropTypes.func.isRequired,
  toggleHistory: PropTypes.func.isRequired,
};
export default HistoryPopUp;
