import { Typography } from "@material-ui/core";
import React from "react";
import { HtlcState, LedgerKind, Role } from "../../api/swapTypes";

interface WaitingForProps {
  role: Role;
  ledgerKind: LedgerKind;
  alphaHtlcState: HtlcState;
  betaHtlcState: HtlcState;
}

function WaitingFor({
  role,
  ledgerKind,
  alphaHtlcState,
  betaHtlcState
}: WaitingForProps) {
  switch (role) {
    case Role.Alice:
      if (
        ledgerKind === LedgerKind.Beta &&
        alphaHtlcState === HtlcState.Funded &&
        (betaHtlcState === HtlcState.NotDeployed ||
          betaHtlcState === HtlcState.Deployed)
      ) {
        return (
          <Typography>
            <b>Waiting</b> for the other party to fund the HTLC!
          </Typography>
        );
      }

      if (
        ledgerKind === LedgerKind.Alpha &&
        alphaHtlcState === HtlcState.Funded &&
        betaHtlcState === HtlcState.Redeemed
      ) {
        return (
          <Typography>The other party has yet to redeem this asset.</Typography>
        );
      }
      return null;
    case Role.Bob:
      if (
        ledgerKind === LedgerKind.Alpha &&
        alphaHtlcState === HtlcState.NotDeployed &&
        betaHtlcState === HtlcState.NotDeployed
      ) {
        return (
          <Typography>
            <b>Waiting</b> for the other party to fund the HTLC!
          </Typography>
        );
      }

      if (
        ledgerKind === LedgerKind.Beta &&
        alphaHtlcState === HtlcState.Funded &&
        betaHtlcState === HtlcState.Funded
      ) {
        return (
          <Typography>
            <b>Waiting</b> for the other party to redeem this asset!
          </Typography>
        );
      }
      return null;
    default:
      return null;
  }
}

export default WaitingFor;
