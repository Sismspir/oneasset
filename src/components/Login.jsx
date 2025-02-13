import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IoMdPerson } from "react-icons/io";
import { AiFillEye } from "react-icons/ai";
import { useAlert } from "../components/alerts/AlertContainer";

function Login(props) {
  const { updateUser } = props;
  const [loginImg, setLoginImg] = useState(true);
  const [revealPass, setRevealPass] = useState(false);

  const navigate = useNavigate();
  const { alert } = useAlert();
  const handleCheck = () => {
    console.log("Password is remembered!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const username = form.username.value;
    const password = form.password.value;

    if (username === "PackUser" && password === "Pack123!#^") {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ logUser: username, logId: 12345 })
      );
      alert({
        title: "",
        message: "You have successfully logged in.",
        autoClose: true,
      });
      updateUser(username);
      navigate("/home");
    } else {
      alert({
        title: "Wrong Credentials",
        message: "Check the Credentials again please",
        autoClose: true,
      });
    }
  };

  return (
    <>
      <div
        className="bg-[#282879] pattern-topography-stone-700/100 
        pattern-topography-scale-[1] flex flex-col space-y-5 w-full h-screen items-center"
      >
        <div className="w-1/2 mt-2 mb-2 h-1/6 flex justify-center items-center rounded-3xl relative">
          <div className="w-3/4 h-2/3 ">
            <span className="font-bold text-[2rem] ">
              <div className="italic font-sans flex flex-col font-bold text-[2.5rem] rounded-xl ">
                <span className="flex items-center justify-center space-x-4 ">
                  <p className="text-[#d68556]">Pack</p>
                  <p className="text-[#d1a35f]">Gpt</p>
                </span>
                <p className="text-[#ffe3bf] text-center">Log In</p>
              </div>
            </span>
          </div>
        </div>
        <div
          onMouseEnter={() => {
            setLoginImg(!loginImg);
          }}
          onMouseLeave={() => {
            setLoginImg(!loginImg);
          }}
          style={{
            backgroundImage: `url('')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
          className="w-1/2 h-2/3 flex flex-col items-center rounded-3xl"
        >
          <div className="w-full h-3/5 flex flex-col my-20">
            <div className="relative">
              <form
                className="absolute inset-7 opacity-100 z-10 flex flex-col space-y-5 items-center"
                action="submit"
                onSubmit={(e) => handleSubmit(e)}
              >
                <div className="relative">
                  <input
                    className="py-2 px-2 rounded-xl "
                    type="text"
                    name="username"
                    placeholder="Username"
                  />
                  <span className="text-[#1f1a68f8]  text-[1.2rem] absolute top-1/2 right-2.5 -mt-2">
                    <IoMdPerson />
                  </span>
                </div>
                <div className="relative">
                  <input
                    className="py-2 px-2 rounded-xl"
                    type={revealPass ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                  />
                  <span
                    onClick={() => {
                      setRevealPass(!revealPass);
                    }}
                    className="text-[#1f1a68f8] text-[1.25rem] absolute top-1/2 right-2.5 -mt-2 hover:cursor-pointer hover:text-[#41a0ee]"
                  >
                    <AiFillEye />
                  </span>
                </div>
                <div className="px-4">
                  <input
                    onChange={handleCheck}
                    className="w-5 h-5"
                    type="checkbox"
                    name="remember"
                  />
                  <label className="text-white font-semibold text-[1.1rem] ml-3">
                    Remember me?
                  </label>
                </div>
                <input
                  className="bg-[#ffffff] py-1 px-10 font-semibold font-sans rounded-xl hover:cursor-pointer text-[#1f1a68f8] hover:text-[#41a0ee]"
                  type="submit"
                  value="Sign In"
                />
              </form>
            </div>
            <div className="mx-auto mt-60 text-white font-semibold text-[1.1rem] italic opacity-80 underline">
              <a href="">Forgot password?</a>
            </div>
          </div>
          <div className="text-[#fa883d] font-semibold font-mono text-[1.2rem] opacity-75 italic my-11-3">
            AI Assistant with insights on packaging.
          </div>
        </div>
      </div>
    </>
  );
}

Login.propTypes = {
  updateUser: PropTypes.func.isRequired,
};

export default Login;
