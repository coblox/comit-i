import { AxiosResponse } from "axios";
import { Action } from "../../../../gen/siren";
import {
  actionButtonClicked,
  actionSuccessful,
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

  it("should open ledger action dialog if response contains ledger action", () => {
    const response = {
      data: {
        type: "ethereum-call-contract",
        payload: {} as any
      },
      headers: {
        "content-type": "application/json; charset=utf-8"
      },
      status: 200,
      statusText: "OK"
    } as AxiosResponse;

    const { state, sideEffect } = reducer(
      initialState,
      actionSuccessful(response)
    );

    expect(state).toStrictEqual({
      actionExecutionStatus: ActionExecutionStatus.Done,
      activeLedgerActionDialog: {
        type: "ethereum-call-contract",
        payload: {}
      }
    });
    expect(sideEffect).toBeUndefined();
  });

  it("should not open any dialog if response is not a ledger action", () => {
    const response = {
      data: {},
      headers: {},
      status: 200,
      statusText: "OK"
    } as AxiosResponse;

    const { state, sideEffect } = reducer(
      initialState,
      actionSuccessful(response)
    );

    expect(state).toStrictEqual({
      actionExecutionStatus: ActionExecutionStatus.Done
    });
    expect(sideEffect).toStrictEqual({
      type: "reloadData"
    });
  });
});
