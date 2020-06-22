import React from "react";
import ReactDOM from "react-dom";

import "./index.css";

import { LocaleContextProvider } from "./LocaleContext";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// Removed <React.StrictMode> to disable Material UI warnings
// @see https://github.com/mui-org/material-ui/issues/13394

ReactDOM.render(
  <LocaleContextProvider>
    <App />
  </LocaleContextProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
