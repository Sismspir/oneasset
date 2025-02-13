import PropTypes from "prop-types";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({ currentUser }) => {
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

ProtectedRoutes.propTypes = {
  currentUser: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
};

export default ProtectedRoutes;
