import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import Userinfo from "./Userinfo";
import { useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa6";
import { FaMessage } from "react-icons/fa6";
import { fetchUserName } from "../api/getName";

const HomePage = () => {
  const [guide] = useState("./UserGuide.pdf");
  const [userName, setUsername] = useState("");
  const [nameForGuide, setNameForGuide] = useState("");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false); // Track video state
  const navigate = useNavigate();
  const videoRef = useRef(null); // Reference for the video element
  const handleNewChat = () => {
    navigate("/chat");
  };

  const downloadPdf = (pdfURL) => {
    const link = document.createElement("a");
    link.href = pdfURL;
    link.download = pdfURL;
    link.click();
  };

  const getName = async () => {
    try {
      const result = await fetchUserName();
      const name = result.split(".")[0];
      setUsername(name.charAt(0).toUpperCase() + name.slice(1));
      setNameForGuide(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  const playVideoFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.style.display = "block";
      videoRef.current.requestFullscreen?.();
      videoRef.current.play().catch((err) => {
        console.error("Autoplay blocked: ", err);
      });
    }
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      // Exited fullscreen
      videoRef.current?.pause();
      videoRef.current.style.display = "none"; // Hide video element
      setIsVideoPlaying(false); // Mark video as stopped
    }
  };

  useEffect(() => {
    getName();
    console.log("Get name just executed!");

    // Add fullscreenchange event listener
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    // Add fullscreenchange event listener
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    getName();
    console.log("Get name just executed!");
  });

  return (
    <div className="h-screen w-full flex items-center justify-center relative">
      <div className="h-full flex flex-col gap-3 w-11/12">
        {/* ===========  First div =========== */}
        <div className="h-[32%] 2xl:text-xl xl:text-lg lg:text-sm px-4 flex flex-col py-5 lg:py-1 font-normal overflow-auto">
          <div className="flex">
            Hello,&nbsp;
            <div className="text-[#0000A0] font-semibold">{userName}!</div>
            <div className="absolute -top-2 left-[85%]">
              {nameForGuide !== "" && <Userinfo userName={nameForGuide} />}
            </div>
          </div>
          <div className="flex 2xl:text-3xl lg:text-2xl font-bold text-[#0000A0]">
            Welcome to&nbsp;
            <div className="text-[#0000A0] flex">
              <p className="text-[#9DD563]">One</p>Asset!
            </div>
          </div>
          <div className="text-[#0000A0] text-base">
            A smart virtual assistant ready to help you with..
          </div>
          <div className="flex gap-52 xl:gap-44 lg:gap-24 justify-center my-auto pt-4">
            <button
              onClick={() => handleNewChat()}
              className="bg-[#0000A0] text-white w-72 2xl:h-14 lg:h-12 text-base rounded-full hover:bg-[#0058a0] flex items-center justify-start p-2"
            >
              <span className="xl:text-lg flex-shrink font-semibold text-center text-nowrap ml-14">
                Start New Chat
              </span>
              <div className="bg-white text-white text-xl w-10 xl:h-9 lg:h-9 flex items-center justify-center rounded-full ml-14">
                <span className="flex items-center justify-center">
                  <FaMessage
                    color="#0000A0"
                    className="shadow-custom-light shadow-slate-200 bg-none rounded-sm"
                  />
                </span>
              </div>
            </button>
            <button
              onClick={playVideoFullscreen}
              className="bg-[#00d7ba] text-white w-72 2xl:h-14 lg:h-12 text-base rounded-full hover:bg-[#63c4b7] flex items-center justify-start p-2"
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
              onClick={() => {
                downloadPdf(guide);
              }}
              className="bg-[#00d7ba] text-white w-72 2xl:h-14 lg:h-12 text-base rounded-full hover:bg-[#63c4b7] flex items-center justify-start p-2"
            >
              <span className="xl:text-lg flex-shrink font-semibold text-center text-nowrap ml-14">
                Read User Manual
              </span>
              <div className="bg-white text-white text-xl w-10 h-10 xl:h-10 lg:h-9 flex items-center justify-center rounded-full ml-7">
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
        {/*  */}
        <div className="mb-2 flex text-[#0000A0] shadow-custom-dark h-[24%] 2xl:text-base xl:text-sm lg:text-xs">
          <div className="w-full max-h-full overflow-auto">
            <div className="p-3 text-justify leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
              rem, quasi praesentium illo dolorem laborum quidem. Omnis alias
              dicta optio. Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Ullam rem, quasi praesentium illo dolorem laborum quidem.
              Omnis alias dicta optio.
            </div>
            <div className="px-3 py-1 mt-2 text-justify leading-relaxed">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam
              voluptate error animi repellendus quisquam a consectetur
              dignissimos, sequi odit consequuntur deleniti officia sint neque
              rem. Culpa, totam provident minima quidem ullam id tempore, harum
              deserunt sequi mollitia, consectetur saepe eligendi ea pariatur
              aspernatur nam at doloremque nobis accusamus voluptatem quibusdam?
            </div>
          </div>
        </div>
        {/* ===========  Third div =========== */}
        <div className="h-[36%] bg-[#0000A0] text-white flex mb-2">
          <div className="w-2/5 overflow-auto bg-stone-100 text-[#0000A0] font-bold 2xl:text-xl xl:text-lg p-2">
            Lorem ipsum dolor sit amet.
            <div className="flex justify-center xl:gap-6 lg:gap-2 2xl:text-base xl:text-sm lg:text-xs mt-4 ml-[2vw]">
              <div className="flex flex-col gap-2 ">
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-[#FFDC00] text-white rounded-full p-5 w-56 lg:w-48 2xl:h-14 xl:h-12 lg:h-10 flex items-center justify-center">
                    Document 1
                  </div>
                </div>
                <div className="flex flex-col gap-5 items-center justify-center">
                  <div className="bg-[#FF8200] text-white rounded-full p-5 w-56 lg:w-48 2xl:h-14 xl:h-12 lg:h-10 flex items-center justify-center">
                    Document 2
                  </div>
                </div>
                <div className="flex flex-col gap-5 items-center justify-center">
                  <div className="bg-[#AA231A] text-white rounded-full p-5 w-56 lg:w-48 2xl:h-14 xl:h-12 lg:h-10 flex items-center justify-center">
                    Document 3
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-5 items-center justify-center">
                  <div className="bg-[#9DD563] text-white rounded-full px-8 2xl:py-2 xl:py-1 lg:py-2 xl:text-sm w-56 lg:w-48 2xl:h-14 xl:h-12 lg:h-10 text-center">
                    Doument 4
                  </div>
                </div>
                <div className="flex flex-col gap-5 items-center justify-center">
                  <div className="bg-[#6C8933] text-white rounded-full 2xl:py-2 xl:py-1 lg:py-1 xl:text-sm px-6 w-56 lg:w-48 2xl:h-14 xl:h-12 lg:h-10 text-center">
                    Document 5
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-3/5 gap-2 px-5 font-base h-full max-h-full overflow-auto 2xl:text-base xl:text-sm lg:text-xs text-justify ">
            <div className="w-4/6 2xl:text-3xl xl:text-xl lg:text-base font-bold mt-5 mb-4">
              Lorem ipsum dolor sit amet.
            </div>
            <div className="mb-3 font-semibold ">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Asperiores, quibusdam.
            </div>
            <div className="mb-3 font-semibold ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
              velit porro ea dolor quidem accusamus nulla aspernatur quaerat,
              libero saepe!
            </div>
            <div className="font-semibold ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto
              magnam et minima doloremque. Quod autem dolores veritatis,
              accusantium hic sit.
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
