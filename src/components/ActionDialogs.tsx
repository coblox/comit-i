import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@material-ui/core";
import React, { useReducer, useState } from "react";
import URI from "urijs";
import { Link } from "../../gen/siren";
import apiEndpoint from "../api/apiEndpoint";
import { Ledger, Role } from "../api/swapTypes";
import CommunicationActionDialog from "../pages/ListSwaps/CommunicationActionDialog";
import LedgerActionDialog from "../pages/ListSwaps/LedgerActionDialog";

enum DialogState {
  Closed,
  CommunicationDialogOpen,
  LedgerParamsDialogOpen,
  LedgerDialogOpen
}

interface LedgerActionSpec {
  key: string;
  label: string;
}

interface LedgerParamsField {
  name: string;
  value: string;
}

function ledgerParamsReducer(currentState: object, field: LedgerParamsField) {
  return { ...currentState, [field.name]: field.value };
}

function actionLedger(
  action: string,
  role: Role,
  alphaLedger: Ledger,
  betaLedger: Ledger
) {
  switch (action) {
    case "redeem":
      return role === "Alice" ? betaLedger : alphaLedger;
    case "refund":
    case "fund":
      return role === "Alice" ? alphaLedger : betaLedger;
  }
}

function actionQueryParams(
  actionName: string,
  role: Role,
  alphaLedger: Ledger,
  betaLedger: Ledger
): LedgerActionSpec[] {
  const ledger = actionLedger(actionName, role, alphaLedger, betaLedger);

  if (!ledger) {
    return [];
  }

  if (
    ledger.name === "bitcoin" &&
    (actionName === "redeem" || actionName === "refund")
  ) {
    return [
      {
        key: "address",
        label: "Bitcoin address"
      },
      { key: "fee_per_byte", label: "Fee per byte" }
    ];
  } else {
    return [];
  }
}

function actionDialogs(
  actions: Link[],
  role: Role,
  alphaLedger: Ledger,
  betaLedger: Ledger
) {
  const [dialogState, setDialogState] = useState(DialogState.Closed);
  const [action, setAction] = useState({
    name: "",
    url: URI("")
  });
  const [ledgerActionParamSpec, setLedgerActionParamSpec] = useState<
    LedgerActionSpec[]
  >([]);
  const initialLedgerActionParams = {} as { [key: string]: string };
  const [ledgerActionParams, dispatchLedgerActionParams] = useReducer(
    ledgerParamsReducer,
    initialLedgerActionParams
  );

  const alphaIsTransitive = alphaLedger.name === "bitcoin";
  const betaIsTransitive = betaLedger.name === "bitcoin";

  const acceptFields = [];
  if (!alphaIsTransitive) {
    acceptFields.push({
      key: "alpha_ledger_redeem_identity",
      label: "Alpha Redeem Identity",
      ledger: alphaLedger.name
    });
  }
  if (!betaIsTransitive) {
    acceptFields.push({
      key: "beta_ledger_refund_identity",
      label: "Beta Refund Identity",
      ledger: betaLedger.name
    });
  }

  const handleClickAction = (name: string, url: uri.URI) => {
    setAction({ name, url });

    switch (name) {
      case "accept":
      case "decline":
        setDialogState(DialogState.CommunicationDialogOpen);
        break;
      case "fund":
      case "deploy":
      case "redeem":
      case "refund":
        const params = actionQueryParams(name, role, alphaLedger, betaLedger);

        if (params.length > 0) {
          setLedgerActionParamSpec(params);
          setDialogState(DialogState.LedgerParamsDialogOpen);
        } else {
          setDialogState(DialogState.LedgerDialogOpen);
        }
        break;
    }
  };

  const actionButtons = actions
    .filter(
      action =>
        !(action.rel[0] === "self" || action.rel[0] === "human-protocol-spec")
    )
    .map(action => {
      const actionName = action.rel[0];

      return {
        action: actionName,
        button: (
          <Button
            variant="outlined"
            color="primary"
            key={actionName}
            onClick={event => {
              event.stopPropagation();
              handleClickAction(actionName, apiEndpoint().path(action.href));
            }}
          >
            {actionName}
          </Button>
        )
      };
    });

  const dialogs = (
    <React.Fragment>
      {dialogState === DialogState.CommunicationDialogOpen && (
        <CommunicationActionDialog
          action={action}
          acceptFields={acceptFields}
          onClose={() => setDialogState(DialogState.Closed)}
        />
      )}
      {dialogState === DialogState.LedgerParamsDialogOpen && (
        <Dialog open={true}>
          <DialogTitle>Action parameters</DialogTitle>
          <DialogContent>
            {ledgerActionParamSpec.map(spec => (
              <TextField
                key={spec.key}
                label={spec.label}
                required={true}
                value={ledgerActionParams[spec.key] || ""}
                onChange={event =>
                  dispatchLedgerActionParams({
                    name: spec.key,
                    value: event.target.value
                  })
                }
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                const url = action.url.query(ledgerActionParams);

                setAction({ ...action, url });
                setDialogState(DialogState.LedgerDialogOpen);
              }}
              color="primary"
            >
              {"Submit"}
            </Button>
            <Button
              onClick={() => setDialogState(DialogState.Closed)}
              color="secondary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {dialogState === DialogState.LedgerDialogOpen && (
        <LedgerActionDialog
          path={action.url}
          onClose={() => setDialogState(DialogState.Closed)}
        />
      )}
    </React.Fragment>
  );

  return {
    buttons: actionButtons,
    dialogs
  };
}

export default actionDialogs;
