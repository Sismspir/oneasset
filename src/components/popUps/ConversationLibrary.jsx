import { useState } from "react";
import lib1 from "/packImages/lib1.png";
import lib2 from "/packImages/lib2.png";
import lib3 from "/packImages/lib3.png";
import lib4 from "/packImages/lib4.png";
import lib5 from "/packImages/lib5.png";
import { FaChevronRight } from "react-icons/fa6";

const ConversationLibrary = () => {
  const [citiationsPdfURL] = useState("./d4c.pdf"); // PDF for citations
  const [isoPdfURL] = useState("./iso.pdf"); // PDF for iso
  const [wastePdfURL] = useState("./Waste_Management.pdf"); // PDF for iso
  const [MarsGlobal] = useState("./Sustainable.pdf"); // PDF for iso
  const [Protocol] = useState("./Protocol.pdf"); // PDF for iso
  const [MarsGlobal2] = useState("./ADDENDUM.pdf"); // PDF for iso

  const downloadPdf = (pdfURL) => {
    const link = document.createElement("a");
    link.href = pdfURL;
    link.download = pdfURL; // You can change the filename if needed
    link.click();
  };

  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const downloadMarsGlobal = (url1, url2) => {
    setIsDownloading(true);
    setProgress(50); // Update progress for the first file

    // Start downloading the first file
    const link1 = document.createElement("a");
    link1.href = url1;
    link1.download = url1.split("/").pop(); // Extract the filename from the URL
    link1.click();

    // Set a timer to download the second file after a slight delay
    setTimeout(() => {
      setProgress(100); // Complete progress for the second file

      const link2 = document.createElement("a");
      link2.href = url2;
      link2.download = url2.split("/").pop(); // Extract the filename from the URL
      link2.click();

      // Reset the state after the download is complete
      setTimeout(() => {
        setIsDownloading(false);
        setProgress(0);
      }, 1000); // Optional delay before hiding the progress
    }, 1500); // 1.5-second delay for the second file
  };

  return (
    <div className="max-w-full h-full w-full">
      <div className=" rounded-md px-20 bg-white w-full h-[90.25vh] ">
        <div className="text-gray-600 font-bold text-2xl">
          Welcome to OneAsset Library!
        </div>
        <p className="text-black font-medium mb-4">
          This section offers a list of downloadable documents ingested by
          OneAsset.
        </p>
        <div className="flex gap-8">
          <div className="flex flex-col items-center justify-center gap-y-4">
            <img
              src={lib3}
              alt="Revenue Comparison"
              style={{ width: "150px", height: "120px" }}
            />
            <button
              onClick={() => downloadPdf(citiationsPdfURL)}
              className="w-72 h-14 text-white font-normal rounded-full bg-gray-600 hover:bg-gray-300 flex items-center justify-center gap-2 px-8"
            >
              Download 1st Document
              <div className="bg-[#ffffff] text-white text-xl flex items-center justify-center rounded-full -mr-5">
                <span className="flex items-center text-gray-600 justify-center p-2">
                  <FaChevronRight size={20} />
                </span>
              </div>
            </button>
            <a
              href="mailto:gytis.kulbickas@effem.com?subject=Your%20Subject&body=This%20is%20the%20email%20body"
              target="_blank"
              rel="noopener noreferrer"
              className="w-72 h-18 text-gray-600 text-base rounded-full bg-gray-400 hover:bg-stone-400 flex items-center justify-between gap-14 p-2"
            >
              <span className="font-xs flex-shrink text-ellipsis text-center overflow-hidden ml-10">
                Lorem ipsum dolor sit amet.
              </span>
              <div className="bg-[#ffffff] text-white text-xl w-10 h-10 flex items-center justify-center rounded-full">
                <span className="flex items-center text-gray-600 justify-center">
                  <FaChevronRight />
                </span>
              </div>
            </a>
          </div>
          <div className="flex flex-col items-center justify-center gap-y-4">
            <img
              src={lib4}
              alt="Revenue Comparison"
              style={{ width: "120px", height: "120px" }}
            />
            <button
              onClick={() => downloadPdf(isoPdfURL)}
              className="w-72 h-14 text-white font-normal rounded-full bg-gray-600 hover:bg-gray-300 flex items-center justify-center gap-2 px-8"
            >
              Download 2nd Document
              <div className="bg-[#ffffff] text-white text-xl flex items-center justify-center rounded-full -mr-5">
                <span className="flex items-center text-gray-600 justify-center p-2">
                  <FaChevronRight size={20} />
                </span>
              </div>
            </button>
            <a
              href="mailto:gytis.kulbickas@effem.com?subject=Your%20Subject&body=This%20is%20the%20email%20body"
              target="_blank"
              rel="noopener noreferrer"
              className="w-72 h-18 text-gray-600 text-base rounded-full bg-gray-400 hover:bg-stone-400 flex items-center justify-between gap-14 p-2"
            >
              <span className="font-xs flex-shrink text-ellipsis text-center overflow-hidden ml-10">
                Lorem ipsum dolor sit amet.
              </span>
              <div className="bg-[#ffffff] text-white text-xl w-10 h-10 flex items-center justify-center rounded-full">
                <span className="flex items-center text-gray-600 justify-center">
                  <FaChevronRight />
                </span>
              </div>
            </a>
          </div>
          <div className="flex flex-col items-center justify-center gap-y-4 mt-12">
            <img
              src={lib2}
              alt="Revenue Comparison"
              style={{ width: "120px", height: "70px" }}
            />
            <button
              onClick={() => downloadMarsGlobal(Protocol, MarsGlobal2)}
              className="w-72 h-14 text-white font-normal rounded-full bg-gray-600 hover:bg-gray-300 flex items-center justify-center gap-2 px-8"
            >
              Download 3rd Document
              <div className="bg-[#ffffff] text-white text-xl flex items-center justify-center rounded-full -mr-5">
                <span className="flex items-center text-gray-600 justify-center p-2">
                  <FaChevronRight size={20} />
                </span>
              </div>
            </button>
            <a
              href="mailto:gytis.kulbickas@effem.com?subject=Your%20Subject&body=This%20is%20the%20email%20body"
              target="_blank"
              rel="noopener noreferrer"
              className="w-72 h-18 text-gray-600 text-base rounded-full bg-gray-400 hover:bg-stone-400 flex items-center justify-between gap-14 p-2"
            >
              <span className="font-xs flex-shrink text-ellipsis text-center overflow-hidden ml-10">
                Lorem ipsum dolor sit amet.
              </span>
              <div className="bg-[#ffffff] text-white text-xl w-10 h-10 flex items-center justify-center rounded-full">
                <span className="flex items-center text-gray-600 justify-center">
                  <FaChevronRight />
                </span>
              </div>
            </a>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="flex flex-col items-start gap-y-4 mt-2">
            <img
              className="ml-20 mt-12"
              src={lib1}
              alt="Revenue Comparison"
              style={{ width: "120px", height: "60px" }}
            />
            <button
              onClick={() => downloadPdf(MarsGlobal)}
              className="w-72 h-14 text-white font-normal rounded-full bg-gray-600 hover:bg-gray-300 flex items-center justify-center gap-2 px-8 cursor-pointer"
            >
              Download 4th Document
              <div className="bg-[#ffffff] text-white text-xl flex items-center justify-center rounded-full -mr-5">
                <span className="flex items-center text-gray-600 justify-center p-2">
                  <FaChevronRight size={20} />
                </span>
              </div>
            </button>
            <div className="w-72 h-30 text-stone-900 text-sm rounded-full bg-gray-400 hover:bg-stone-400 flex items-center justify-center gap-2 cursor-pointer">
              <span className="font-xs font-medium flex-shrink overflow-hidden text-ellipsis whitespace-nowrap text-center p-4">
                Lorem ipsum dolor sit amet.
              </span>
              <div className="bg-[#ffffff] text-white text-xl flex items-center justify-center rounded-full mr-3">
                <span className="flex items-center text-gray-600 justify-center p-2">
                  <FaChevronRight size={20} />
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-y-4 mt-2 relative">
            <img
              className="ml-20 mt-12"
              src={lib5}
              alt="Revenue Comparison"
              style={{ width: "130px", height: "60px" }}
            />
            <button
              onClick={() => downloadPdf(wastePdfURL)}
              className="w-72 h-14 text-white font-normal rounded-full bg-gray-600 hover:bg-gray-300 flex items-center justify-center gap-2 px-8 cursor-pointer"
            >
              Download 5th Document
              <div className="bg-[#ffffff] text-white text-xl flex items-center justify-center rounded-full absolute right-3">
                <span className="flex items-center text-gray-600 justify-center p-2">
                  <FaChevronRight size={20} />
                </span>
              </div>
            </button>
            <div className="w-72 h-30 text-stone-900 text-sm rounded-full bg-gray-400 hover:bg-stone-400 flex items-center justify-center gap-2 cursor-pointer">
              <span className="font-xs font-medium flex-shrink overflow-hidden text-ellipsis whitespace-nowrap text-center p-4">
                Lorem ipsum dolor sit amet.
              </span>
              <div className="bg-[#ffffff] text-white text-xl flex items-center justify-center rounded-full mr-3">
                <span className="flex items-center text-gray-600 justify-center p-2">
                  <FaChevronRight size={20} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationLibrary;
