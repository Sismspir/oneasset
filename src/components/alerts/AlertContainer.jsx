import React, { useContext } from "react";
import AlertProvider, { AlertContext } from "./AlertProvider";
import PropTypes from "prop-types";
import Alert from "./Alert";

// create hook to be used globally to toggle alert component.
export const useAlert = () => useContext(AlertContext);

const AlertContainer = ({ children }) => {
  return (
    <AlertProvider>
      <Alert />
      {children}
    </AlertProvider>
  );
};

// Prop validation for AlertProvider
AlertProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AlertContainer;
