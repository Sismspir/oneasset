import { useState, useEffect } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { fetchUserName } from "../../api/getName";
import { IoCloudDownloadOutline } from "react-icons/io5";

const UserGuidePopUp = () => {
  const [guide] = useState("./UserGuide.pdf");
  const [userName, setUsername] = useState("");

  const getName = async () => {
    try {
      const result = await fetchUserName();
      const name = result.split(".")[0];
      setUsername(name.charAt(0).toUpperCase() + name.slice(1));
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  const downloadPdf = (pdfURL) => {
    const link = document.createElement("a");
    link.href = pdfURL;
    link.download = pdfURL;
    link.click();
  };

  useEffect(() => {
    getName();
    console.log("Get name just executed!");
  });

  return (
    <div className="m-1 absolute z-20 top-0 left-0 h-[85vh] w-fit overflow-x-hidden overflow-y-auto bg-white rounded-3xl border-2 border-green-600">
      <div className="m-3 rounded-md mx-auto p-2 bg-white">
        <div className="flex items-center justify-center text-2xl ">
          Hello,&nbsp;
          <span className="text-gray-700 font-semibold"> {userName}!</span>
        </div>
        <div className="text-gray-700 font-semibold text-5xl text-center mb-8">
          Welcome to <span className="text-gray-300">One</span>Asset!
          <div className="text-base">
            A smart virtual assistant ready to help you.
          </div>
        </div>
        <div className="flex gap-8 border-2w-full">
          <div className="flex flex-col bg-[#9191b8] text-black text-lg w-1/2 h-[20rem] px-3 py-3">
            <div className="text-2xl font-semibold mb-4">
              Gen AI & Technologies used
            </div>
            <div className="text-justify">
              Generative AI (Gen AI) refers to artificial intelligence models
              capable of generating human-like text, images, and other forms of
              content by leveraging vast amounts of data and sophisticated
              algorithms. ​ OpenAI plays a key role in advancing Gen AI with its
              large language models (LLMs), which can process and generate
              coherent, context-aware responses. These models are accessible
              through APIs, allowing developers to seamlessly integrate AI
              capabilities into applications, websites, and chatbots.
            </div>
          </div>
          <div className="flex flex-col bg-gray-700 text-white text-lg w-1/2 h-[20rem] px-3 py-3">
            <div className="text-2xl font-semibold mb-4">What is OneAsset?</div>
            <div className="text-justify">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem,
              voluptas tenetur, animi praesentium, sit cumque dolores
              perspiciatis a quam laboriosam architecto voluptatem omnis.
              Officia deleniti laborum vitae, doloribus non unde quisquam harum
              aut suscipit hic voluptatum consectetur numquam eligendi labore ea
              sed at corporis sapiente atque pariatur modi! Eveniet, voluptatum?
            </div>
          </div>
        </div>
        {/* ========== Bottom Buttons ========== */}
        <div className="flex gap-8 items-center justify-center mt-6">
          <button
            onClick={() => {
              downloadPdf(guide);
            }}
            className="bg-gray-300 text-gray-700 w-72 h-18 text-base rounded-full hover:bg-stone-200 flex items-center justify-start p-2"
          >
            <span className="font-xs flex-shrink font-semibold text-center overflow-hidden ml-14 ">
              User Manual
            </span>
            <div className="bg-white text-white text-xl w-10 h-10 flex items-center justify-center rounded-full ml-20">
              <span className="flex items-center justify-center shadow-custom-dark rounded-full">
                <IoCloudDownloadOutline color="#0000A0" size={28} />
              </span>
            </div>
          </button>

          <a
            href="https://www.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-72 h-18 text-gray-700 text-base rounded-full bg-[#ffffff] hover:bg-stone-200 flex items-center justify-between gap-14 p-2 border-2 border-gray-300"
          >
            <span className="font-xs flex-shrink text-ellipsis text-center overflow-hidden ml-10">
              Contact the Expert
            </span>
            <div className="bg-gray-700 text-white text-xl w-10 h-10 flex items-center justify-center rounded-full ">
              <span className="flex items-center justify-center">
                <FaChevronRight className="rounded-full" />
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserGuidePopUp;
