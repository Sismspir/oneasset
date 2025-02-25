import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./components/Login";
import HomePage from "./components/HomePage";
import AlertContainer from "./components/alerts/AlertContainer";
import Upload from "./components/Upload";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { useState } from "react";

function MainApp() {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );

  const updateUser = (user) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }
  };
  return (
    <AlertContainer>
      <Router>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/chat" element={<App />} />
          <Route path="/upload" element={<App />} />
          <Route path="/smartSummary" element={<App />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Router>
    </AlertContainer>
  );
}

export default MainApp;
