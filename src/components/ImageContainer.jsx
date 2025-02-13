import { useState } from "react";
const ImageContainer = (props) => {
  const [selectedSrc, setSelectecSrc] = useState(props);
  return (
    <div>
      <h3>Revenue Comparison</h3>
      <div
        onClick={() => {
          setSelectecSrc(
            "https://pinhole.finance.yahoo.com/chart/FMCSX/__screenshot"
          );
        }}
        className="financial-image-container hover:cursor-pointer"
      >
        <img
          src={selectedSrc}
          alt="Revenue Comparison"
          style={{ width: "170px", height: "100px" }}
        />
      </div>
    </div>
  );
};

export default ImageContainer;
