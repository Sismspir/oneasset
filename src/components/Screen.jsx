import { useState, useEffect, useRef, createContext } from "react";
import PropTypes from "prop-types";
import logo from "/packImages/pack.png";
import Loader from "./Loader";
import TextStream from "./TextSteaming";
import DisplayPdf from "./DisplayPdf";
import ReactMarkdown from "react-markdown";
import Rate from "../components/popUps/Rate";
import { HiArrowCircleUp } from "react-icons/hi";
import { fetchGptAnswer } from "../api/getResponse";
import { PiThumbsUp, PiThumbsDown } from "react-icons/pi";
import extractPage from "../utils/convertLink";
import { fetchUserName } from "../api/getName";
import generateTimestampAndRandomString from "../api/getSession";
export const PdfContext = createContext(null);

const Screen = (props) => {
  const {
    userTypes,
    toggleUserTypes,
    conversationPicked,
    toggleBoolFetchHistory,
    userName,
  } = props;

  const [convHistory, setConvHistory] = useState([]); // History of conversation (Q&A)
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tempQuestion, setTempQuestion] = useState("");
  const startPlaceHolder =
    "Feel free to ask me anything about packaging! How can I assist you?";
  const [placeholder, setPlaceholder] = useState(startPlaceHolder);
  const [selectedImageSrc, setSelectedImageSrc] = useState(null);
  const chatContainerRef = useRef(null);
  const stylesQ =
    "w-1/3 max-w-[24rem] bg-gray-300 hover:bg-gray-200 text-gray-800 font-medium rounded-xl flex gap-10 items-center justify-center shadow-custom-dark cursor-pointer h-[4.5rem] min-h-[4.5rem]";
  const [fullName, setFullname] = useState("");
  const textareaRef = useRef(null);
  const [responseIsComplete, setResponseIsComplete] = useState(null);

  const handlePdfToggle = (index) => {
    setConvHistory((prevHistory) =>
      prevHistory.map((entry, i) =>
        i === index ? { ...entry, isPdfOpen: !entry.isPdfOpen } : entry
      )
    );
  };

  const getName = async () => {
    try {
      const result = await fetchUserName();
      const name = result != undefined ? result?.split(".")[0] : undefined;
      const surname = result != undefined ? result?.split(".")[1] : undefined;
      setFullname(
        name?.charAt(0).toUpperCase() + surname?.charAt(0).toUpperCase()
      );
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputSubmit = async (e, question = inputText) => {
    e.preventDefault();
    // Clear the input field
    setTempQuestion(question);
    toggleUserTypes(true);
    setIsLoading(true);
    setResponseIsComplete(false);

    try {
      // generate message id
      const newMsgId = generateTimestampAndRandomString(10).rchars;

      const result = await fetchGptAnswer(userName, question, newMsgId);

      console.log("response: ", result?.answer, typeof result);
      console.log("ciatations: ", result?.citations);
      console.log("message_id: ", result?.message_id);

      setConvHistory((prevHistory) => {
        const updatedHistory = [
          ...prevHistory,
          {
            user: question,
            assistant: result?.answer,
            image: result?.image,
            citations: result?.citations,
            isGenerated: true, // Mark this response as newly generated
            isPdfOpen: false,
            message_id: result?.message_id,
          },
        ];

        return updatedHistory;
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
      setInputText("");
      setResponseIsComplete(false);
    }
    toggleBoolFetchHistory();
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    setPlaceholder(startPlaceHolder);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to auto
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height based on content
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        setInputText((prev) => prev + "\n");
      } else {
        e.preventDefault();
        handleInputSubmit(e);
      }
    }
  };

  const handleQuestionClick = (question) => {
    const syntheticEvent = { preventDefault: () => {} };
    handleInputSubmit(syntheticEvent, question);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const handleResponseComplete = (value) => {
    setResponseIsComplete(value);
  };

  const handleClose = () => {
    setSelectedImageSrc(null);
  };

  const handleThumbsDownClick = (index, showRate) => {
    setConvHistory((prevHistory) =>
      prevHistory.map((entry, i) =>
        i === index
          ? {
              ...entry,
              thumbsDownClicked: true,
              thumbsUpClicked: false,
              showPopup: false,
              showRate: !showRate,
              emptyRate: false,
            }
          : entry
      )
    );
    setTimeout(() => hidePopup(index), 6000); // Hide pop-up after 3 seconds
  };

  const handleRateSubmit = (index, isRatingValid, thumbsUpClicked) => {
    setConvHistory((prevHistory) =>
      prevHistory.map((entry, i) =>
        i === index
          ? {
              ...entry,
              thumbsUpClicked: thumbsUpClicked,
              thumbsDownClicked: isRatingValid && !thumbsUpClicked,
              showPopup: isRatingValid,
              invalidRatingMessage: !isRatingValid,
            }
          : entry
      )
    );

    // Show invalid rating message pop-up
    setTimeout(() => {
      setConvHistory((prevHistory) =>
        prevHistory.map((entry, i) =>
          i === index
            ? { ...entry, showPopup: false, invalidRatingMessage: false }
            : entry
        )
      );
    }, 6000);
  };

  const handleThumbsUpClick = async (index, showRate, thumbsUpClicked) => {
    setConvHistory((prevHistory) =>
      prevHistory.map((entry, i) =>
        i === index
          ? {
              ...entry,
              thumbsUpClicked: true,
              thumbsDownClicked: false,
              showPopup: false,
              showRate: !showRate,
            }
          : entry
      )
    );

    setTimeout(() => hidePopup(index), 6000); // Hide pop-up after 3 seconds
  };

  const hidePopup = (index) => {
    setConvHistory((prevHistory) =>
      prevHistory.map((entry, i) =>
        i === index ? { ...entry, showPopup: false } : entry
      )
    );
  };

  useEffect(() => {
    setConvHistory(conversationPicked);
    console.log("Now we change the conv picked", conversationPicked);
  }, [conversationPicked]);

  useEffect(() => {
    getName();
  }, []);

  useEffect(() => {
    scrollToBottom();
    console.log("Just scrolled!");
  }, [responseIsComplete]);

  return (
    <div className="h-full w-full flex flex-col bg-stone-200">
      {/* Main Screen before user types */}
      {!userTypes && (
        <div className="flex-1 flex flex-col items-center justify-center ">
          <div className="rounded-full w-48">
            <img
              src={logo}
              alt="Logo"
              className="size-24 mx-auto my-auto rounded-full mb-4"
            />
          </div>
          <div>
            <p className="font-medium text-4xl flex items-center justify-center">
              Chat with OneAsset
            </p>
            <p className="text-md font-medium text-center flex mx-auto justify-center mt-5">
              I’m your AI Assistant, here to help with insights. Please keep
              your questions within these topics and avoid personal inquiries.
            </p>
            <p className="text-md font-medium text-center flex mx-auto justify-center mt-3 mb-10">
              Try one of the examples below or type your own prompt!
            </p>
          </div>
          {/* <div className="flex items-center justify-center gap-4 mb-4 w-full">
            <div
              className={stylesQ}
              onClick={() =>
                handleQuestionClick(
                  "What are the Design for Circularity (D4C) Guidelines?"
                )
              }
            >
              Preselected question 1.
            </div>
            <div
              className={stylesQ}
              onClick={() =>
                handleQuestionClick("What about reusable packaging in B2B?")
              }
            >
              Preselected question 2.
            </div>
            <div
              className={stylesQ}
              onClick={() =>
                handleQuestionClick("What are the main Packaging Challenges?")
              }
            >
              Preselected question 3.
            </div>
          </div> */}
        </div>
      )}

      {/* User has typed */}
      {userTypes && (
        <div className="flex-1 flex max-h-[46rem] overflow-y-auto">
          <div
            ref={chatContainerRef}
            className={`flex flex-col w-full max-w-full overflow-x-hidden`}
          >
            {/* Iterate over convHistory to display all questions and answers */}
            {convHistory?.map((entry, index) => (
              <div key={index}>
                <div className="flex">
                  <div
                    className={`mb-4 flex flex-col ${
                      entry.isPdfOpen ? "w-1/2" : "w-full"
                    }`}
                  >
                    {/* Question */}
                    <div className="justify-end my-2 break-words flex">
                      <div className="bg-gray-600 text-white p-4 rounded-lg flex overflow-hidden">
                        <div className="bg-[#ffffff] rounded-full text-lg  text-black text-center px-2 py-1 h-9">
                          {fullName}
                        </div>
                        <div className="my-auto ml-2 w-full break-words overflow-hidden">
                          {entry.user}
                        </div>
                      </div>
                    </div>

                    {/* Answer */}
                    <div>
                      <div className="flex items-center gap-1 my-2">
                        <div className="rounded-full self-start w-16">
                          <img
                            src={logo}
                            alt="Logo"
                            className="size-14 mx-auto my-auto rounded-full"
                          />
                        </div>
                        <div className="text-black p-4 rounded-lg shadow-md max-w-3xl w-full break-words overflow-hidden whitespace-pre-wrap">
                          {entry.isGenerated &&
                          index === convHistory?.length - 1 ? (
                            <>
                              {/* For the last entry, use TextStream */}
                              <TextStream
                                text={entry?.assistant
                                  ?.replace(/(?:\n|^)(#+\s)/g, "")
                                  ?.replace(/^\d+\.\s+/gm, "• ")
                                  ?.replace(/(?<!\w)-|-(?!\w)/g, "`  `")}
                                responseComplete={handleResponseComplete}
                                citations={
                                  entry.citations !== undefined
                                    ? entry.citations
                                    : {}
                                }
                              />
                            </>
                          ) : (
                            /* For previous entries, display static text */
                            <div>
                              <div>
                                <ReactMarkdown>
                                  {entry?.assistant
                                    ?.replace(/(?:\n|^)(#+\s)/g, "")
                                    ?.replace(/^\d+\.\s+/gm, "• ")
                                    ?.replace(/(?<!\w)-|-(?!\w)/g, "`  `")}
                                </ReactMarkdown>
                                {entry?.citations?.["D4C Guidelines"] &&
                                  `\n Answer based on D4C Guidelines, pages: ${entry?.citations?.[
                                    "D4C Guidelines"
                                  ]?.join(", ")}`}
                                {entry?.citations?.["ISO"] &&
                                  `\n Answer based on ISO Standards, pages: ${entry?.citations?.[
                                    "ISO"
                                  ]?.join(", ")}`}
                                {entry?.citations?.["Claims Addendum"] &&
                                  `\n Answer based on Claims Addendum, pages: ${entry?.citations?.[
                                    "Claims Addendum"
                                  ]?.join(", ")}`}
                                {entry?.citations?.["Claims Protocol"] &&
                                  `\n Answer based on Claims Protocol: ${entry?.citations?.[
                                    "Claims Protocol"
                                  ]?.join(", ")}`}
                              </div>
                            </div>
                          )}
                          {/* ======== Feedback Buttons ======== */}
                          <div className="flex gap-4 mt-2 cursor-pointer">
                            <div
                              onClick={() =>
                                handleThumbsUpClick(
                                  index,
                                  entry.showRate,
                                  entry.thumbsDownClicked,
                                  entry.message_id
                                )
                              }
                              className="hover:opacity-50"
                            >
                              <PiThumbsUp
                                className={
                                  entry.thumbsUpClicked ? "text-blue-500" : ""
                                }
                              />
                            </div>
                            <div
                              onClick={() =>
                                handleThumbsDownClick(
                                  index,
                                  entry.showRate,
                                  entry.thumbsDownClicked,
                                  entry.message_id
                                )
                              }
                              className="hover:opacity-50"
                            >
                              <PiThumbsDown
                                className={
                                  entry.thumbsDownClicked ? "text-red-500" : ""
                                }
                              />
                            </div>
                          </div>
                          {/* Conditional Pop-up */}
                          {entry.showPopup && (
                            <div className="transform bg-[#bcdf97] font-semibold text-gray-700 text-center my-2 p-2 rounded-lg shadow-md italic">
                              Your rating has been successfully submitted!
                            </div>
                          )}
                          {entry.invalidRatingMessage && (
                            <div className="transform bg-red-400 font-semibold text-white text-center my-2 p-2 rounded-lg shadow-md italic">
                              Please select and option or type in the box before
                              proceeding!
                            </div>
                          )}
                          {/* Conditionally Render Rate Component */}
                          {entry.showRate && (
                            <div>
                              <Rate
                                onRateSubmit={(isRatingValid) =>
                                  handleRateSubmit(
                                    index,
                                    isRatingValid,
                                    entry.thumbsUpClicked
                                  )
                                }
                                message_id={entry.message_id}
                                thumbsUpClicked={entry.thumbsUpClicked}
                              />
                            </div>
                          )}
                          <div className="flex gap-4 mt-5 items-center">
                            {entry?.citations &&
                              Object?.keys(entry?.citations)?.length != 0 && (
                                <button
                                  className="h-12 w-28 rounded-xl bg-gray-600 hover:bg-[#0053a0] flex items-center justify-center text-[#ffffff] font-medium p-2 "
                                  onClick={() => handlePdfToggle(index)}
                                >
                                  {/* Check if citations available before displaying the button */}
                                  {entry?.isPdfOpen ? "Hide PDF" : "Show PDF"}
                                </button>
                              )}
                            {/* {entry?.image != null &&
                              entry.image !== "" &&
                              entry.image !== "nan" &&
                              entry.image !== "No Image" && (
                                <div>
                                  {selectedImageSrc ? (
                                    <div
                                      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 cursor-pointer"
                                      onClick={handleClose}
                                    >
                                      <img
                                        src={selectedImageSrc}
                                        className="max-w-4xl max-h-4xl shadow-lg rounded-lg"
                                      />
                                    </div>
                                  ) : (
                                    <div>
                                      <div
                                        onClick={() => {
                                          setSelectedImageSrc(
                                            `./packImages/${extractPage(
                                              entry?.image
                                            )}`
                                          );
                                        }}
                                        className="financial-image-container hover:cursor-pointer"
                                      >
                                        <img
                                          src={`./packImages/${extractPage(
                                            entry?.image
                                          )}`}
                                          alt={``}
                                          style={{
                                            width: "170px",
                                            height: "100px",
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Display PDF section if open */}
                  {entry.isPdfOpen && (
                    <div
                      className={`flex flex-col ${
                        entry.IsPdfOpen ? "w-1/2" : "w-full"
                      } items-start justify-start`}
                    >
                      <DisplayPdf
                        citations={entry?.citations?.["D4C Guidelines"] ?? []}
                        iso={entry?.citations?.["ISO"] ?? []}
                        ADDENDUM={entry?.citations?.["Claims Addendum"] ?? []}
                        ClaimsAddendum={
                          entry?.citations?.["Claims Protocol"] ?? []
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Answer for current question */}
            {isLoading && (
              <div className="flex flex-col items-center gap-1 my-2 max-h-96">
                <div className="justify-end my-2 w-full max-w-full flex">
                  <div className="bg-gray-600 text-white p-4 rounded-lg break-words flex max-w-[95%] overflow-hidden">
                    <div className="bg-[#ffffff] text-black rounded-full text-lg text-center px-2 py-1 h-9">
                      {fullName}
                    </div>
                    <div className="my-auto ml-2 w-full break-words overflow-hidden">
                      {tempQuestion}
                    </div>
                  </div>
                </div>
                <div className="w-full flex">
                  <div className="rounded-full self-start w-16">
                    <img
                      src={logo}
                      alt="Logo"
                      className="size-14 min-w-10 mx-auto my-auto p-3"
                    />
                  </div>
                  <div className="text-black p-4 rounded-lg shadow-md max-w-3xl w-full break-words overflow-hidden whitespace-pre-wrap">
                    <Loader />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Dialogue Container */}
      <div className="h-22 flex flex-col">
        <div className="flex-1 border border-[#bab3b3] rounded-lg bg-[#white] flex gap-1 shadow-custom-dark">
          <form
            className="rounded-md flex-1 flex text-black"
            onSubmit={handleInputSubmit}
          >
            <textarea
              className={`peer m-4 bg-stone-200 outline-none placeholder:italic placeholder:text-[#797575] ${
                placeholder !== startPlaceHolder &&
                "placeholder:font-normal placeholder:text-[#000000]"
              }`}
              id="prompt"
              type="text"
              value={inputText ? inputText : ""}
              onKeyDown={handleKeyDown}
              onChange={handleInputChange}
              placeholder={placeholder}
              rows="1"
              disabled={isLoading}
              style={{
                overflow: "hidden", // Hide scrollbar
                resize: "none", // Disable manual resizing
                width: "100%", // Take full width
                boxSizing: "border-box", // Ensure padding is accounted for
              }}
              ref={textareaRef}
            />
            <button
              disabled={isLoading}
              type="submit"
              className="text-3xl opacity-30 mx-2 text-[#2b5742] my-auto peer-focus:opacity-90 peer-focus:text-[#17102b]"
            >
              <HiArrowCircleUp />
            </button>
          </form>
        </div>
        <div className="text-xs font-light flex-none h-10 mx-auto flex items-center">
          <p className="font-medium">OneAsset is designed to assist you, </p>
          <p>&nbsp;but double-check important information.</p>
        </div>
      </div>
    </div>
  );
};

Screen.propTypes = {
  userTypes: PropTypes.bool.isRequired,
  toggleUserTypes: PropTypes.func.isRequired,
  toggleBoolFetchHistory: PropTypes.func.isRequired,
  conversationPicked: PropTypes.array.isRequired,
  userName: PropTypes.string.isRequired,
};

export default Screen;
