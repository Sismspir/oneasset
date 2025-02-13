import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { HiDotsHorizontal } from "react-icons/hi";
import { removeFromFavorites } from "../api/removeFavorite";
import { selectChat } from "../api/selectChat";
import { AiOutlineDelete } from "react-icons/ai";

const DisplayFavorites = (props) => {
  const {
    navbarOpen,
    favorites: initialFavorites,
    changeSessionId,
    updateConversationHistory,
    removeFavoriteFromHistory,
    userName,
  } = props;
  const [favorites, setFavorites] = useState(initialFavorites); // Local state for favorites
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [optionsIndex, setOptionsIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const fetchChat = async (session_id) => {
    try {
      const result = await selectChat(userName, session_id);
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  const removeFavorite = async (id) => {
    try {
      await removeFromFavorites(userName, id);
      setOptionsIndex(null);
      removeFavoriteFromHistory(id);
    } catch (err) {
      console.log(err);
    }
  };

  const hasFavorites = Object?.keys(favorites || {}).some(
    (key) => favorites?.[key]?.favorite === true
  );

  useEffect(() => {
    setFavorites(initialFavorites); // Sync favorites state with initialFavorites prop on mount or prop change
  }, [initialFavorites]);

  return (
    <div
      className={`${
        !navbarOpen && "overflow-y-hidden"
      } w-full max-w-full overflow-x-hidden pl-3 ${
        !hasFavorites || !navbarOpen
          ? "max-h-[3rem]"
          : "min-h-[4.5rem] max-h-[5.8rem]"
      } overflow-y-auto text-white flex flex-col gap-2`}
    >
      {Object?.keys(favorites)
        ?.sort(
          (a, b) => new Date(favorites[b]?.date) - new Date(favorites[a]?.date)
        ) // Sort by date in descending order
        ?.filter((key) => favorites[key]?.favorite === true)
        ?.map((key, index) => {
          const conversationsArray = favorites[key]?.conversations;
          const firstConversation = conversationsArray
            ? conversationsArray[0]
            : {};

          return (
            <div
              key={`${key}-${index}`}
              onClick={() => {
                console.log(typeof key, "line 40 in Favorites", key);
                changeSessionId(key);
                fetchChat(key);
                updateConversationHistory(conversationsArray);
              }}
              onMouseEnter={() => setHoveredIndex(key)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative rounded-md p-1 text-sm flex items-center gap-1 w-full max-w-full cursor-pointer hover:bg-[#365696]"
            >
              {editIndex === firstConversation?.id ? (
                <input
                  type="text"
                  value={editValue}
                  className="border-b-2 border-[#20ceb1] w-full p-1"
                  autoFocus
                />
              ) : (
                <span className="truncate">
                  {favorites[key]?.session_name.slice(0, 60)}
                </span>
              )}
              <div
                className="cursor-pointer w-12"
                style={{
                  visibility: hoveredIndex === key ? "visible" : "hidden",
                  minWidth: "24px",
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent onClick
                  setOptionsIndex(optionsIndex === key ? null : key);
                }}
              >
                <HiDotsHorizontal size={20} />
              </div>
              {optionsIndex === key && (
                <div className="absolute top-full right-1 cursor-pointer  bg-[#9DD563] font-bold text-md text-[#0000A0] rounded-lg mt-1 hover:bg-[rgb(160,239,129)] z-20 flex flex-col shadow-lg">
                  <button
                    className="p-3  hover:rounded-md"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent parent onClick
                      removeFavorite(key);
                    }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <AiOutlineDelete />
                      Remove From Favorites
                    </div>
                  </button>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};
DisplayFavorites.propTypes = {
  userName: PropTypes.string.isRequired,
  favorites: PropTypes.objectOf(
    PropTypes.shape({
      Recent: PropTypes.bool,
      conversations: PropTypes.arrayOf(
        PropTypes.shape({
          answer: PropTypes.string,
          question: PropTypes.string,
          image: PropTypes.string,
          citations: PropTypes.object,
        })
      ),
      date: PropTypes.string,
      favorite: PropTypes.bool,
      session_name: PropTypes.string,
    })
  ).isRequired,
  navbarOpen: PropTypes.bool.isRequired,
  updateConversationHistory: PropTypes.func.isRequired,
  changeSessionId: PropTypes.func.isRequired,
  removeFavoriteFromHistory: PropTypes.func.isRequired,
};

export default DisplayFavorites;
