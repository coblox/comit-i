import { Grid } from "@material-ui/core";
import { Location } from "history";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import postRfc003Swap from "../../api/postRfc003Swap";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import Fieldset from "../../components/Fieldset";
import Page from "../../components/Page";
import ProtocolTextField from "../../components/ProtocolTextField";
import SendButton from "../../components/SendButton";
import TextField from "../../components/TextField";
import Rfc003ParamsForm, {
  defaultRfc003Params,
  Rfc003Params
} from "../../forms/Rfc003ParamsForm";
import SwapForm, { emptySwap } from "../../forms/SwapForm";
import ledgers from "../../ledgerSpec";
import ErrorMessage from "./ErrorMessage";
import InfoMessage from "./InfoMessage";
import parseQuery from "./parseQuery";
import parseSwapParams from "./parseSwapParams";

function parseSwapParameters(location: Location) {
  try {
    const parsedQuery = parseSwapParams(parseQuery(location.search));

    const {
      alphaLedger,
      betaLedger,
      alphaAsset,
      betaAsset,
      peer,
      protocol
    } = parsedQuery;

    const swap = {
      alpha_ledger: {
        ...alphaLedger
      },
      beta_ledger: {
        ...betaLedger
      },
      alpha_asset: {
        ...alphaAsset
      },
      beta_asset: {
        ...betaAsset
      }
    };

    return {
      swap,
      peer,
      protocol,
      error: false
    };
  } catch (error) {
    return {
      swap: emptySwap,
      peer: "",
      protocol: "",
      error: true
    };
  }
}

const LinkLandingPage = ({ location, history }: RouteComponentProps) => {
  const [params, setParams] = useState<Rfc003Params>(defaultRfc003Params);
  const { swap, peer, protocol, error } = parseSwapParameters(location);
  const [displayError, setDisplayError] = useState(false);

  const onSubmit = (e: any) => {
    e.preventDefault();

    postRfc003Swap(swap, params, peer)
      .then(() => history.push("/"))
      .catch(() => setDisplayError(true));
  };

  return (
    <React.Fragment>
      <Page title={"Send a swap request"}>
        <form onSubmit={onSubmit}>
          <Grid container={true} spacing={2}>
            <Grid item={true} xs={12}>
              {error ? <ErrorMessage /> : <InfoMessage />}
            </Grid>
            <SwapForm
              swap={swap}
              ledgers={ledgers}
              dispatch={() => undefined}
              disabled={true}
            />
            <Grid item={true} xs={12}>
              <Fieldset legend="Protocol Parameters">
                <Grid item={true} xs={12} md={6}>
                  <ProtocolTextField protocol={protocol} disabled={true} />
                </Grid>
                {protocol === "rfc003" && (
                  <Rfc003ParamsForm
                    alphaLedger={swap.alpha_ledger.name}
                    betaLedger={swap.beta_ledger.name}
                    params={params}
                    setParams={setParams}
                  />
                )}
              </Fieldset>
            </Grid>
            <Grid item={true} xs={12}>
              <Fieldset legend={"To"}>
                <TextField
                  value={peer}
                  label={"Peer"}
                  helperText={"IPv4 Socket Address"}
                  data-cy="peer-input"
                  disabled={true}
                  required={true}
                />
              </Fieldset>
            </Grid>
            <Grid item={true} xs={12}>
              <SendButton />
            </Grid>
          </Grid>
        </form>
      </Page>

      <ErrorSnackbar
        message={"Failed to create swap."}
        onClose={() => setDisplayError(false)}
        open={displayError}
      />
    </React.Fragment>
  );
};

export default withRouter(LinkLandingPage);
