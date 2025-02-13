import React, { useState, useEffect, useContext } from "react";
import { PdfContext } from "../components/Screen";
import ReactMarkdown from "react-markdown";
import PropTypes from "prop-types";
import Plot from "react-plotly.js";
import { PiThumbsUp, PiThumbsDown } from "react-icons/pi";
// import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FiDownload } from "react-icons/fi";
import Rate from "./popUps/Rate";
import handleDownload from "../utils/handleDownload";

const TextStream = (props) => {
  const { text, responseComplete, citations } = props;
  const [displayedText, setDisplayedText] = useState(""); // State to hold the displayed text
  const [wordIndex, setWordIndex] = useState(0); // Index to keep track of the current word
  const [popOpen, setPopOpen] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [thumbsOpen, setThumbsOpen] = useState(false);
  const [graphIsShown, setGraphIsShown] = useState(false);

  // Split the input text into individual words
  const words = text?.split(" ");

  useEffect(() => {
    if (wordIndex < words.length) {
      const timeout = setTimeout(() => {
        // Append the next word to the displayed text
        setDisplayedText((prev) => prev + " " + words[wordIndex]);
        setWordIndex(wordIndex + 1); // Move to the next word
      }, 40); // Delay in milliseconds for each word

      // Clear the timeout if the component unmounts
      return () => clearTimeout(timeout);
    } else {
      responseComplete(true);
    }
  }, [wordIndex, words, responseComplete]); // Re-run the effect whenever wordIndex changes

  return (
    <div className="whitespace-pre-wrap relative h-full">
      {graphIsShown ? (
        <div className="w-128 h-64 max-h-64 overflow-y-auto flex items-center justify-center">
          {chartData ? (
            <Plot
              data={chartData.data.map((trace) => ({
                ...trace,
                type: "line", // Set the chart type to 'bar'
              }))}
              layout={{ ...chartData.layout, width: 650, height: 350 }}
            />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>
      ) : (
        <div>
          {/* Display the progressively revealed text */}
          <div className="text-md text-left leading-relaxed transition-all ease-in-out whitespace-pre-wrap">
            <ReactMarkdown>{displayedText}</ReactMarkdown>
          </div>
        </div>
      )}
      {citations?.["D4C Guidelines"] &&
        `\n Answer based on D4C Guidelines, pages: ${citations?.[
          "D4C Guidelines"
        ]?.join(", ")}`}
      {citations?.["ISO"] &&
        `\n Answer based on ISO Standards, pages: ${citations?.["ISO"]?.join(
          ", "
        )}`}
      {citations?.["Claims Addendum"] &&
        `\n Answer based on Claims Addendum, pages: ${citations?.[
          "Claims Addendum"
        ]?.join(", ")}`}
      {citations?.["Claims Protocol"] &&
        `\n Answer based on Claims Protocol, pages: ${citations?.[
          "Claims Protocol"
        ]?.join(", ")}`}

      <div>
        <div className="flex gap-4 cursor-pointer absolute left-16 -bottom-6">
          <button
            onClick={() => handleDownload(text)}
            className="items-center gap-1 text-sm font-semibold flex text-start hover:text-blue-500"
          >
            <FiDownload /> Download
          </button>
        </div>
        {thumbsOpen && <Rate />}
      </div>
    </div>
  );
};

TextStream.propTypes = {
  text: PropTypes.string.isRequired,
  responseComplete: PropTypes.func.isRequired,
  citations: PropTypes.object.isRequired,
};

export default TextStream;
