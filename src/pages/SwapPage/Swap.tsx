import { Card, Grid } from "@material-ui/core";
import React from "react";
import { Entity } from "../../../gen/siren";
import {
  AdditionalProperties,
  CommunicationStatus,
  Properties,
  Role
} from "../../api/swapTypes";
import Page from "../../components/Page";
import { SubTitle } from "../../components/text";
import AssetCard from "./AssetCard";
import Rfc003BlockchainLog from "./BlockchainLog";
import CommunicationCardHeader from "./CommunicationCard";

interface SwapProps {
  swap: Entity;
}

function Swap({ swap }: SwapProps) {
  const properties = swap.properties as Properties & AdditionalProperties;
  const [alphaLedger, betaLedger] = [
    properties.parameters.alpha_ledger,
    properties.parameters.beta_ledger
  ];
  const [alphaAsset, betaAsset] = [
    properties.parameters.alpha_asset,
    properties.parameters.beta_asset
  ];

  const [alphaExpiry, betaExpiry] = [
    properties.state.communication.alpha_expiry,
    properties.state.communication.beta_expiry
  ];

  const tradeActions = ["Selling", "Buying"];
  const [alphaTradeAction, betaTradeAction] =
    properties.role === Role.Alice ? tradeActions : tradeActions.reverse();

  return (
    <React.Fragment>
      <Page title="Swap">
        <Grid container={true} spacing={2} justify="space-evenly">
          <Grid item={true} xs={6}>
            <AssetCard
              title="Alpha"
              tradeAction={alphaTradeAction}
              ledger={alphaLedger}
              asset={alphaAsset}
              expiry={alphaExpiry}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <AssetCard
              title="Beta"
              tradeAction={betaTradeAction}
              ledger={betaLedger}
              asset={betaAsset}
              expiry={betaExpiry}
            />
          </Grid>
          <Grid item={true} xs={12}>
            <Card>
              <CommunicationCardHeader
                status={properties.state.communication.status}
                role={properties.role}
              />
            </Card>
          </Grid>
          {properties.state.communication.status ===
            CommunicationStatus.Accepted && (
            <React.Fragment>
              <Grid item={true} xs={12}>
                <SubTitle text={"Ledger events and actions"} />
              </Grid>
              <Rfc003BlockchainLog
                alphaState={properties.state.alpha_ledger}
                alphaLedger={properties.parameters.alpha_ledger}
                betaState={properties.state.beta_ledger}
                betaLedger={properties.parameters.beta_ledger}
                role={properties.role}
              />
            </React.Fragment>
          )}
        </Grid>
      </Page>
    </React.Fragment>
  );
}

export default Swap;
