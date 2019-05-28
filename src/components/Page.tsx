import { Paper, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { ReactNode } from "react";
import { Title } from "./text";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: "auto",
    [theme.breakpoints.up("md")]: {
      maxWidth: "50vw"
    },
    [theme.breakpoints.up("xl")]: {
      maxWidth: "40vw"
    },
    padding: theme.spacing(3)
  }
}));

interface PageProps {
  title: string;
  children: ReactNode;
}

const Page = ({ title, children }: PageProps) => {
  const classes = useStyles();

  return (
    <Paper elevation={1} className={classes.root}>
      <Title text={title} />
      {children}
    </Paper>
  );
};

export default Page;
