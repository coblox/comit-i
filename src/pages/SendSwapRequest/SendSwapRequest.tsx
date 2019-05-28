import { Grid } from "@material-ui/core";
import React, { useReducer, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import URI from "urijs";
import postRfc003Swap from "../../api/postRfc003Swap";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import Fieldset from "../../components/Fieldset";
import Page from "../../components/Page";
import ProtocolTextField from "../../components/ProtocolTextField";
import SendButton from "../../components/SendButton";
import TextField from "../../components/TextField";
import Rfc003ParamsForm, {
  defaultRfc003Params,
  resetAlphaIdentity,
  resetBetaIdentity,
  Rfc003Params
} from "../../forms/Rfc003ParamsForm";
import SwapForm, {
  emptySwap,
  reducer as swapReducer
} from "../../forms/SwapForm";
import ledgers from "../../ledgerSpec";

const SendSwap = ({ location, history }: RouteComponentProps) => {
  const [swap, dispatch] = useReducer(swapReducer, emptySwap);

  const [params, setParams] = useState<Rfc003Params>(defaultRfc003Params);
  const [peer, setPeer] = useState(
    "QmPRNaiDUcJmnuJWUyoADoqvFotwaMRFKV2RyZ7ZVr1fqd"
  );
  const [displayError, setDisplayError] = useState(false);

  const queryParams = URI.parseQuery(location.search) as {
    protocol: string | undefined;
  };
  const protocol = queryParams.protocol || "";

  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    postRfc003Swap(swap, params, peer)
      .then(() => history.push("/"))
      .catch(() => setDisplayError(true));
  };

  const setProtocol = (protocolName: string) => {
    history.push({ search: `?protocol=${protocolName}` });
  };

  return (
    <React.Fragment>
      <Page title={"Send a swap request"}>
        <form onSubmit={handleFormSubmit}>
          <Grid container={true} spacing={2}>
            <SwapForm
              swap={swap}
              ledgers={ledgers}
              dispatch={dispatch}
              onAlphaLedgerChange={() => setParams(resetAlphaIdentity(params))}
              onBetaLedgerChange={() => setParams(resetBetaIdentity(params))}
            />
            <Grid item={true} xs={12}>
              <Fieldset legend="Protocol Parameters">
                <Grid item={true} xs={12} md={6}>
                  <ProtocolTextField
                    protocol={protocol}
                    onChange={newProtocol => {
                      setProtocol(newProtocol);
                      setParams(defaultRfc003Params);
                    }}
                  />
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
                  onChange={event => setPeer(event.target.value)}
                  label={"Peer"}
                  helperText={"Peer ID"}
                  data-cy="peer-input"
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

export default withRouter(SendSwap);
