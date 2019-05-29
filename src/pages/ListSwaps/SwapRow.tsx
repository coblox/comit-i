import { Button, Dialog, TableCell, TableRow } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useReducer } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { EmbeddedRepresentationSubEntity } from "../../../gen/siren";
import { Asset, Properties, toMainUnit } from "../../api/swapTypes";
import SirenActionDialogBody from "./SirenActionDialogBody";
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

interface SwapRowProps extends RouteComponentProps {
  swap: EmbeddedRepresentationSubEntity;
}

// tslint:disable-next-line:interface-over-type-literal
type ReducerAction = {
  type: "openDialog" | "closeDialog";
  payload: {
    dialogKey: string;
  };
};

interface DialogState {
  [key: string]: boolean;
}

function reducer(state: DialogState, action: ReducerAction) {
  switch (action.type) {
    case "openDialog": {
      // TODO: close all dialogs if a dialog is opened to be safe
      return {
        ...state,
        [action.payload.dialogKey]: true
      };
    }
    case "closeDialog": {
      return {
        ...state,
        [action.payload.dialogKey]: false
      };
    }
  }

  return {};
}

function openDialog(dialogKey: string): ReducerAction {
  return {
    type: "openDialog",
    payload: {
      dialogKey
    }
  };
}

function closeDialog(dialogKey: string): ReducerAction {
  return {
    type: "closeDialog",
    payload: {
      dialogKey
    }
  };
}

function SwapRow({ swap, history }: SwapRowProps) {
  const [dialogState, dispatch] = useReducer(reducer, {});
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
              target={"_blank"}
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
          {actions.map(action => (
            <React.Fragment key={action.name}>
              <Button
                variant={"contained"}
                onClick={() => {
                  if (action.fields && action.fields.length > 0) {
                    dispatch(openDialog(action.name));
                  }
                }}
              >
                {action.title}
              </Button>
              <Dialog open={dialogState[action.name]}>
                <SirenActionDialogBody
                  action={action}
                  onClose={() => dispatch(closeDialog(action.name))}
                  onRequest={request => {
                    // TODO: Actually send the request...
                    // tslint:disable-next-line:no-console
                    console.log(request);
                    dispatch(closeDialog(action.name));
                  }}
                />
              </Dialog>
            </React.Fragment>
          ))}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default withRouter(SwapRow);
