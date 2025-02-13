import { createContext, useRef, useState } from "react";
import PropTypes from "prop-types";

// initialize default methods for context.
export const AlertContext = createContext({
  alert: () => {},
  close: () => {},
});

const AlertProvider = ({ children }) => {
  const [alertShown, setAlertShown] = useState(false); // toggles the view state of the alert component
  const [notification, setNotification] = useState(); // stores the configuration data for the alert component
  const timerRef = useRef(); // stores the timer value for autoclosing the alert component

  // closes the alert component and reverts all config to default values.
  const close = () => {
    setAlertShown(false);
    setNotification(undefined);
    clearTimeout(timerRef.current);
  };

  // opens the alert component and configures its view state.
  const alert = (args) => {
    setNotification(args);
    setAlertShown(true);

    if (args.autoClose) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        close();
      }, notification?.delay || 4400);
    }

    return notification;
  };

  return (
    <AlertContext.Provider
      value={{
        notification,
        alert,
        alertShown,
        close,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

// Prop validation for AlertProvider
AlertProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AlertProvider;
