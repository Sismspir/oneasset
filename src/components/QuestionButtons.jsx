import PropTypes from "prop-types";

const QuestionButtons = ({ handleQuestionClick }) => {
  const stylesQ =
    "w-1/3 max-w-[24rem] bg-[rgb(134,212,104)] hover:bg-[rgb(155,217,131)] text-blue-900 font-medium rounded-xl flex gap-10 text-center shadow-custom-dark cursor-pointer h-[4.5rem] min-h-[4.5rem] p-4";
  const questions = [
    "What are the Design for Circularity (D4C) Guidelines?",
    "What about reusable packaging in B2B?",
    "What are the main Packaging Challenges?",
  ];

  return (
    <div className="flex items-center justify-center gap-4 mb-4 w-full">
      {questions.map((question) => (
        <div
          key={question}
          className={stylesQ}
          onClick={() => handleQuestionClick(question)}
        >
          {question}
        </div>
      ))}
    </div>
  );
};

QuestionButtons.propTypes = {
  handleQuestionClick: PropTypes.func.isRequired,
};

export default QuestionButtons;
