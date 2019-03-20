import { Button, FormControl, InputLabel, Select } from "@material-ui/core";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import postSwap from "../../api/post_swap";
import Rfc003ParamsForm, {
  defaultRfc003Params,
  Rfc003Params
} from "../SendSwapRequest/Rfc003ParamsForm";
import { SwapParams } from "./LinkLandingPage";

interface Props extends RouteComponentProps {
  swapParams: SwapParams;
}

const LinkLandingForm = ({ swapParams, history }: Props) => {
  const alphaLedger = swapParams.alphaLedger;
  const betaLedger = swapParams.betaLedger;
  const protocol = swapParams.protocol;

  const [params, setParams] = useState<Rfc003Params>(defaultRfc003Params);
  // const [displayError, setDisplayError] = useState(false);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    postSwap(protocol, {
      alpha_ledger: swapParams.alphaLedger,
      beta_ledger: swapParams.betaLedger,
      alpha_asset: {
        name: swapParams.alphaAsset.symbol,
        quantity: swapParams.alphaAsset.amount
      }, // TODO handle erc20
      beta_asset: {
        name: swapParams.betaAsset.symbol,
        quantity: swapParams.betaAsset.amount
      },
      alpha_ledger_refund_identity: params.alphaRefundIdentity,
      beta_ledger_redeem_identity: params.betaRedeemIdentity,
      alpha_expiry: params.alphaExpiry,
      beta_expiry: params.betaExpiry,
      peer: swapParams.peer
    }).then(() => history.push("/"));
    // .catch(() => setDisplayError(true));
  };

  // const hideError = () => setDisplayError(false);

  return (
    <React.Fragment>
      <form onSubmit={handleFormSubmit}>
        <fieldset>
          <legend>Input Parameters</legend>
          <FormControl>
            <InputLabel htmlFor={"protocol"}>Protocol</InputLabel>
            <Select
              native={true}
              required={true}
              value={protocol}
              onChange={() => {
                setParams(defaultRfc003Params);
              }}
              inputProps={{
                name: "protocol"
              }}
            >
              <option value={""} />
              <option value={"rfc003"}>RFC003</option>
            </Select>
          </FormControl>
          {protocol === "rfc003" && (
            <Rfc003ParamsForm
              alphaLedger={alphaLedger.name}
              betaLedger={betaLedger.name}
              params={params}
              setParams={setParams}
            />
          )}
        </fieldset>

        <SendButton />
      </form>
      {/*<ErrorSnackbar*/}
      {/*message={"Failed to create swap."}*/}
      {/*onClose={hideError}*/}
      {/*open={displayError}*/}
      {/*/>*/}
    </React.Fragment>
  );
};

function SendButton() {
  return (
    <Button type="submit" variant="contained" color="primary">
      Send
    </Button>
  );
}

export default withRouter(LinkLandingForm);
