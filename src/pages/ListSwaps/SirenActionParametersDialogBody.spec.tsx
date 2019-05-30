import { ThemeProvider } from "@material-ui/styles";
import React from "react";
import renderer from "react-test-renderer";
import appTheme from "../../theme";
import SirenActionParametersDialogBody from "./SirenActionParametersDialogBody";

it("renders correctly", () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={appTheme}>
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
          onClose={() => ({})}
          onSubmit={() => ({})}
        />
      </ThemeProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
