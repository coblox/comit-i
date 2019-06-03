import { AxiosResponse } from "axios";
import ContentType from "content-type";
import { Action } from "../../../../gen/siren";
import { LedgerAction } from "../../../api/getAction";
import { ReducerEvent } from "./events";

interface ReducerState {
  state: State;
  sideEffect?: SideEffect;
}

type SideEffect =
  | {
      type: "executeAction";
      payload: {
        action: Action;
        data: any;
      };
    }
  | {
      type: "reloadData";
    };

interface State {
  actionExecutionStatus?: ActionExecutionStatus;
  activeSirenParameterDialog?: Action;
  activeLedgerActionDialog?: LedgerAction;
}

export enum ActionExecutionStatus {
  InProgress,
  Done,
  Error
}

export function reducer(
  { state }: ReducerState,
  event: ReducerEvent
): ReducerState {
  switch (event.type) {
    case "actionButtonClicked": {
      const action = event.payload.action;

      const fields = action.fields || [];
      if (fields.length > 0) {
        return {
          state: {
            activeSirenParameterDialog: action
          }
        };
      } else {
        return {
          state: {
            actionExecutionStatus: ActionExecutionStatus.InProgress
          },
          sideEffect: {
            type: "executeAction",
            payload: {
              action,
              data: {}
            }
          }
        };
      }
    }

    case "actionSuccessful": {
      const response = event.payload.response;
      const body = response.data;

      if (
        body &&
        isMediaTypeApplicationJson(response) &&
        body.type &&
        body.payload
      ) {
        const ledgerAction = body as LedgerAction;

        return {
          state: {
            actionExecutionStatus: ActionExecutionStatus.Done,
            activeLedgerActionDialog: ledgerAction
          }
        };
      } else {
        return {
          state: {
            actionExecutionStatus: ActionExecutionStatus.Done
          },
          sideEffect: {
            type: "reloadData"
          }
        };
      }
    }

    case "actionFailed": {
      return {
        state: {
          actionExecutionStatus: ActionExecutionStatus.Error
        }
      };
    }

    case "sirenParameterDialogSubmitted": {
      return {
        state: {
          actionExecutionStatus: ActionExecutionStatus.InProgress
        },
        sideEffect: {
          type: "executeAction",
          payload: {
            action: event.payload.action,
            data: event.payload.data
          }
        }
      };
    }

    case "closeLedgerActionDialog": {
      return {
        state: {},
        sideEffect: {
          type: "reloadData"
        }
      };
    }
    case "closeSirenParametersDialog":
      return initialState;
  }

  return { state };
}

function isMediaTypeApplicationJson(response: AxiosResponse) {
  try {
    return ContentType.parse(response).type === "application/json";
  } catch (e) {
    return false;
  }
}

export const initialState: ReducerState = {
  state: {}
};
