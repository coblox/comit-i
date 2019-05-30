import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { DialogTitleProps } from "@material-ui/core/DialogTitle";
import React, { useReducer } from "react";
import { Action, Field } from "../../../gen/siren";
import EthereumAddressTextField from "../../components/EthereumAddressTextField";
import TextField from "../../components/TextField";

interface Props {
  action: Action;
  onClose: () => void;
  onSubmit: (parameters: any) => void;
}

/*
 * A component to be placed into a Dialog to gather all necessary parameters from the user for executing the given action.
 */
export default function SirenActionParametersDialogBody({
  action,
  onClose,
  onSubmit
}: Props) {
  const method = action.method || "GET";
  const title = action.title || action.name;

  const [actionPayload, dispatch] = useReducer(actionPayloadReducer, {});

  const formFields = action.fields
    ? action.fields.map(field =>
        renderField(field, actionPayload[field.name] || "", newValue =>
          dispatch({
            type: "onFieldChanged",
            payload: {
              fieldName: field.name,
              newValue
            }
          })
        )
      )
    : [];

  return (
    <React.Fragment>
      <Title method={method} title={title} />
      <form
        onSubmit={event => {
          event.preventDefault();
          onSubmit(actionPayload);
        }}
      >
        <DialogContent>{formFields}</DialogContent>
        <DialogActions>
          <PrimaryActionButton
            method={method}
            title={title}
            type={"submit"}
            data-cy={`${action.name}-button`}
          />
          <Button
            type={"button"}
            variant={"contained"}
            color={"secondary"}
            onClick={onClose}
            data-cy={"close-button"}
          >
            Close
          </Button>
        </DialogActions>
      </form>
    </React.Fragment>
  );
}

function renderField(
  field: Field,
  value: any,
  onChange: (newValue: any) => void
) {
  if (field.class.includes("ethereum") && field.class.includes("address")) {
    return (
      <EthereumAddressTextField
        data-cy={"action-text-field"}
        required={true}
        key={field.name}
        label={field.title}
        onAddress={onChange}
        onChange={event => onChange(event.target.value)}
        value={value}
      />
    );
  }

  return (
    <TextField
      data-cy={"action-text-field"}
      required={true}
      key={field.name}
      label={field.title}
      type={field.type}
      value={value}
      onChange={event => onChange(event.target.value)}
    />
  );
}

interface ActionPayload {
  [name: string]: any;
}

// tslint:disable-next-line:interface-over-type-literal
type ReducerAction = {
  type: "onFieldChanged";
  payload: {
    fieldName: string;
    newValue: any;
  };
};

function actionPayloadReducer(state: ActionPayload, action: ReducerAction) {
  switch (action.type) {
    case "onFieldChanged": {
      return {
        ...state,
        [action.payload.fieldName]: action.payload.newValue
      };
    }
  }

  return {};
}

interface DisplayProps {
  method: string;
  title: string;
}

function Title({
  method,
  title,
  ...dialogTitleProps
}: DisplayProps & DialogTitleProps) {
  switch (method) {
    case "GET":
      return (
        <DialogTitle
          {...dialogTitleProps}
        >{`To fetch the '${title}' action, please fill these fields.`}</DialogTitle>
      );
    default:
      return (
        <DialogTitle
          {...dialogTitleProps}
        >{`To execute the '${title}' action, please fill these fields.`}</DialogTitle>
      );
  }
}

function PrimaryActionButton({
  method,
  title,
  ...buttonProps
}: DisplayProps & ButtonProps) {
  switch (method) {
    case "GET":
      return (
        <Button variant={"contained"} color={"primary"} {...buttonProps}>
          {`Fetch ${title}`}
        </Button>
      );
    default:
      return (
        <Button variant={"contained"} color={"primary"} {...buttonProps}>
          {`Execute ${title}`}
        </Button>
      );
  }
}
