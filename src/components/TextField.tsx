import { TextField as MUITextField, Theme } from "@material-ui/core";
import { TextFieldProps } from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/styles";
import classNames from "classnames";
import * as React from "react";

const useTextFieldStyles = makeStyles((theme: Theme) => ({
  textField: {
    display: "flex",
    margin: theme.spacing(1)
  }
}));

export default function TextField({
  children,
  className,
  ...props
}: TextFieldProps) {
  const classes = useTextFieldStyles();

  return (
    <MUITextField
      className={classNames(classes.textField, className)}
      {...props}
    >
      {children}
    </MUITextField>
  );
}
