import { createStyles, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { WithStyles } from "@material-ui/styles/withStyles";
import queryString, { ParsedQuery } from "query-string";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import LinkLandingForm from "./LinkLandingForm";

export interface Ledger {
  name: string;
  network: string;
}

export interface Asset {
  symbol: string;
  amount: string;
  tokenId?: string;
}

export interface SwapParams {
  alphaLedger: Ledger;
  alphaAsset: Asset;
  betaLedger: Ledger;
  betaAsset: Asset;
  protocol: string;
  peer: string;
  id: string;
}

// Have to use any to access custom mixins
const styles = (theme: any) =>
  createStyles({
    root: {
      margin: "auto",
      [theme.breakpoints.up("md")]: {
        maxWidth: "50vw"
      },
      [theme.breakpoints.up("xl")]: {
        maxWidth: "40vw"
      },
      padding: theme.spacing.unit * 3
    },
    group: theme.mixins.border(theme),
    title: {
      marginBottom: theme.spacing.unit * 3
    },
    fieldset: theme.mixins.border(theme),
    formControl: {
      margin: theme.spacing.unit,
      minWidth: "10rem"
    }
  });

interface LinkLandingProps
  extends RouteComponentProps,
    WithStyles<typeof styles> {}

function parseLedger(
  input: string | string[] | undefined | null
): Ledger | null {
  if (input instanceof Array) {
    input = input[0];
  }
  if (!input) {
    return null;
  }
  const regex = /([A-Za-z0-9]+)(-([a-zA-Z0-9]+))?/g;

  const match = regex.exec(input) || [];
  if (!match.length) {
    return null;
  }
  /* eslint-disable no-console */
  // console.log(match);
  /* eslint-enable no-console */
  const name = match[1] || "";
  const network = match[3] || "mainnet";
  return { name, network };
}

function parseAsset(input: string | string[] | undefined | null): Asset | null {
  if (input instanceof Array) {
    input = input[0];
  }
  if (!input) {
    return null;
  }
  const regex = /([.0-9]+)([a-zA-Z]+[0-9]*)(:(.+))?/g;

  const match = regex.exec(input) || [];
  if (!match.length) {
    return null;
  }
  /* eslint-disable no-console */
  // console.log(match);
  /* eslint-enable no-console */
  const amount = match[1] || "";
  const symbol = match[2] || "";
  const tokenId = match[4] || "";

  return { amount, symbol, tokenId };
}

function parsePeer(peer: string | string[] | undefined | null) {
  if (peer instanceof Array) {
    return peer[0];
  }
  return peer || "";
}

function parseProtocol(protocol: string | string[] | undefined | null) {
  if (protocol instanceof Array) {
    return protocol[0];
  }
  return protocol || "";
}

function parseSwapParams(parsedQuery: ParsedQuery): SwapParams | null {
  const alphaLedger = parseLedger(parsedQuery.alpha_ledger);
  const alphaAsset = parseAsset(parsedQuery.alpha_asset);

  const betaLedger = parseLedger(parsedQuery.beta_ledger);
  const betaAsset = parseAsset(parsedQuery.beta_asset);

  const protocol = parseProtocol(parsedQuery.protocol);
  const peer = parsePeer(parsedQuery.peer);
  const id = "42";

  if (!alphaAsset || !alphaLedger || !betaAsset || !betaLedger) {
    return null;
  }

  return {
    alphaLedger,
    alphaAsset,
    betaLedger,
    betaAsset,
    protocol,
    peer,
    id
  };
}

const LinkLandingPage = ({ location }: LinkLandingProps) => {
  const swapParams = parseSwapParams(queryString.parse(location.search));
  /* eslint-disable no-console */
  // console.log(swapParams);
  /* eslint-enable no-console */

  return (
    <React.Fragment>
      <fieldset>
        <legend>Link Parameters</legend>
        <Typography variant="body1">
          The swap you select, sorry but you can't change it:
        </Typography>
        {swapParams && (
          <Typography variant="body2">
            Alpha Ledger: {swapParams.alphaLedger.name} on{" "}
            {swapParams.alphaLedger.network}
            <br />
            Alpha Asset {swapParams.alphaAsset.amount}{" "}
            {swapParams.alphaAsset.symbol}
            {swapParams.alphaAsset.tokenId &&
              "Token: " + swapParams.alphaAsset.tokenId}
            <br />
            Beta Ledger: {swapParams.betaLedger.name} on{" "}
            {swapParams.betaLedger.network}
            <br />
            Beta Asset {swapParams.betaAsset.amount}{" "}
            {swapParams.betaAsset.symbol}
            {swapParams.betaAsset.tokenId &&
              " Token: " + swapParams.betaAsset.tokenId}
            <br />
            Peer: {swapParams.peer} <br />
            Protocol: {swapParams.protocol} <br />
            Trade ID: {swapParams.id} <br />
          </Typography>
        )}
      </fieldset>

      {swapParams && <LinkLandingForm swapParams={swapParams} />}
    </React.Fragment>
  );
};

export default withRouter(withStyles(styles)(LinkLandingPage));
