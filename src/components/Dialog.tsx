import { Dialog as MuiDialog } from "@material-ui/core";
import { DialogProps } from "@material-ui/core/Dialog";
import React from "react";

export default function Dialog({ children, ...other }: DialogProps) {
  return (
    <MuiDialog data-cy={"dialog"} {...other}>
      {children}
    </MuiDialog>
  );
}
