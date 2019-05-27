import { Store, withState } from "@dump247/storybook-state";
import { Button, Dialog } from "@material-ui/core";
import { install, ThemeProvider } from "@material-ui/styles";
import { storiesOf } from "@storybook/react";
import React from "react";
import SirenActionDialogBody from "../src/pages/ListSwaps/SirenActionDialogBody";
import appTheme from "../src/theme";
import { Web3Provider } from "../src/components/Web3Context";

install();

interface DialogStoryState {
  open: boolean;
}

const openDialog = (store: Store<DialogStoryState>) => () =>
  store.set({
    open: true
  });

const closeDialog = (store: Store<DialogStoryState>) => () =>
  store.set({
    open: false
  });

storiesOf("SirenActionDialogBody", module)
  .add(
    "Accept action",
    withState({ open: false })(({ store }) => (
      <Web3Provider>
        <ThemeProvider theme={appTheme}>
          <Button onClick={openDialog(store)}>Trigger action</Button>

          {/* In the actual application, the rendering will be based on a route! */}
          {store.state.open && <Dialog open={true} maxWidth={"sm"} fullWidth={true}>
            <SirenActionDialogBody action={{
              title: "Accept",
              method: "POST",
              href: "/abcd/accept",
              name: "accept",
              fields: [
                {
                  title: "Alpha ledger redeem identity",
                  type: "text",
                  name: "alpha_ledger_redeem_identity",
                  class: ["ethereum", "address"]
                }
              ]
            }} onClose={closeDialog(store)}/>
          </Dialog>}
        </ThemeProvider>
      </Web3Provider>
    )))
  .add(
    "Redeem Bitcoin",
    withState({ open: false })(({ store }) => (
      <Web3Provider>
        <ThemeProvider theme={appTheme}>
          <Button onClick={openDialog(store)}>Trigger action</Button>

          {/* In the actual application, the rendering will be based on a route! */}
          {store.state.open && <Dialog open={true} maxWidth={"sm"} fullWidth={true}>
            <SirenActionDialogBody action={{
              title: "Redeem",
              method: "GET",
              href: "/abcd/redeem",
              name: "redeem",
              fields: [
                {
                  title: "Beta ledger redeem identity",
                  type: "text",
                  name: "beta_ledger_redeem_identity",
                  class: ["bitcoin", "address"]
                },
                {
                  title: "Fee per byte",
                  type: "number",
                  name: "feePerByte",
                  class: ["bitcoin", "feePerByte"]
                }
              ]
            }} onClose={closeDialog(store)}/>
          </Dialog>}
        </ThemeProvider>
      </Web3Provider>
    )));
