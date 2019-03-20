import { storiesOf } from "@storybook/react";
import React from "react";
import LinkLandingPage from "../src/pages/LinkLandingPage/LinkLandingPage";

storiesOf("LinkLandingPage", module)
  .add("render form", () => (
    <LinkLandingPage/>
  ))
;
