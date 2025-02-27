import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { startNewChat } from "../api/startNewChat";
import { IoBookOutline } from "react-icons/io5";
import { BsChatDots } from "react-icons/bs";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { IoStarOutline } from "react-icons/io5";
import { VscCompass } from "react-icons/vsc";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { IoDocumentsOutline } from "react-icons/io5";
import { IoLibraryOutline } from "react-icons/io5";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { AiOutlineDelete } from "react-icons/ai";
import { GrFavorite } from "react-icons/gr";
import { HiDotsHorizontal } from "react-icons/hi";
import { getHistory } from "../api/getHistory";
import { selectChat } from "../api/selectChat";
import { rename } from "../api/rename";
import DisplayFavorites from "./DisplayFavorites";
import { saveAsFavorite } from "../api/saveAsFavorite";
import { deleteConversation } from "../api/deleteConversation";
import { ImHome } from "react-icons/im";
import { useNavigate } from "react-router-dom";

const Navbar = (props) => {
  const {
    navbarOpen,
    toggleNavbar,
    updateNavItems,
    toggleUserTypes,
    changeSessionId,
    toggleConversationPicked,
    boolFetchHistory,
    userName,
    visisbleComponent,
  } = props;
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [optionsIndex, setOptionsIndex] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showFavPopup, setShowFavPopup] = useState(false);
  const [editIndex, setEditIndex] = useState(null); // Track the question being edited
  const [editValue, setEditValue] = useState(""); // Temporary value for the edit input

  const [backEndHistory, setBackEndHistory] = useState({}); // athena logic for history

  const openNavClass = "flex items-center gap-x-2";
  const hoverClass = "hover: w-full hover:bg-blue-500";

  const navigate = useNavigate();
  const goHome = () => {
    navigate("/home");
  };

  const deleteConv = async (id) => {
    console.log(id, "removed");
    try {
      const result = await deleteConversation(userName, id);
      console.log(result?.answer);
    } catch (err) {
      console.log(err);
    } finally {
      fetchHistory(userName);
      toggleUserTypes();
      try {
        const result = await startNewChat(userName);
        console.log(
          `Start new chat was executed inside the deleteConv function`,
          result
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleEditInputChange = (e) => {
    setOptionsIndex(null);
    setEditValue(e.target.value);
  };

  const saveEdit = async (id) => {
    await renameConv(id, editValue); // Call renameConv with the new name
    setEditIndex(null); // Exit edit mode
  };

  const renameQuestion = (id, currentName) => {
    setEditIndex(id); // Enable editing for the specific conversation
    setEditValue(currentName); // Set current name as the input field’s value
    setOptionsIndex(null);
  };

  const renameConv = async (id, newName) => {
    console.log(id, newName);
    try {
      const result = await rename(id, newName);
      console.log(result?.answer);
    } catch (err) {
      console.log(err);
    } finally {
      fetchHistory(userName);
    }
  };

  const saveToFavorites = async (id, isFavorite) => {
    console.log(`question is favorite ${isFavorite}`);
    if (isFavorite) {
      setShowFavPopup(true);
      setOptionsIndex(null);
      setTimeout(() => {
        setShowFavPopup(false);
      }, 3000);
      return;
    }

    try {
      const result = await saveAsFavorite(userName, id);
      console.log(result);
      setOptionsIndex(null);
      // Fetch updated history after saving to favorites
      const updatedHistory = await fetchHistory(userName);
      setBackEndHistory(updatedHistory); // Update state with the latest data
      console.log(updatedHistory);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  };

  // logic to prevent the user from executing the function multiple times
  let isChatInProgress = false;

  const handleNewChat = async () => {
    updateNavItems("");
    if (location.pathname !== "/chat") {
      navigate("/chat");
      return;
    }
    console.log("NEW CHAT BUTTON PRESSED!");
    // Check if the function is already executing
    if (isChatInProgress) return;

    isChatInProgress = true; // Set the flag to indicate the process has started

    try {
      console.log(
        `Inside navbar where start new chat is executed for ${userName}`
      );
      const result = await startNewChat(userName);
      console.log(result?.answer);
    } catch (err) {
      console.log(err);
    } finally {
      // Wait for 0.5 seconds before reloading the page
      setTimeout(() => {
        window.location.reload();
        isChatInProgress = false; // Reset the flag after the reload is triggered
      }, 500);
    }
  };

  const updateConversationHistory = (conversationsArray) => {
    // Map the conversation array to an array of {question, answer} objects
    toggleUserTypes(true);
    const newHistory = conversationsArray?.map((conv) => ({
      user: conv.question,
      assistant: conv.answer,
      image: conv.image,
      citations: conv.citations,
      message_id: conv.message_id,
    }));
    // Update the state with the new conversation history
    toggleConversationPicked(newHistory);
  };

  const fetchHistory = async () => {
    try {
      const result = await getHistory(userName);
      setBackEndHistory(result);
      console.log(
        result,

        typeof result
      );

      return result;
    } catch (err) {
      console.log(err);
    }
  };

  const fetchChat = async (session_id) => {
    try {
      const result = await selectChat(userName, session_id);
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  const removeFavoriteFromHistory = (id) => {
    setBackEndHistory((prevHistory) => {
      const updatedHistory = { ...prevHistory };
      if (updatedHistory[id]) {
        updatedHistory[id].favorite = false; // Set favorite to false instead of removing to maintain structure
      }
      return updatedHistory;
    });
  };

  useEffect(() => {
    fetchHistory(userName);
  }, [boolFetchHistory, userName]);

  // useEffect(() => {
  //   fetchHistory(userName);
  //   console.log(backEndHistory, " line 200");
  //   console.log(
  //     "getHistory is executed with useEffect the first time navbar is loaded."
  //   );
  // }, []);

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-[#0000A0] text-[#ffffff] text-sm font-medium transition-all duration-300  shadow-custom-dark ${
        navbarOpen ? "w-1/6" : "w-16"
      }`}
    >
      <ul className={`flex flex-col`}>
        <li>
          <button
            className={`absolute top-3 left-1 p-3 text-lg ${openNavClass}`}
            onClick={toggleNavbar}
          >
            <HiOutlineMenuAlt1 size={24} />
            <div>
              <p
                className={`transition-all max-h-20 duration-300 overflow-hidden ml-3 text-base italic ${
                  navbarOpen ? "opacity-100" : "opacity-0 max-w-0"
                }`}
              >
                Available Functions
              </p>
            </div>
          </button>
        </li>
        {/* ========= START NEW CHAT ========= */}
        <li
          onClick={() => {
            handleNewChat();
          }}
          className={`w-[85%] mx-auto p-3 cursor-pointer  bg-[#b7d0d8] font-bold text-lg text-gray-800 rounded-lg mb-5 ${
            navbarOpen
              ? "flex items-start gap-4 mt-20"
              : "flex items-center justify-center mt-24"
          } hover:bg-[#c5e2ec]`}
        >
          <div>
            <BsChatDots size={24} color="black" />
          </div>
          <p
            className={`transition-all duration-300 overflow-hidden ${
              navbarOpen ? "opacity-100 max-h-20" : "opacity-0 max-h-0 max-w-0"
            }`}
          >
            {location.pathname == "/chat"
              ? "Start New Chat"
              : "Chat With The Documents"}
          </p>
        </li>
        {/* ========= USER GUIDE ========= */}
        <li
          onClick={() => {
            updateNavItems("Guide");
          }}
          className={`mx-auto px-3 py-2 cursor-pointer mb-1 ${
            navbarOpen ? openNavClass : "flex items-center justify-center"
          }
          ${hoverClass} `}
        >
          <div>
            <VscCompass size={24} />
          </div>
          <p
            className={`transition-all duration-300 overflow-hidden ${
              navbarOpen ? "opacity-100 max-h-20" : "opacity-0 max-h-0 max-w-0"
            }`}
          >
            User Guide
          </p>
        </li>

        {/* ========= DOC LIBRARY ========= */}
        <li
          onClick={() => {
            updateNavItems("Library");
          }}
          className={`mx-auto px-3 py-2 cursor-pointer mt-0 ${
            navbarOpen ? openNavClass : "flex items-center justify-center"
          }
          ${hoverClass} `}
        >
          <div>
            <IoLibraryOutline size={24} />
          </div>
          <p
            className={`transition-all duration-300 overflow-hidden ${
              navbarOpen ? "opacity-100 max-h-20" : " opacity-0 max-h-0 max-w-0"
            }`}
          >
            Documentation Library
          </p>
        </li>
        {/* ========= Smart Comparison ========= */}
        {location.pathname !== "/chat" && (
          <li
            onClick={() => {
              updateNavItems("Comparison");
            }}
            className={`mx-auto p-3 cursor-pointer mb-0 ${
              navbarOpen ? openNavClass : "flex items-center justify-center"
            }
          ${hoverClass} `}
          >
            <div>
              <IoDocumentsOutline size={24} />
            </div>
            <p
              className={`transition-all duration-300 overflow-hidden ${
                navbarOpen
                  ? "opacity-100 max-h-20"
                  : "opacity-0 max-h-0 max-w-0"
              }`}
            >
              Smart Comparison
            </p>
          </li>
        )}
        {/* ========= Document Adherence ========= */}
        {location.pathname !== "/chat" && (
          <li
            onClick={() => {
              updateNavItems("Adherence");
            }}
            className={`mx-auto p-3 cursor-pointer mb-0 ${
              navbarOpen ? openNavClass : "flex items-center justify-center"
            }
          ${hoverClass} `}
          >
            <div>
              <MdOutlineDocumentScanner size={24} />
            </div>
            <p
              className={`transition-all duration-300 overflow-hidden ${
                navbarOpen
                  ? "opacity-100 max-h-20"
                  : "opacity-0 max-h-0 max-w-0"
              }`}
            >
              Document Adherence
            </p>
          </li>
        )}
        {/* ========= Document Summary ========= */}
        {location.pathname !== "/chat" && (
          <li
            onClick={() => {
              if (location.pathname == "/upload") {
                updateNavItems("Summary");
              } else {
                updateNavItems("");
              }
            }}
            className={`mx-auto p-3 cursor-pointer mb-0 ${
              navbarOpen ? openNavClass : "flex items-center justify-center"
            }
          ${hoverClass} `}
          >
            <div>
              <HiOutlineClipboardDocumentCheck size={24} />
            </div>
            <p
              className={`transition-all duration-300 overflow-hidden ${
                navbarOpen
                  ? "opacity-100 max-h-20"
                  : "opacity-0 max-h-0 max-w-0"
              }`}
            >
              Document Summary
            </p>
          </li>
        )}
        {/* ========= FAVORITES ========= */}
        {location.pathname == "/chat" && (
          <li
            className={`cursor-pointer ${
              navbarOpen
                ? "flex flex-col items-start justify-start gap-1"
                : `py-2 flex items-center justify-center pl-5 hover:bg-blue-500`
            } `}
          >
            <div
              className={`flex gap-2 ${
                navbarOpen
                  ? "p-3 mb-0 hover:bg-blue-500 w-full"
                  : "flex items-center justify-center"
              } `}
            >
              <IoStarOutline size={24} />
              <p
                className={`transition-all duration-300 overflow-hidden ${
                  navbarOpen
                    ? "opacity-100 max-h-20"
                    : "opacity-0 max-h-0 max-w-0"
                }`}
              >
                Favorites
              </p>
            </div>
            <DisplayFavorites
              navbarOpen={navbarOpen}
              userName={userName}
              favorites={backEndHistory}
              changeSessionId={changeSessionId}
              updateConversationHistory={updateConversationHistory}
              removeFavoriteFromHistory={removeFavoriteFromHistory}
            />
          </li>
        )}
        {/* ========= HISTORY ========= */}
        {location.pathname == "/chat" && (
          <li
            className={`cursor-pointer ${!navbarOpen && "hover:bg-gray-500"}`}
          >
            <div
              className={`cursor-pointer ${
                navbarOpen
                  ? "flex p-3 justify-start gap-1 hover:bg-blue-500 w-full"
                  : "flex items-center justify-center ml-0 p-3"
              }`}
            >
              <IoBookOutline size={24} />
              {navbarOpen && <div className="ml-1">History</div>}
            </div>
            {navbarOpen && (
              <div className="space-y-2 w-full overflow-x-hidden h-[32vh] max-h-[32vh] overflow-y-auto text-white ml-0 pl-3">
                {Object?.keys(backEndHistory)
                  .sort(
                    (a, b) =>
                      new Date(backEndHistory[b].date) -
                      new Date(backEndHistory[a].date)
                  )
                  .map((key, index) => {
                    const conversationsArray =
                      backEndHistory[key]?.conversations;
                    const conversation = backEndHistory[key];
                    const sessionName = conversation?.session_name;
                    return (
                      <div
                        key={`${key}-${index}`}
                        onClick={() => {
                          console.log(typeof key, "line 287 in navbar", key);
                          changeSessionId(key);
                          fetchChat(key);
                          updateConversationHistory(conversationsArray);
                        }}
                        className="relative rounded-md p-1 mt-2 text-sm flex items-center gap-1 w-full max-w-full cursor-pointer hover:bg-blue-500"
                        onMouseEnter={() => setHoveredIndex(key)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        {editIndex === key ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={handleEditInputChange}
                            onBlur={() => saveEdit(key)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && saveEdit(key)
                            }
                            className="border-b-2 border-[#20ceb1] w-full p-1 focus:outline-none  bg-black focus:border-2 focus:border-slate-200"
                            autoFocus
                          />
                        ) : (
                          <span className="truncate">
                            {sessionName.slice(0, 60)}
                          </span>
                        )}

                        <div
                          className="cursor-pointer w-8"
                          style={{
                            visibility:
                              hoveredIndex === key ? "visible" : "hidden",
                            minWidth: "24px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOptionsIndex(optionsIndex === key ? null : key);
                          }}
                        >
                          <HiDotsHorizontal size={20} />
                        </div>

                        {optionsIndex === key && (
                          <div className="absolute top-full right-1 bg-[#ffffff] border p-2 rounded-xl z-50 flex flex-col mt-1 shadow-lg">
                            <button
                              className="p-2 cursor-pointer  bg-[#9bc6d3] font-bold text-md text-black rounded-lg hover:bg-[#c5e2ec]"
                              onClick={(e) => {
                                e.stopPropagation();
                                renameQuestion(key, sessionName);
                              }}
                            >
                              <div className="flex items-center justify-center gap-3">
                                <MdDriveFileRenameOutline />
                                Rename
                              </div>
                            </button>
                            <button
                              className="p-2 cursor-pointer  bg-[#9bc6d3] font-bold text-md text-black rounded-lg mt-1 hover:bg-[#c5e2ec]"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteConv(key);
                                fetchHistory(userName); // Refresh history after deletion
                              }}
                            >
                              <div className="flex items-center justify-center gap-3">
                                <AiOutlineDelete />
                                Delete
                              </div>
                            </button>
                            <button
                              className="p-2 cursor-pointer  bg-[#9bc6d3] font-bold text-md text-black rounded-lg mt-1 hover:bg-[#c5e2ec]"
                              onClick={(e) => {
                                e.stopPropagation();
                                saveToFavorites(key, conversation?.favorite);
                                fetchHistory(userName); // Refresh after saving as favorite
                              }}
                            >
                              <div className="flex items-center justify-center gap-3">
                                <GrFavorite />
                                Save as Favorite
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </li>
        )}
      </ul>
      {showPopup && (
        <div className="fixed bottom-14 left-1 transform  bg-[#9bc6d3] text-black p-2 rounded-lg shadow-md italic">
          Conversation saved to favorites!
        </div>
      )}
      {showFavPopup && (
        <div className="fixed bottom-14 left-1 transform  bg-[#9bc6d3] text-black p-2 rounded-lg shadow-md italic">
          Conversation is already in favorites!
        </div>
      )}
      {visisbleComponent != "/chat" && (
        <div onClick={goHome} className="fixed bottom-2 left-3 cursor-pointer">
          <ImHome size={30} color="white" className="hover:opacity-80" />
        </div>
      )}
    </div>
  );
};

Navbar.propTypes = {
  navbarOpen: PropTypes.bool.isRequired,
  boolFetchHistory: PropTypes.bool.isRequired,
  toggleNavbar: PropTypes.func.isRequired,
  updateNavItems: PropTypes.func.isRequired,
  changeSessionId: PropTypes.func.isRequired,
  toggleUserTypes: PropTypes.func.isRequired,
  toggleConversationPicked: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  visisbleComponent: PropTypes.bool.isRequired,
};

export default Navbar;
