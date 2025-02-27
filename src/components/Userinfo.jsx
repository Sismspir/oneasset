import React, { useState } from "react";
import PropTypes from "prop-types";
import { IoIosArrowDown } from "react-icons/io";
import UserLogPopUp from "./popUps/UserLogPopUp";

const Userinfo = (props) => {
  const { userName } = props;
  const [popOpen, setPopOpen] = useState(false);
  return (
    <div className="mt-8 flex flex-col relative z-50">
      <div className="flex gap-x-2">
        <div className="bg-[#00D7B9]  text-white font-medium rounded-full text-lg py-1 px-2">
          {(userName != undefined || !isNaN(userName)) &&
            userName?.split(".")[0]?.charAt(0)?.toUpperCase() +
              userName?.split(".")[1]?.charAt(0)?.toUpperCase()}
        </div>
        <button
          onClick={() => {
            setPopOpen(!popOpen);
          }}
          className="my-auto"
        >
          <IoIosArrowDown size={22} className="text-color-[#00D7B9]" />
        </button>
      </div>
      <div className="absolute z-10 left-0 right-0 top-10 b">
        {popOpen && <UserLogPopUp />}
      </div>
    </div>
  );
};
Userinfo.propTypes = {
  userName: PropTypes.string.isRequired,
};
export default Userinfo;
