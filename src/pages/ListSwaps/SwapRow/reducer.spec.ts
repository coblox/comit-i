import { Action } from "../../../../gen/siren";
import {
  actionButtonClicked,
  closeLedgerActionDialog,
  sirenParameterDialogSubmitted
} from "./events";
import { ActionExecutionStatus, initialState, reducer } from "./reducer";

describe("SwapRowReducer", () => {
  it("should immediately trigger action if there are no fields", () => {
    const actionWithoutFields: Action = {
      fields: [],
      name: "redeem",
      method: "GET",
      href: "/foo/bar"
    };

    const { state, sideEffect } = reducer(
      initialState,
      actionButtonClicked(actionWithoutFields)
    );

    expect(state).toStrictEqual({
      actionExecutionStatus: ActionExecutionStatus.InProgress
    });
    expect(sideEffect).toStrictEqual({
      type: "executeAction",
      payload: {
        action: actionWithoutFields,
        data: {}
      }
    });
  });

  it("should trigger action if parameters dialog is submitted", () => {
    const actionWithField: Action = {
      fields: [
        {
          name: "address",
          type: "text",
          title: "Redeem Identity"
        }
      ],
      name: "redeem",
      method: "GET",
      href: "/foo/bar"
    };

    const { state, sideEffect } = reducer(
      {
        state: {
          activeSirenParameterDialog: actionWithField
        }
      },
      sirenParameterDialogSubmitted(actionWithField, {
        address: "submitted_address"
      })
    );

    expect(state).toStrictEqual({
      actionExecutionStatus: ActionExecutionStatus.InProgress
    });
    expect(sideEffect).toStrictEqual({
      type: "executeAction",
      payload: {
        action: actionWithField,
        data: {
          address: "submitted_address"
        }
      }
    });
  });

  it("should open parameters dialog if action has fields", () => {
    const actionWithField: Action = {
      fields: [
        {
          name: "address",
          type: "text",
          title: "Redeem Identity"
        }
      ],
      name: "accept",
      method: "POST",
      href: "/foo/bar"
    };

    const { state, sideEffect } = reducer(
      initialState,
      actionButtonClicked(actionWithField)
    );

    expect(state).toStrictEqual({
      activeSirenParameterDialog: actionWithField
    });
    expect(sideEffect).toBeUndefined();
  });

  it("should reload after ledger action dialog is closed", () => {
    const { state, sideEffect } = reducer(
      initialState,
      closeLedgerActionDialog()
    );

    expect(state).toStrictEqual({});
    expect(sideEffect).toStrictEqual({
      type: "reloadData"
    });
  });
});
