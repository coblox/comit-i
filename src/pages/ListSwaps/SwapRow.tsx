import {
  Button,
  CircularProgress,
  TableCell,
  TableRow
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { AxiosResponse } from "axios";
import ContentType from "content-type";
import React, { useReducer, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Action, EmbeddedRepresentationSubEntity } from "../../../gen/siren";
import executeAction from "../../api/executeAction";
import { LedgerAction } from "../../api/getAction";
import { Asset, Properties, toMainUnit } from "../../api/swapTypes";
import Dialog from "../../components/Dialog";
import LedgerActionDialogBody from "./LedgerActionDialogBody";
import SirenActionParametersDialogBody from "./SirenActionParametersDialogBody";
import SwapStatusIcon from "./SwapStatusIcon";

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

enum ActionExecutionState {
  NotYetSent,
  InProgress,
  Done,
  Error
}

interface SwapRowProps extends RouteComponentProps {
  swap: EmbeddedRepresentationSubEntity;
  reload: () => void;
}

function isMediaTypeApplicationJson(response: AxiosResponse) {
  try {
    return ContentType.parse(response).type === "application/json";
  } catch (e) {
    return false;
  }
}

function SwapRow({ swap, history, reload }: SwapRowProps) {
  const [
    { activeSirenParameterDialog, activeLedgerActionDialog },
    dispatch
  ] = useReducer(reducer, initialState);
  const [actionExecutionState, setActionExecutionState] = useState(
    ActionExecutionState.NotYetSent
  );

  const classes = useStyles();

  const links = swap.links || [];
  const properties = swap.properties as Properties;
  const actions = swap.actions || [];
  const swapLink = links.find(link => link.rel.includes("self"));

  if (!swapLink) {
    throw new Error("Swap does not contain self link.");
  }

  const onRowClick = () => {
    history.push("/show_resource" + swapLink.href);
  };

  const protocolSpecLink = links.find(link =>
    link.rel.includes("human-protocol-spec")
  );

  const actionButtons = actions.map(action => (
    <Button
      data-cy={`${action.name}-button`}
      type={"button"}
      key={action.name}
      variant={"contained"}
      onClick={e => {
        e.stopPropagation();
        const fields = action.fields || [];

        if (fields.length > 0) {
          dispatch(openSirenParametersDialog(action));
        } else {
          executeSirenAction(action);
        }
      }}
    >
      {action.title}
    </Button>
  ));

  const sirenActionDialog = activeSirenParameterDialog ? (
    <Dialog open={true}>
      <SirenActionParametersDialogBody
        action={activeSirenParameterDialog}
        onClose={() => dispatch(closeSirenParametersDialog())}
        onSubmit={data => {
          executeSirenAction(activeSirenParameterDialog, data);
          dispatch(closeSirenParametersDialog());
        }}
      />
    </Dialog>
  ) : null;

  const ledgerActionDialog = activeLedgerActionDialog ? (
    <Dialog open={true}>
      <LedgerActionDialogBody
        action={activeLedgerActionDialog}
        onClose={() => {
          dispatch(closeLedgerActionDialog());
          reload();
        }}
      />
    </Dialog>
  ) : null;

  const executeSirenAction = (sirenAction: Action, data = {}) => {
    setActionExecutionState(ActionExecutionState.InProgress);
    executeAction(sirenAction, data)
      .then(response => {
        const data = response.data;

        if (
          data &&
          isMediaTypeApplicationJson(response) &&
          data.type &&
          data.payload
        ) {
          const ledgerAction = data as LedgerAction;
          dispatch(openLedgerActionDialog(ledgerAction));
        } else {
          reload();
        }

        setActionExecutionState(ActionExecutionState.Done);
      })
      .catch(() => setActionExecutionState(ActionExecutionState.Error));
  };

  return (
    <React.Fragment key={swapLink.href}>
      <TableRow
        hover={true}
        onClick={onRowClick}
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
            <a
              onClick={e => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
              href={protocolSpecLink.href}
            >
              {properties.protocol}
            </a>
          ) : (
            properties.protocol
          )}
        </TableCell>

        <TableCell>{properties.role}</TableCell>
        <TableCell>
          {actionExecutionState === ActionExecutionState.InProgress ? (
            <CircularProgress
              size={30}
              data-cy={"action-request-circular-progress"}
            />
          ) : (
            actionButtons
          )}
        </TableCell>
      </TableRow>
      {sirenActionDialog}
      {ledgerActionDialog}
    </React.Fragment>
  );
}

type ReducerAction =
  | {
      type: "openSirenParametersDialog";
      payload: {
        action: Action;
      };
    }
  | {
      type: "closeSirenParametersDialog";
    }
  | {
      type: "closeLedgerActionDialog";
    }
  | {
      type: "openLedgerActionDialog";
      payload: {
        action: LedgerAction;
      };
    };

interface DialogState {
  activeSirenParameterDialog?: Action;
  activeLedgerActionDialog?: LedgerAction;
}

const initialState: DialogState = {};

function reducer(state: DialogState, action: ReducerAction): DialogState {
  switch (action.type) {
    case "openSirenParametersDialog": {
      return {
        activeSirenParameterDialog: action.payload.action
      };
    }
    case "openLedgerActionDialog": {
      return {
        activeLedgerActionDialog: action.payload.action
      };
    }
    case "closeLedgerActionDialog":
    case "closeSirenParametersDialog":
      return {};
  }

  return state;
}

function openSirenParametersDialog(sirenAction: Action): ReducerAction {
  return {
    type: "openSirenParametersDialog",
    payload: {
      action: sirenAction
    }
  };
}

function closeSirenParametersDialog(): ReducerAction {
  return {
    type: "closeSirenParametersDialog"
  };
}

function openLedgerActionDialog(ledgerAction: LedgerAction): ReducerAction {
  return {
    type: "openLedgerActionDialog",
    payload: {
      action: ledgerAction
    }
  };
}

function closeLedgerActionDialog(): ReducerAction {
  return {
    type: "closeLedgerActionDialog"
  };
}

export default withRouter(SwapRow);
