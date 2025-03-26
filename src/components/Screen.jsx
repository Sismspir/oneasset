import { useState, useEffect, useRef, createContext } from "react";
import PropTypes from "prop-types";
import logo from "/packImages/pack.png";
import Loader from "./Loader";
import ListItem from "./popUps/ListItem";
import TextStream from "./TextSteaming";
import { BsFillPersonFill } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import Rate from "../components/popUps/Rate";
import { HiArrowCircleUp } from "react-icons/hi";
import { fetchGptAnswer } from "../api/getResponse";
import { PiThumbsUp, PiThumbsDown } from "react-icons/pi";
import { FaMicrophoneAlt } from "react-icons/fa";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
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
    "Feel free to ask me anything about your documents! How can I assist you?";
  const [placeholder, setPlaceholder] = useState(startPlaceHolder);
  const chatContainerRef = useRef(null);
  const [fullName, setFullname] = useState("");
  const textareaRef = useRef(null);
  const [responseIsComplete, setResponseIsComplete] = useState(null);

  const handlePdfToggle = (index, itemOpen) => {
    console.log(`This is the itemOpen ${itemOpen}`);
    setConvHistory((prevHistory) =>
      prevHistory.map((entry, i) =>
        i === index ? { ...entry, [itemOpen]: !entry?.[`${itemOpen}`] } : entry
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
            isExplainabilityOpen: false,
            webSearchOpen: false,
            sqlQueryOpen: false,
            tableOutputOpen: false,
            citationsOpen: false,
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

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const handleResponseComplete = (value) => {
    setResponseIsComplete(value);
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

  const handleThumbsUpClick = async (index, showRate) => {
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
          <div className="rounded-full w-20 max-h-full mt-2">
            <img src={logo} alt="Logo" className="mx-auto my-auto" />
          </div>
          <div>
            <p className="font-medium text-4xl flex items-center justify-center mt-5">
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
                <div className="flex flex-col">
                  <div className={`mb-4 flex flex-col w-full`}>
                    {/* Question */}
                    <div className="justify-end my-2 break-words flex">
                      <div className="bg-[#0000A0] text-white p-4 rounded-lg flex overflow-hidden">
                        <div className="bg-[#ffffff] rounded-full text-lg  text-black text-center px-2 py-1 h-9">
                          {fullName}
                        </div>
                        <div className="my-auto ml-2 w-full break-words overflow-hidden">
                          {entry.user}
                        </div>
                      </div>
                    </div>

                    {/* Answer */}
                    <div className="">
                      <div className="flex items-center gap-1 my-2">
                        <div className="rounded-full w-6 max-h-full flex self-start">
                          <img src={logo} alt="Logo" className="" size={6} />
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
                          <div className="flex flex-col gap-2 mt-5">
                            {entry?.citations &&
                              Object?.keys(entry?.citations)?.length != 0 && (
                                <div className="h-12 w-full rounded-xl bg-gray-100  flex items-center justify-center text-[#12273b] font-medium p-2">
                                  <div className="mx-2">
                                    <BsFillPersonFill size={22} />
                                  </div>
                                  <div className="flex-1">Explainability</div>
                                  <button
                                    className="mx-2"
                                    onClick={() =>
                                      handlePdfToggle(
                                        index,
                                        "isExplainabilityOpen"
                                      )
                                    }
                                  >
                                    {entry.isExplainabilityOpen ? (
                                      <SlArrowUp size={18} />
                                    ) : (
                                      <SlArrowDown size={18} />
                                    )}
                                  </button>
                                </div>
                              )}

                            {/* Display Citations if open */}
                            <div className="flex flex-col gap-4 mt-2">
                              <div className="flex flex-col gap-4 mt-2">
                                {entry.isExplainabilityOpen && (
                                  <div className="flex flex-col relative pl-5">
                                    {/* Vertical Line */}
                                    <div className="absolute left-1.5 top-0 h-full w-[2px] bg-gray-300"></div>
                                    <ListItem
                                      title="Text documents"
                                      isOpen={entry.citationsOpen}
                                      onClick={() =>
                                        handlePdfToggle(index, "citationsOpen")
                                      }
                                      isLast={true} // Last item removes bottom line
                                    />

                                    {/* Display Citations section */}
                                    {entry?.citationsOpen && (
                                      <div className="flex flex-col w-full items-start justify-start">
                                        {Object.entries(entry.citations).map(
                                          ([citationKey, pages]) => (
                                            <div
                                              key={citationKey}
                                              className="mb-2"
                                            >
                                              <span className="font-semibold">
                                                {citationKey.replace(/_/g, " ")}
                                                :
                                              </span>
                                              <span className="ml-2">
                                                Pages {pages.join(", ")}
                                              </span>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    )}

                                    {/* List Items */}
                                    <ListItem
                                      title="Show Sql Query"
                                      isOpen={entry.sqlQueryOpen}
                                      onClick={() =>
                                        handlePdfToggle(index, "sqlQueryOpen")
                                      }
                                    />

                                    {/* Display Sql Query section */}
                                    {entry?.sqlQueryOpen && (
                                      <div className="flex flex-col w-full items-start justify-start bg-gray-100 p-3 rounded-lg shadow">
                                        <p className="font-semibold">
                                          Sql Query:
                                        </p>
                                      </div>
                                    )}

                                    <ListItem
                                      title="Show Web Search"
                                      isOpen={entry.webSearchOpen}
                                      onClick={() =>
                                        handlePdfToggle(index, "webSearchOpen")
                                      }
                                    />

                                    {/* Display Deep Research section */}
                                    {entry?.webSearchOpen && (
                                      <div className="flex flex-col w-full items-start justify-start bg-gray-100 p-3 rounded-lg shadow">
                                        <p className="font-semibold">
                                          Deep Research Insights:
                                        </p>
                                        {/* Add deep research details here */}
                                        <p>
                                          Additional in-depth research about the
                                          topic...
                                        </p>
                                      </div>
                                    )}

                                    <ListItem
                                      title="Show Table"
                                      isOpen={entry.tableOutputOpen}
                                      onClick={() =>
                                        handlePdfToggle(
                                          index,
                                          "tableOutputOpen"
                                        )
                                      }
                                    />

                                    {/* Display Explainability section */}
                                    {entry?.tableOutputOpen && (
                                      <div className="flex flex-col w-full items-start justify-start bg-gray-100 p-3 rounded-lg shadow">
                                        <p className="font-semibold">Table:</p>
                                        {/* Add the explainability content here */}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Answer for current question */}
            {isLoading && (
              <div className="flex flex-col items-center gap-1 my-2 max-h-96">
                <div className="justify-end my-2 w-full max-w-full flex">
                  <div className="bg-[#0000A0] text-white p-4 rounded-lg break-words flex max-w-[95%] overflow-hidden">
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
              type="button"
              onClick={() =>
                window.open(
                  "https://genaisbmvpwaeus2devas.azurewebsites.net/",
                  "_blank"
                )
              }
              className="text-3xl opacity-30 mx-1 text-[#2b5742] my-auto peer-focus:opacity-90 peer-focus:text-[#17102b]"
            >
              <FaMicrophoneAlt size={24} />
            </button>
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
