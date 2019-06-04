import { ThemeProvider } from "@material-ui/styles";
import { storiesOf } from "@storybook/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import LinkLandingPage from "../src/pages/LinkLandingPage/LinkLandingPage";
import appTheme from "../src/theme";

storiesOf("LinkLandingPage", module).add("render form", () => (
  <ThemeProvider theme={appTheme}>
    <BrowserRouter>
      <LinkLandingPage />
    </BrowserRouter>
  </ThemeProvider>
));
