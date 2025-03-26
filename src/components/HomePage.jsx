import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import Userinfo from "./Userinfo";
import { useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa6";
import { FaMessage } from "react-icons/fa6";
import { fetchUserName } from "../api/getName";
import { getDocumentNames } from "../api/getDocumentNames";

const HomePage = () => {
  const [guide] = useState("./UserGuide.pdf");
  const [userName, setUsername] = useState("");
  const [nameForGuide, setNameForGuide] = useState("");
  const [documentNames, setDocumentNames] = useState();
  const navigate = useNavigate();
  const videoRef = useRef(null); // Reference for the video element
  const handleNewChat = () => {
    navigate("/chat");
  };

  const handleUpload = () => {
    navigate("/upload");
  };

  const handleSummary = () => {
    navigate("/smartSummary");
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
        setUsername(fullName);
        console.log(fullName); // Spyridon Sismanis
      }
      setNameForGuide(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  const getDocuments = async () => {
    try {
      const result = await getDocumentNames(userName);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDocuments()
      .then((documents) => {
        setDocumentNames(documents);
        console.log(
          "Documents AVAILABLE:",
          documents,
          "for the user",
          userName
        );
      })
      .catch((err) => {
        console.error("Error fetching documents:", err);
      });
  }, [userName]);

  useEffect(() => {
    getName();
    console.log("Get name just executed!", "availble documents");
  });

  return (
    <div className="h-screen w-full flex items-center justify-center relative bg-stone-100 text-white">
      <div className="h-full flex flex-col gap-3 w-11/12">
        {/* ===========  First div =========== */}
        <div className="h-[32%] 2xl:text-xl xl:text-lg lg:text-sm px-4 flex flex-col py-5 lg:py-1 font-normal overflow-auto bg-[#0000A0] mt-3">
          <div className="flex">
            Hello,&nbsp;
            <div className="text-gray-300 font-semibold">{userName}!</div>
            <div className="absolute -top-2 left-[85%]">
              {nameForGuide !== "" && <Userinfo userName={nameForGuide} />}
            </div>
          </div>
          <div className="flex 2xl:text-3xl lg:text-2xl font-bold text-gray-300">
            Welcome to&nbsp;
            <div className="text-[#bbbbe2] flex">
              <p className="text-[#a6cad8]">One</p>Asset!
            </div>
          </div>
          <div className="text-white text-base">
            A wide library of functionalities for Developers to experiment with
          </div>
          <div className="flex gap-52 xl:gap-44 lg:gap-24 justify-center my-auto pt-4">
            <button
              onClick={() => handleNewChat()}
              className="bg-[#00D7B9] text-white w-76  2xl:h-14 lg:h-12 text-base rounded-full hover:bg-[#7fddc6] flex items-center gap-14 px-2 py-4 shadow-custom-dark shadow-blue-800"
            >
              <span className="xl:text-lg flex-shrink font-semibold text-center text-nowrap ml-10">
                Start New Chat
              </span>
              <div className="bg-white text-white text-xl w-10 h-10 flex items-center justify-center rounded-full ml-1">
                <span className="flex items-center justify-center">
                  <FaChevronRight
                    color="#0000A0"
                    className="shadow-custom-dark shadow-slate-200 bg-none rounded-full"
                  />
                </span>
              </div>
            </button>
            <button
              onClick={() => handleUpload()}
              className="bg-[#3333c2] text-white w-76 2xl:h-14 lg:h-12 text-base rounded-full hover:bg-[#0040a0] flex items-center justify-start p-2 shadow-custom-dark shadow-blue-900"
            >
              <span className="xl:text-lg flex-shrink font-semibold text-center text-nowrap ml-10">
                Upload Your Documents
              </span>
              <div className="bg-white text-white text-xl w-10 h-10 flex items-center justify-center rounded-full ml-5">
                <span className="flex items-center justify-center">
                  <FaChevronRight
                    color="#0000A0"
                    className="shadow-custom-dark shadow-slate-200 bg-none rounded-full"
                  />
                </span>
              </div>
            </button>
            <button
              onClick={() => handleSummary()}
              className="bg-[#00D7B9] text-white w-76  2xl:h-14 lg:h-12 text-base rounded-full hover:bg-[#7fddc6] flex items-center gap-14 px-2 py-4 shadow-custom-dark shadow-blue-800"
            >
              <span className="xl:text-lg flex-shrink font-semibold text-center text-nowrap ml-10">
                Smart Functions
              </span>
              <div className="bg-white text-white text-xl w-10 h-10 flex items-center justify-center rounded-full ml-1">
                <span className="flex items-center justify-center">
                  <FaChevronRight
                    color="#0000A0"
                    className="shadow-custom-dark shadow-slate-200 bg-none rounded-full"
                  />
                </span>
              </div>
            </button>
          </div>
        </div>
        {/* ===========  Second div =========== */}
        <div className="mb-2 font-medium flex text-[#0000a0] bg-white shadow-custom-dark shadow-gray-400 h-[24%] 2xl:text-lg xl:text-lg- lg:text-sm">
          <div className="w-full max-h-full overflow-auto">
            <div className="p-3 text-justify leading-relaxed">
              The mission of OneAsset is to support Developers in the creation
              and scaling of AI projects by giving them access to modular code
              bases for popular functionalities, opening way to a streamlined
              development approach that valorizes existing code components
              instead of creating them from scratch. One this playground
              interface, you can view and test available functionalities like
              document management and processing, chatbot interface, voicebot,
              SharePoint integration, and many more.
            </div>
          </div>
        </div>
        {/* ===========  Third div =========== */}
        <div className="h-[36%] text-gray-900 bg-stone-300 shadow-md flex mb-2">
          <div className="w-2/5 overflow-auto  bg-[#9DD563] text-white font-bold 2xl:text-2xl xl:text-xl p-2">
            Available Documents
            <div className="flex justify-center xl:gap-6 lg:gap-2 2xl:text-sm xl:text-xs lg:text-xs mt-2 ml-[2vw] text-gray-300">
              <div className="flex flex-col gap-1">
                {documentNames?.map((doc, index) => (
                  <div
                    key={index}
                    className="bg-[#6C8933] text-white break-words rounded-full px-4 py-2 w-56 text-center"
                  >
                    {doc.replace(".pdf", "")}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-3/5 gap-2 px-5 font-base h-full max-h-full overflow-auto 2xl:text-base xl:text-sm lg:text-xs text-justify bg-[#D16808]">
            <div className="w-4/6 2xl:text-2xl xl:text-xl lg:text-base font-bold mt-5 mb-1 whitespace-normal text-white">
              How to get access to code components?
            </div>
            <div className="flex flex-col w-full  px-5 font-base h-full max-h-full overflow-auto 2xl:text-base xl:text-sm lg:text-xs bg-[#D16808]">
              <ul className="list-disc pl-5 whitespace-normal w-full text-white font-medium">
                <li className=" pl-2 py-1 rounded-full ">
                  Test and choose desired functionalities
                </li>
                <li className=" mt-1 pl-2 py-1 rounded-full">
                  Reach out to OneAsset Team explaining your role, project and
                  desired code
                </li>
                <li className=" mt-1 pl-2 py-1 rounded-full">
                  Access available repo and documentation
                </li>
                <li className=" mt-1 pl-2 py-1 rounded-full">
                  Build you own project with our reusable code components!
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <video
        ref={videoRef}
        src="/PackGPT_Final.mp4" // Replace with your actual video path
        style={{ display: "none" }} // Hidden by default
        controls
      />
    </div>
  );
};

export default HomePage;
