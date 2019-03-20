import { Typography } from "@material-ui/core";
import React from "react";
import FieldSet from "../../components/FieldSet";
import { Asset, Ledger } from "./LinkLandingPage";

interface LedgerDetailProps {
  label: string;
  ledger: Ledger;
  asset: Asset;
}

function LedgerDetail({ label, ledger, asset }: LedgerDetailProps) {
  return (
    <FieldSet label={label}>
      <Typography variant="body2">
        Ledger: {ledger.name} on {ledger.network}
        <br />
        Asset: {asset.amount} {asset.symbol}
        {asset.tokenId && (
          <React.Fragment>
            <br />
            {`Token ID ${asset.tokenId}`}
          </React.Fragment>
        )}
      </Typography>
    </FieldSet>
  );
}

export default LedgerDetail;
