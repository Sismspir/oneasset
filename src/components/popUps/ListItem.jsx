import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import PropTypes from "prop-types";

const ListItem = (props) => {
  const { title, isOpen, onClick, isLast = false } = props;
  return (
    <div className="flex items-center gap-2 relative mb-1">
      {/* Bullet Point */}
      <div className="w-3 h-3 bg-gray-500 rounded-full absolute left-[-19px]"></div>

      {/* Button */}
      <button
        className="h-8 w-full rounded-xl flex items-center justify-between text-[#12273b] font-medium p-2 px-4 "
        onClick={onClick}
      >
        <div className="">{title}</div>
        {isOpen ? <SlArrowUp size={18} /> : <SlArrowDown size={18} />}
      </button>
    </div>
  );
};

ListItem.propTypes = {
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  isLast: PropTypes.bool.isRequired,
};

export default ListItem;
