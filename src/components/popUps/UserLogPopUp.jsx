import { FiLogOut } from "react-icons/fi";
import { triggerLogout } from "../../api/logOut";

const UserLogPopUp = () => {
  const handleLogout = async () => {
    console.log(`Log out triggered!`);
    try {
      await triggerLogout(); // Await the result of the logout request
      console.log("User successfully logged out.");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="shadow-picShadow rounded-md bg-[#0000A0] border-4 border-[#AA231A] text-white font-medium h-20 w-32 flex flex-col">
      <div className="flex-1"></div>
      <div className="hover:bg-[#587fcd] mb-1 p-2 rounded-sm cursor-pointer flex-1">
        <div
          onClick={handleLogout}
          className=" flex items-center justify-center gap-x-2"
        >
          <FiLogOut size={20} />
          <div>Log out</div>
        </div>
      </div>
    </div>
  );
};

export default UserLogPopUp;
