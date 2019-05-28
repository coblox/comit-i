import { Paper, Theme, Typography } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import { makeStyles } from "@material-ui/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2)
  }
}));

export default function ErrorMessage() {
  const classes = useStyles();

  return (
    <Paper elevation={2} className={classes.root}>
      <ErrorIcon color={"error"} />
      &nbsp;
      <Typography>There was an error parsing the link.</Typography>
    </Paper>
  );
}
