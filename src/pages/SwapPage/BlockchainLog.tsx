import { Grid } from "@material-ui/core";
import React from "react";
import { Ledger, LedgerKind, LedgerState, Role } from "../../api/swapTypes";
import LedgerCard from "./LedgerCard";

interface Rfc003BlockchainLogProps {
  alphaState: LedgerState;
  alphaLedger: Ledger;
  betaState: LedgerState;
  betaLedger: Ledger;
  role: Role;
}

function Rfc003BlockchainLog({
  alphaState,
  alphaLedger,
  betaState,
  betaLedger,
  role
}: Rfc003BlockchainLogProps) {
  return (
    <React.Fragment>
      <Grid item={true} xs={6}>
        <LedgerCard
          ledgerKind={LedgerKind.Alpha}
          ledger={alphaLedger}
          ledgerState={alphaState}
          otherLedgerState={betaState}
          role={role}
        />
      </Grid>
      <Grid item={true} xs={6}>
        <LedgerCard
          ledgerKind={LedgerKind.Beta}
          ledger={betaLedger}
          ledgerState={betaState}
          otherLedgerState={alphaState}
          role={role}
        />
      </Grid>
    </React.Fragment>
  );
}

export default Rfc003BlockchainLog;
