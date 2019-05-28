import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import classNames from "classnames";
import React, { ReactNode } from "react";

const useStyles = makeStyles((theme: Theme) => ({
  root: theme.mixins.border(theme)
}));

interface FieldsetProps {
  legend: string;
  disabled?: boolean;
  children: ReactNode;
  dataCy?: string;
  className?: string;
}

const Fieldset = ({
  legend,
  children,
  dataCy,
  disabled = false,
  className
}: FieldsetProps) => {
  const classes = useStyles();

  return (
    <fieldset
      className={classNames(classes.root, className)}
      data-cy={dataCy}
      disabled={disabled}
    >
      <legend>{legend}</legend>
      {children}
    </fieldset>
  );
};

export default Fieldset;
