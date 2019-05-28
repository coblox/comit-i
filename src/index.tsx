import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles"; // Workaround until @material-ui/styles is stable
import "promise-polyfill/src/polyfill"; // Not all environments support Promise.finally
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Web3Provider } from "./components/Web3Context";
import appTheme from "./theme";

navigator.registerProtocolHandler("web+comit", "/from_link?%s", "COMIT-i");

ReactDOM.render(
  <ThemeProvider theme={appTheme}>
    <Web3Provider>
      <BrowserRouter>
        <React.Fragment>
          <CssBaseline />
          <App />
        </React.Fragment>
      </BrowserRouter>
    </Web3Provider>
  </ThemeProvider>,
  document.getElementById("root")
);
