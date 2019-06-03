import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
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
        <DialogContent>
          {formFields && !formFields.every(elem => elem === null) && (
            <React.Fragment>
              <DialogContentText>Please fill in the form.</DialogContentText>
              {formFields}
            </React.Fragment>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            type={"button"}
            variant={"contained"}
            color={"secondary"}
            onClick={onClose}
            data-cy={"close-button"}
          >
            Cancel
          </Button>
          <Button
            type={"submit"}
            variant={"contained"}
            color={"primary"}
            data-cy={`ok-button`}
          >
            OK
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
  /* Do not display a reason field for declining until we're ready to
     support that */
  if (field.name === "reason") {
    return null;
  }

  if (field.class.includes("ethereum") && field.class.includes("address")) {
    return (
      <EthereumAddressTextField
        data-cy={"action-text-field"}
        required={true}
        key={field.name}
        label={field.title || field.name}
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
      label={field.title || field.name}
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
        >{`Fetch the '${title}' action?`}</DialogTitle>
      );
    default:
      return (
        <DialogTitle
          {...dialogTitleProps}
        >{`Execute the '${title}' action?`}</DialogTitle>
      );
  }
}
