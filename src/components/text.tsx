import { Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  margin2: {
    marginBottom: theme.spacing(2)
  },
  margin3: {
    marginBottom: theme.spacing(3)
  }
}));

interface TitleProps {
  text: string;
}

export const Title = ({ text }: TitleProps) => {
  const classes = useStyles();

  return (
    <Typography variant={"h4"} className={classes.margin3}>
      {text}
    </Typography>
  );
};

export const SubTitle = ({ text }: TitleProps) => {
  const classes = useStyles();

  return (
    <Typography variant={"h5"} className={classes.margin2}>
      {text}
    </Typography>
  );
};
