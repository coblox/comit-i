import {
  Card,
  CardContent,
  CardHeader,
  List,
  Typography
} from "@material-ui/core";
import React from "react";
import {
  HtlcState,
  Ledger,
  LedgerKind,
  LedgerState,
  Role
} from "../../api/swapTypes";
import ExplorerLink, { ResourceType } from "./ExplorerLink";
import HtlcLocationTypography from "./HtlcLocationTypography";
import WaitingFor from "./WaitingFor";

interface LedgerCardProps {
  ledgerKind: LedgerKind;
  ledger: Ledger;
  ledgerState: LedgerState;
  otherLedgerState: LedgerState;
  role: Role;
}

function LedgerCard({
  ledgerKind,
  ledger,
  ledgerState,
  otherLedgerState,
  role
}: LedgerCardProps) {
  let transactions = [
    { verb: "deployed", hash: ledgerState.deploy_tx },
    { verb: "funded", hash: ledgerState.fund_tx },
    { verb: "redeemed", hash: ledgerState.redeem_tx },
    { verb: "refunded", hash: ledgerState.refund_tx }
  ];

  if (ledgerState.deploy_tx === ledgerState.fund_tx) {
    transactions = transactions.slice(1);
  }

  const ledgerStates = [ledgerState, otherLedgerState];
  const [alphaLedgerState, betaLedgerState] =
    ledgerKind === LedgerKind.Alpha ? ledgerStates : ledgerStates.reverse();

  return (
    <Card>
      <CardHeader title={ledgerKind} />
      <CardContent>
        {ledgerState.htlc_location && (
          <HtlcLocationTypography
            ledger={ledger}
            location={ledgerState.htlc_location}
          />
        )}
        <List>
          {ledgerState.status !== HtlcState.NotDeployed ? (
            transactions
              .filter(tx => !!tx.hash)
              .map(tx => {
                return (
                  <React.Fragment key={tx.verb}>
                    <Typography>
                      HTLC <b>{tx.verb}</b> with transaction
                    </Typography>
                    <ExplorerLink
                      ledger={ledger}
                      hash={tx.hash as string}
                      resourceType={ResourceType.Transaction}
                    />
                  </React.Fragment>
                );
              })
          ) : (
            <Typography>No recorded events.</Typography>
          )}
        </List>
        <WaitingFor
          role={role}
          ledgerKind={ledgerKind}
          alphaHtlcState={alphaLedgerState.status}
          betaHtlcState={betaLedgerState.status}
        />
      </CardContent>
    </Card>
  );
}

export default LedgerCard;
