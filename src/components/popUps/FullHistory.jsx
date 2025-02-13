import { useState } from "react";
import PropTypes from "prop-types";
import { FaExchangeAlt } from "react-icons/fa";

const FullHistory = (props) => {
  const { toggleHistory, questions } = props;

  return (
    <div className="absolute top-0 h-full max-h-fit overflow-y-auto shadow-picShadow rounded-md bg-[#aff3d3] text-[#112447] w-[20%] border-r-2 border-b-2 border-[#161555] text-sm">
      <div className="mt-5 pb-4 border-b border-[#2d2525] font-medium flex justify-center gap-2">
        <div>History</div>
        <div className="my-auto cursor-pointer" onClick={() => toggleHistory()}>
          <FaExchangeAlt />
        </div>
      </div>
      <div>
        {questions.map((item, index) => (
          <div
            key={index}
            className="p-4 bg-[#c9eeda] text-[#112447] font-medium hover:bg-[#9ed3b7] hover:cursor-pointer rounded-md mb-2 flex justify-between"
          >
            {item.name}
            <button
              className=""
              onClick={() => console.log("clicked")}
            ></button>
          </div>
        ))}
      </div>
    </div>
  );
};

FullHistory.propTypes = {
  questions: PropTypes.array.isRequired,
  toggleHistory: PropTypes.func.isRequired,
};
export default FullHistory;
