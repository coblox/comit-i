import { Paper, Theme, Typography } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import { makeStyles } from "@material-ui/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2)
  }
}));

export default function InfoMessage() {
  const classes = useStyles();

  return (
    <Paper elevation={2} className={classes.root}>
      <InfoIcon color={"primary"} />
      &nbsp;
      <Typography>
        This form has been prefilled with information from the link you just
        clicked.
      </Typography>
    </Paper>
  );
}
