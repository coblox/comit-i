import { AxiosResponse } from "axios";
import { Action } from "../../../../gen/siren";

export type ReducerEvent =
  | {
      type: "actionButtonClicked";
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
      type: "sirenParameterDialogSubmitted";
      payload: {
        action: Action;
        data: any;
      };
    }
  | {
      type: "actionSuccessful";
      payload: {
        response: AxiosResponse;
      };
    }
  | {
      type: "actionFailed";
      payload: {
        error: any;
      };
    };

export function sirenParameterDialogSubmitted(
  action: Action,
  data: any
): ReducerEvent {
  return {
    type: "sirenParameterDialogSubmitted",
    payload: {
      action,
      data
    }
  };
}

export function actionButtonClicked(action: Action): ReducerEvent {
  return {
    type: "actionButtonClicked",
    payload: {
      action
    }
  };
}

export function actionSuccessful(response: AxiosResponse): ReducerEvent {
  return {
    type: "actionSuccessful",
    payload: {
      response
    }
  };
}

export function actionFailed(error: any): ReducerEvent {
  return {
    type: "actionFailed",
    payload: {
      error
    }
  };
}

export function closeSirenParametersDialog(): ReducerEvent {
  return {
    type: "closeSirenParametersDialog"
  };
}

export function closeLedgerActionDialog(): ReducerEvent {
  return {
    type: "closeLedgerActionDialog"
  };
}
