import { Store, withState } from "@dump247/storybook-state";
import { Button, Dialog } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { storiesOf } from "@storybook/react";
import React from "react";
import { Web3Provider } from "../src/components/Web3Context";
import SirenActionParametersDialogBody from "../src/pages/ListSwaps/SirenActionParametersDialogBody";
import appTheme from "../src/theme";

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

storiesOf("SirenActionParametersDialogBody", module)
  .add(
    "Accept action",
    withState({ open: false })(({ store }) => (
      <Web3Provider>
        <ThemeProvider theme={appTheme}>
          <Button onClick={openDialog(store)}>Trigger action</Button>

          <Dialog open={store.state.open} maxWidth={"sm"} fullWidth={true}>
            <SirenActionParametersDialogBody
              action={{
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
              }}
              onClose={closeDialog(store)}
              onSubmit={request => {
                // tslint:disable-next-line:no-console
                console.log(request);
                closeDialog(store)();
              }}
            />
          </Dialog>
        </ThemeProvider>
      </Web3Provider>
    ))
  )
  .add(
    "Redeem Bitcoin",
    withState({ open: false })(({ store }) => (
      <Web3Provider>
        <ThemeProvider theme={appTheme}>
          <Button onClick={openDialog(store)}>Trigger action</Button>

          <Dialog open={store.state.open} maxWidth={"sm"} fullWidth={true}>
            <SirenActionParametersDialogBody
              action={{
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
              }}
              onClose={closeDialog(store)}
              onSubmit={request => {
                // tslint:disable-next-line:no-console
                console.log(request);
                closeDialog(store)();
              }}
            />
          </Dialog>
        </ThemeProvider>
      </Web3Provider>
    ))
  );
