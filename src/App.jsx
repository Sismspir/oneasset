import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./index.css";
import PropTypes from "prop-types";
import { startNewChat } from "./api/startNewChat";
import { fetchUserName } from "./api/getName";
import { fetchUserInfo } from "./api/fetchUserInfo";
import { getHistory } from "./api/getHistory";
import ConversationLibrary from "./components/popUps/ConversationLibrary";
import UserGuidePopUp from "./components/popUps/UserGuidePopUp";
import Navbar from "./components/Navbar";
import logo from "/packImages/pack.png";
import Screen from "./components/Screen";
import Upload from "./components/Upload";
import SmartSummary from "./components/SmartSummary";
import Userinfo from "./components/Userinfo";
import SmartComparison from "./components/SmartComparison";
import Adherence from "./components/Adherence";

const App = () => {
  const location = useLocation();
  const [userName, setUsername] = useState("");
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [userTypes, setUserTypes] = useState(false);
  const [navItemsOpen, setNavItemsOpen] = useState({
    Chat: false,
    Prompts: false,
    Guide: false,
    Library: false,
    Summary: false,
    Comparison: false,
    Adherence: false,
  });
  const [boolFetchHistory, setBoolFetchHistory] = useState(true);
  const [conversationPicked, setConversationPicked] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState();

  // Change the conv id when new conv is picked
  const changeSessionId = (id) => {
    setCurrentSessionId(id);
    console.log("New Id picked:", id);
  };

  const toggleConversationPicked = (conv) => {
    console.log("This is the picked conv", conv);
    setConversationPicked(conv);
  };

  // activates the useEffect to retrieve the updated history
  const toggleBoolFetchHistory = () => {
    setBoolFetchHistory(!boolFetchHistory);
  };

  const widthClass = "transition-all duration-300";

  const toggleUserTypes = (isTyping) => {
    setUserTypes(isTyping);
  };

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  const updateNavItems = (value) => {
    setNavItemsOpen((navItemsOpen) => {
      const updatedNavItems = {};

      Object?.keys(navItemsOpen)?.forEach((key) => {
        // If the current key is the one being toggled, switch its value
        if (key === value) {
          updatedNavItems[key] = !navItemsOpen[key];
        } else {
          // Set the rest to false
          updatedNavItems[key] = false;
        }
      });

      return updatedNavItems;
    });
  };

  // Logic to start a new chat the first time the app renders
  const handleNewChat = async (userName) => {
    try {
      const result = await startNewChat(userName);
      console.log("New id successfully generated", result, userName);
      await getHistory(userName); // Update history without reloading
    } catch (err) {
      console.log(err);
    }
  };

  const getName = async () => {
    let result;
    try {
      result = await fetchUserName();
      setUsername(result?.slice(0, 15));
      console.log(
        ` just set the username ${result?.slice(
          0,
          15
        )} from get Name function and the result of the getName request is ${result}`
      );
      return result;
    } catch (err) {
      console.log(err);
    } finally {
      console.log(
        `triggering handle new chat!!!!!!!!!!!!!!!!!!!!!!! with name ${result?.slice(
          0,
          15
        )}`
      );
      await handleNewChat(result?.slice(0, 15));
    }
  };

  useEffect(() => {
    if (userName) {
      getHistory(userName);
      console.log("Get histroy just executed!");
    }
  }, [boolFetchHistory, conversationPicked, currentSessionId, userName]);

  useEffect(() => {
    const initializeApp = async () => {
      console.log(
        "New app is initialized!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
      );
      await getName();
      console.log("get name in line 116 was executed!!!!!!!!!!!!!!!!!");
      // fetchUserInfo();
      // console.log("fetchUserInfo just executed!");
    };

    initializeApp();
  }, []);

  return (
    <div className="flex h-screen font-sans bg-stone-300">
      {/* ============== Navbar ============== */}
      <div className={`${navbarOpen ? "w-1/6" : "w-16"} ${widthClass}  `}>
        <Navbar
          navbarOpen={navbarOpen}
          toggleNavbar={toggleNavbar}
          navItemsOpen={navItemsOpen}
          updateNavItems={updateNavItems}
          toggleUserTypes={toggleUserTypes}
          changeSessionId={changeSessionId}
          toggleConversationPicked={toggleConversationPicked}
          boolFetchHistory={boolFetchHistory}
          userName={userName}
          visibleComponent={location.pathname}
        />
      </div>

      <div
        className={`${
          navbarOpen ? "w-5/6" : "w-[calc(100%-4rem)]"
        } ${widthClass}`}
      >
        <div className=" h-full w-full flex flex-col items-center bg-stone-200">
          <div className="w-full max-h-18 flex items-center">
            {/* Logo Div */}
            {userTypes && (
              <div className="flex-none ml-2 flex flex-col items-center">
                <div className="rounded-full w-20 max-h-full mt-2">
                  <img src={logo} alt="Logo" className="mx-auto my-auto" />
                </div>
                <div>
                  <p className="font-medium text-xs flex items-center justify-center">
                    Chat With Your Documents
                  </p>
                </div>
              </div>
            )}
            {/* Empty Div */}
            <div className="flex-1 relative"></div>
            {userName != "" && <Userinfo userName={userName} />}
            {/* Empty Div */}
            <div className="flex-none w-1/12"></div>
          </div>
          {/* userGuideOpen ? */}
          {navItemsOpen.Guide && (
            <div className="w-full relative">
              <UserGuidePopUp />
            </div>
          )}
          {/* LibraryOpen ? */}
          {navItemsOpen.Library && (
            <div className="w-full relative">
              <ConversationLibrary />
            </div>
          )}
          {/* SmartSummary ? */}
          {navItemsOpen.Summary && (
            <div className="w-full relative">
              <SmartSummary />
            </div>
          )}
          {/* ComparisonOpen ? */}
          {navItemsOpen.Comparison && (
            <div className="w-full relative">
              <SmartComparison />
            </div>
          )}
          {/* AdherenceOpen ? */}
          {navItemsOpen.Adherence && (
            <div className="w-full relative">
              <Adherence />
            </div>
          )}
          <div className="flex items-center justify-center w-5/6 h-full max-h-full overflow-y-auto ">
            {location.pathname === "/chat" && (
              <Screen
                userTypes={userTypes}
                toggleUserTypes={toggleUserTypes}
                currentSessionId={currentSessionId}
                conversationPicked={conversationPicked}
                toggleBoolFetchHistory={toggleBoolFetchHistory}
                userName={userName}
              />
            )}
            {location.pathname === "/upload" && <Upload />}
            {location.pathname === "/smartSummary" && <SmartSummary />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
