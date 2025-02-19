import React, { useState } from "react";
import { rateResponse } from "../../api/rateResponse";
import PropTypes from "prop-types";

const ratings = [
  "Wrong metric or data source referenced",
  "The reference is not updated",
  "Visual is incorrect",
  "Missing information",
  "Didn't fully follow the instructions",
  "Other",
];

const Rate = (props) => {
  const { onRateSubmit, message_id, thumbsUpClicked } = props;
  const [selectedRating, setSelectedRating] = useState("");
  const [customInput, setCustomInput] = useState("");

  // Handle selecting a pre-defined rating
  const handleOptionClick = (rating) => {
    setSelectedRating(rating);
    setCustomInput(rating); // Set the input field to the selected option
  };

  // Handle custom input change
  const handleInputChange = (e) => {
    setCustomInput(e.target.value);
    setSelectedRating(""); // Clear the selected rating if user starts typing
  };

  // Handle form NEGATIVE submission
  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    //Positive Rating Logic
    if (thumbsUpClicked) {
      try {
        const result = await rateResponse(
          message_id,
          "POSITIVE",
          true,
          customInput.trim()
        );
        console.log(`response for rate chat `, result);
      } catch (err) {
        console.log(err);
      } finally {
        onRateSubmit(true);
      }
      return;
    }

    //Negative Rating Logic
    const isRatingInvalid = !customInput.trim() && !selectedRating;
    console.log("Submitted response:", isRatingInvalid);

    if (isRatingInvalid) {
      onRateSubmit(false); // Pass `false` if rating is invalid
      return; // Stop submission if rating is invalid
    }

    onRateSubmit(true);
    console.log(
      `before negative rating ${message_id}, text ${
        customInput.trim() || selectedRating
      }`
    );
    try {
      const result = await rateResponse(
        message_id,
        "NEGATIVE",
        true,
        customInput.trim() || selectedRating
      );
      console.log(`response for rate chat ${result.response}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mt-4 h-34 rounded-xl bg-[#595c5e] relative">
      <div className="p-3 text-white">Why did you choose this rating?</div>

      {/* Display selectable options */}
      <div className="p-3 flex flex-col mb-2 text-xs">
        {!thumbsUpClicked && (
          <div className="flex flex-wrap">
            {ratings.map((rating, ind) => (
              <div
                key={ind}
                onClick={() => handleOptionClick(rating)}
                className={`flex m-1 rounded-md p-2 text-sm items-center justify-center cursor-pointer w-40 h-15 ${
                  selectedRating === rating
                    ? "bg-[#3a6883] text-white"
                    : "bg-[#eaf3f3] text-black"
                }`}
              >
                {rating}
              </div>
            ))}
          </div>
        )}

        {/* Input field for custom response */}
        <form
          onSubmit={handleRatingSubmit}
          className="flex gap-10 m-2 justify-start"
        >
          <input
            placeholder="(Optional) feel free to add any details"
            value={customInput}
            onChange={handleInputChange}
            className="w-6/12 h-10 p-2 focus:border focus:border-teal-300 focus:outline-none"
            type="text"
          />
          <input
            className="bg-[#86d8f1] text-black rounded-md p-2 w-1/4 text-sm font-medium cursor-pointer hover:bg-teal-200"
            type="submit"
            value="Submit"
          />
        </form>
      </div>
    </div>
  );
};

Rate.propTypes = {
  onRateSubmit: PropTypes.func.isRequired,
  message_id: PropTypes.string.isRequired,
  thumbsUpClicked: PropTypes.bool.isRequired,
};

export default Rate;
