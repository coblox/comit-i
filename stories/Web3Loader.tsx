import { storiesOf } from "@storybook/react";
import React from "react";
import { Web3Loader, Web3Provider } from "../src/components/Web3Context";

storiesOf("Web3Context", module)
  .add("render text ifPresent", () => (
    <Web3Provider>
      <Web3Loader ifPresent={() => <span>web3 is available</span>} />
    </Web3Provider>
  ))
  .add("render text ifNotPresent", () => (
    <Web3Provider>
      <Web3Loader ifNotPresent={() => <span>web3 is not available</span>} />
    </Web3Provider>
  ));
