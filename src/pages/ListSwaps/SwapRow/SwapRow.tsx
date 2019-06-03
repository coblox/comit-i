import {
  Button,
  CircularProgress,
  TableCell,
  TableRow
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useReducer } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { EmbeddedRepresentationSubEntity } from "../../../../gen/siren";
import executeAction from "../../../api/executeAction";
import { Asset, Properties, toMainUnit } from "../../../api/swapTypes";
import Dialog from "../../../components/Dialog";
import ExternalLink from "../../../components/ExternalLink";
import LedgerActionDialogBody from "../LedgerActionDialogBody";
import SirenActionParametersDialogBody from "../SirenActionParametersDialogBody";
import SwapStatusIcon from "../SwapStatusIcon";
import {
  actionButtonClicked,
  actionFailed,
  actionSuccessful,
  closeLedgerActionDialog,
  closeSirenParametersDialog,
  sirenParameterDialogSubmitted
} from "./events";
import { ActionExecutionStatus, initialState, reducer } from "./reducer";

interface AssetCellProps {
  asset: Asset;
}

function AssetCell({ asset }: AssetCellProps) {
  return <span>{toMainUnit(asset)}</span>;
}

const useStyles = makeStyles(() => ({
  tableRow: {
    cursor: "pointer"
  }
}));

interface SwapRowProps extends RouteComponentProps {
  swap: EmbeddedRepresentationSubEntity;
  reload: () => void;
}

function SwapRow({ swap, history, reload }: SwapRowProps) {
  const [
    {
      state: {
        actionExecutionStatus,
        activeLedgerActionDialog,
        activeSirenParameterDialog
      },
      sideEffect
    },
    dispatch
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!sideEffect) {
      return;
    }

    switch (sideEffect.type) {
      case "reloadData": {
        setTimeout(() => reload(), 1000);
        return;
      }
      case "executeAction": {
        executeAction(sideEffect.payload.action, sideEffect.payload.data).then(
          response => dispatch(actionSuccessful(response)),
          error => dispatch(actionFailed(error))
        );
        return;
      }
    }
  }, [sideEffect, reload]);

  const classes = useStyles();

  const links = swap.links || [];
  const properties = swap.properties as Properties;
  const actions = swap.actions || [];
  const swapLink = links.find(link => link.rel.includes("self"));

  if (!swapLink) {
    throw new Error("Swap does not contain self link.");
  }

  const protocolSpecLink = links.find(link =>
    link.rel.includes("human-protocol-spec")
  );

  return (
    <React.Fragment key={swapLink.href}>
      <TableRow
        hover={true}
        onClick={() => {
          history.push("/show_resource" + swapLink.href);
        }}
        className={classes.tableRow}
        data-cy="swap-row"
      >
        <TableCell align="center">
          <SwapStatusIcon status={properties.status} />
        </TableCell>
        <TableCell>{properties.parameters.alpha_ledger.name}</TableCell>
        <TableCell>
          <AssetCell asset={properties.parameters.alpha_asset} />
        </TableCell>
        <TableCell>{properties.parameters.beta_ledger.name}</TableCell>
        <TableCell>
          <AssetCell asset={properties.parameters.beta_asset} />
        </TableCell>
        <TableCell>
          {protocolSpecLink ? (
            <ExternalLink
              href={protocolSpecLink.href}
              text={properties.protocol}
            />
          ) : (
            properties.protocol
          )}
        </TableCell>

        <TableCell>{properties.role}</TableCell>
        <TableCell>
          {actionExecutionStatus === ActionExecutionStatus.InProgress ? (
            <CircularProgress
              size={30}
              data-cy={"action-request-circular-progress"}
            />
          ) : (
            actions.map(action => (
              <Button
                data-cy={`${action.name}-button`}
                type={"button"}
                key={action.name}
                variant={"contained"}
                onClick={e => {
                  // otherwise we trigger the onClick handler of the whole row and go to the swap detail page
                  e.stopPropagation();

                  dispatch(actionButtonClicked(action));
                }}
              >
                {action.title || action.name}
              </Button>
            ))
          )}
        </TableCell>
      </TableRow>
      {activeSirenParameterDialog && (
        <Dialog open={true}>
          <SirenActionParametersDialogBody
            action={activeSirenParameterDialog}
            onClose={() => dispatch(closeSirenParametersDialog())}
            onSubmit={data =>
              dispatch(
                sirenParameterDialogSubmitted(activeSirenParameterDialog, data)
              )
            }
          />
        </Dialog>
      )}
      {activeLedgerActionDialog && (
        <Dialog open={true}>
          <LedgerActionDialogBody
            action={activeLedgerActionDialog}
            onClose={() => dispatch(closeLedgerActionDialog())}
          />
        </Dialog>
      )}
    </React.Fragment>
  );
}

export default withRouter(SwapRow);
