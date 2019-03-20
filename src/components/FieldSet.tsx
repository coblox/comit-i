import { createStyles } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/styles";
import React, { ReactNode } from "react";

// Have to use any to access custom mixins
const styles = (theme: any) =>
  createStyles({
    fieldset: theme.mixins.border(theme)
  });

interface FieldSet extends WithStyles<typeof styles> {
  label: string;
  children: ReactNode;
}

function LedgerDetail({ label, children, classes }: FieldSet) {
  return (
    <fieldset className={classes.fieldset}>
      <legend>{label}</legend>
      {children}
    </fieldset>
  );
}

export default withStyles(styles)(LedgerDetail);
