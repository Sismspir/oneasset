import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { GrDownload } from "react-icons/gr";

// Set the workerSrc to ensure the PDF worker loads
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const DisplayPdf = (props) => {
  const { citations, iso, ADDENDUM, ClaimsAddendum } = props;
  const [citiationsPdfURL] = useState("./d4c.pdf"); // PDF for citations
  const [isoPdfURL] = useState("./iso.pdf"); // PDF for iso
  const [ADDENDUMPdfURL] = useState("./ADDENDUM.pdf"); // PDF for ADDENDUM
  const [ClaimsURL] = useState("./claims.pdf"); //

  const [numPagesCitations, setNumPagesCitiations] = useState(null); // Full number of pages
  const [numPagesIso, setNumPagesIso] = useState(null);
  const [numPagesADDENDUM, setNumPagesADDENDUM] = useState(null);
  const [numPagesClaimsAddendum, setNumPagesClaimsAddendum] = useState(null);
  const [scale, setScale] = useState(0.5);
  const [currentPageIndexCitiations, setCurrentPageIndexCitiations] =
    useState(0); // Track index within the citations array
  const [currentPageIndexIso, setCurrentPageIndexIso] = useState(0);
  const [currentPageIndexADDENDUM, setCurrentPageIndexADDENDUM] = useState(0);
  const [currentPageIndexClaimsAddendum, setCurrentPageIndexClaimsAddendum] =
    useState(0);
  `
  const [scale, setScale] = useState(0.5);`;

  useEffect(() => {
    setCurrentPageIndexCitiations(0);
    setCurrentPageIndexIso(0);
    setCurrentPageIndexADDENDUM(0);
    setCurrentPageIndexClaimsAddendum(0);
  }, [citations, iso, ADDENDUM, ClaimsAddendum]);

  // Called when the citiations PDF is successfully loaded
  const onDocumentLoadSuccessCitiations = ({ numPages }) => {
    setNumPagesCitiations(numPages);
  };

  // Called when the iso PDF is successfully loaded
  const onDocumentLoadSuccessIso = ({ numPages }) => {
    setNumPagesIso(numPages);
  };

  const onDocumentLoadSuccessADDENDUM = ({ numPages }) => {
    setNumPagesADDENDUM(numPages);
  };

  const onDocumentLoadSuccessClaimsAddendum = ({ numPages }) => {
    setNumPagesClaimsAddendum(numPages);
  };

  const zoomIn = () => setScale(scale + 0.2);
  const zoomOut = () => setScale(Math.max(0.2, scale - 0.2));

  const downloadPdf = (pdfURL) => {
    const link = document.createElement("a");
    link.href = pdfURL;
    link.download = pdfURL; // You can change the filename if needed
    link.click();
  };

  const goToPreviousPageCitiations = () => {
    setCurrentPageIndexCitiations((prev) => Math.max(prev - 1, 0));
  };

  const goToNextPageCitiations = () => {
    setCurrentPageIndexCitiations((prev) =>
      Math.min(prev + 1, citations?.length - 1)
    );
  };

  const goToPreviousPageIso = () => {
    setCurrentPageIndexIso((prev) => Math.max(prev - 1, 0));
  };

  const goToNextPageIso = () => {
    setCurrentPageIndexIso((prev) => Math.min(prev + 1, iso?.length - 1));
  };

  const goToPreviousPageADDENDUM = () => {
    setCurrentPageIndexADDENDUM((prev) => Math.max(prev - 1, 0));
  };

  const goToNextPageADDENDUM = () => {
    setCurrentPageIndexADDENDUM((prev) =>
      Math.min(prev + 1, ADDENDUM?.length - 1)
    );
  };

  const goToNextPageClaimsAddendum = () => {
    setCurrentPageIndexClaimsAddendum((prev) =>
      Math.min(prev + 1, ClaimsAddendum?.length - 1)
    );
  };

  const goToPreviousPageClaimsAddendum = () => {
    setCurrentPageIndexClaimsAddendum((prev) => Math.max(prev - 1, 0));
  };

  // Get the current page number for citiations and iso
  const currentPageNumberCitiations =
    citations !== undefined ? citations[currentPageIndexCitiations] : 0;
  const currentPageNumberIso = iso !== undefined ? iso[currentPageIndexIso] : 0;
  const currentPageNumberADDENDUM =
    ADDENDUM !== undefined ? ADDENDUM[currentPageIndexADDENDUM] : 0;
  const currentPageNumberClaimsAddendum = ClaimsAddendum
    ? ClaimsAddendum[currentPageIndexClaimsAddendum]
    : 0;

  return (
    <div className="flex flex-col max-h-[34rem] w-full max-w-full overflow-auto">
      {/* =============== Citiations PDF =============== */}
      {currentPageNumberCitiations && (
        <div className="flex flex-col items-center justify-center">
          <h3 className="font-semibold text-lg">D4C Guidelines PDF</h3>
          <div className="flex items-center justify-between mt-4 space-x-4">
            <button
              className="text-[#12154f] text-2xl disabled:opacity-20"
              onClick={goToPreviousPageCitiations}
              disabled={currentPageIndexCitiations <= 0}
            >
              <IoIosArrowBack />
            </button>

            <p className="text-lg font-semibold">
              Page {currentPageNumberCitiations}
            </p>

            <button
              className="text-[#12154f] text-2xl disabled:opacity-20"
              onClick={goToNextPageCitiations}
              disabled={currentPageIndexCitiations >= citations?.length - 1}
            >
              <IoIosArrowForward />
            </button>
          </div>

          {/* Download button */}
          <div className="flex items-center justify-center gap-2">
            <button
              className="mt-1 px-3 py-2 bg-[#1e194b] text-white rounded-lg hover:bg-[#334385]"
              onClick={() => downloadPdf(citiationsPdfURL)}
            >
              <GrDownload size={18} />
            </button>
            <div className="flex space-x-2 mt-1">
              <button
                className="px-3 py-2 bg-[#1e194b] text-white rounded-lg hover:bg-[#334385]"
                onClick={zoomOut}
              >
                <AiOutlineZoomOut size={18} />
              </button>
              <button
                className="px-3 py-2 bg-[#1e194b] text-white rounded-lg hover:bg-[#334385]"
                onClick={zoomIn}
              >
                <AiOutlineZoomIn size={18} />
              </button>
            </div>
          </div>
          <div
            className="overflow-auto w-full"
            style={{ width: `${scale * 200}%`, maxWidth: "200%" }}
          >
            <Document
              file={citiationsPdfURL}
              onLoadSuccess={onDocumentLoadSuccessCitiations}
              className="shadow-lg border rounded-lg flex items-center justify-center"
            >
              {currentPageNumberCitiations !== 0 && (
                <Page
                  pageNumber={currentPageNumberCitiations}
                  scale={scale}
                  className="border p-2"
                />
              )}
            </Document>
          </div>
        </div>
      )}

      {/* =============== ISO PDF =============== */}
      {currentPageNumberIso && (
        <div className="flex flex-col items-center justify-center mt-8">
          <h3 className="font-semibold text-lg">ISO PDF</h3>
          <div className="flex items-center justify-between mt-4 space-x-4">
            <button
              className="text-[#12154f] text-2xl disabled:opacity-20"
              onClick={goToPreviousPageIso}
              disabled={currentPageIndexIso <= 0}
            >
              <IoIosArrowBack />
            </button>

            <p className="text-lg font-semibold">Page {currentPageNumberIso}</p>

            <button
              className="text-[#12154f] text-2xl disabled:opacity-20"
              onClick={goToNextPageIso}
              disabled={currentPageIndexIso >= iso?.length - 1}
            >
              <IoIosArrowForward />
            </button>
          </div>

          {/* Download button */}
          <div className="flex items-center justify-center gap-2">
            <button
              className="mt-1 px-3 py-2 bg-[#1e194b] text-white rounded-lg hover:bg-[#334385]"
              onClick={() => downloadPdf(isoPdfURL)}
            >
              <GrDownload size={18} />
            </button>
            <div className="flex space-x-2 mt-1">
              <button
                className="px-3 py-2 bg-[#1e194b] text-white rounded-lg hover:bg-[#334385]"
                onClick={zoomOut}
              >
                <AiOutlineZoomOut size={18} />
              </button>
              <button
                className="px-3 py-2 bg-[#1e194b] text-white rounded-lg hover:bg-[#334385]"
                onClick={zoomIn}
              >
                <AiOutlineZoomIn size={18} />
              </button>
            </div>
          </div>
          <div
            className="overflow-auto w-full"
            style={{ width: `${scale * 140}%`, maxWidth: "140%" }}
          >
            <Document
              file={isoPdfURL}
              onLoadSuccess={onDocumentLoadSuccessIso}
              className="shadow-lg border rounded-lg flex items-center justify-center w-full"
            >
              {currentPageNumberIso !== 0 && (
                <Page
                  pageNumber={currentPageNumberIso}
                  scale={scale}
                  className="border p-2"
                />
              )}
            </Document>
          </div>
        </div>
      )}

      {/* =============== ADDENDUM =============== */}
      {currentPageNumberADDENDUM && (
        <div className="flex flex-col items-center justify-center mt-8">
          <h3 className="font-semibold text-lg">ADDENDUM PDF</h3>
          <div className="flex items-center justify-between mt-4 space-x-4">
            <button
              className="text-[#12154f] text-2xl disabled:opacity-20"
              onClick={goToPreviousPageADDENDUM}
              disabled={currentPageIndexADDENDUM <= 0}
            >
              <IoIosArrowBack />
            </button>

            <p className="text-lg font-semibold">
              Page {currentPageNumberADDENDUM}
            </p>

            <button
              className="text-[#12154f] text-2xl disabled:opacity-20"
              onClick={goToNextPageADDENDUM}
              disabled={currentPageIndexADDENDUM >= ADDENDUM?.length - 1}
            >
              <IoIosArrowForward />
            </button>
          </div>

          {/* Download button */}
          <div className="flex items-center justify-center gap-2">
            <button
              className="mt-1 px-3 py-2 bg-[#1e194b] text-white rounded-lg hover:bg-[#334385]"
              onClick={() => downloadPdf(ADDENDUMPdfURL)}
            >
              <GrDownload size={18} />
            </button>
            <div className="flex space-x-2 mt-1">
              <button
                className="px-3 py-2 bg-[#1e194b] text-white rounded-lg hover:bg-[#334385]"
                onClick={zoomOut}
              >
                <AiOutlineZoomOut size={18} />
              </button>
              <button
                className="px-3 py-2 bg-[#1e194b] text-white rounded-lg hover:bg-[#334385]"
                onClick={zoomIn}
              >
                <AiOutlineZoomIn size={18} />
              </button>
            </div>
          </div>
          <div
            className="overflow-auto w-full"
            style={{ width: `${scale * 140}%`, maxWidth: "140%" }}
          >
            <Document
              file={ADDENDUMPdfURL}
              onLoadSuccess={onDocumentLoadSuccessADDENDUM}
              className="shadow-lg border rounded-lg flex items-center justify-center w-full"
            >
              {currentPageNumberADDENDUM !== 0 && (
                <Page
                  pageNumber={currentPageNumberADDENDUM}
                  scale={scale}
                  className="border p-2"
                />
              )}
            </Document>
          </div>
        </div>
      )}

      {/* Claims */}
      {currentPageNumberClaimsAddendum && (
        <div className="flex flex-col items-center justify-center mt-8">
          <h3 className="font-semibold text-lg">Claims Protocol PDF</h3>
          <div className="flex items-center justify-between mt-4 space-x-4">
            <button
              className="text-[#12154f] text-2xl disabled:opacity-20"
              onClick={goToPreviousPageClaimsAddendum}
              disabled={currentPageIndexClaimsAddendum <= 0}
            >
              <IoIosArrowBack />
            </button>

            <p className="text-lg font-semibold">
              Page {currentPageNumberClaimsAddendum}
            </p>

            <button
              className="text-[#12154f] text-2xl disabled:opacity-20"
              onClick={goToNextPageClaimsAddendum}
              disabled={
                currentPageIndexClaimsAddendum >= numPagesClaimsAddendum - 1
              }
            >
              <IoIosArrowForward />
            </button>
          </div>

          {/* Download button */}
          <div className="flex items-center justify-center gap-2">
            <button
              className="mt-1 px-3 py-2 bg-[#1e194b] text-white rounded-lg hover:bg-[#334385]"
              onClick={() => downloadPdf(ClaimsURL)}
            >
              <GrDownload size={18} />
            </button>
            <div className="flex space-x-2 mt-1">
              <button
                className="px-3 py-2 bg-[#1e194b] text-white rounded-lg hover:bg-[#334385]"
                onClick={zoomOut}
              >
                <AiOutlineZoomOut size={18} />
              </button>
              <button
                className="px-3 py-2 bg-[#1e194b] text-white rounded-lg hover:bg-[#334385]"
                onClick={zoomIn}
              >
                <AiOutlineZoomIn size={18} />
              </button>
            </div>
          </div>
          <div
            className="overflow-auto w-full"
            style={{ width: `${scale * 140}%`, maxWidth: "140%" }}
          >
            <Document
              file={ClaimsURL}
              onLoadSuccess={onDocumentLoadSuccessClaimsAddendum}
              className="shadow-lg border rounded-lg flex items-center justify-center w-full"
            >
              {currentPageNumberClaimsAddendum > 0 && (
                <Page
                  pageNumber={currentPageNumberClaimsAddendum}
                  scale={scale}
                  className="border p-2"
                />
              )}
            </Document>
          </div>
        </div>
      )}
    </div>
  );
};

DisplayPdf.propTypes = {
  citations: PropTypes.arrayOf(PropTypes.number).isRequired,
  iso: PropTypes.arrayOf(PropTypes.number),
  ADDENDUM: PropTypes.arrayOf(PropTypes.number),
  Claims: PropTypes.arrayOf(PropTypes.number),
  ClaimsAddendum: PropTypes.arrayOf(PropTypes.number),
};

export default DisplayPdf;
