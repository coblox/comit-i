import { CircularProgress, Typography } from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { WithStyles } from "@material-ui/styles";
import React from "react";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center",
      marginTop: theme.spacing.unit * 2
    },
    progress: {
      animationDuration: `${theme.transitions.duration.standard * 2}ms`
    }
  });

interface CenteredProgressProps extends WithStyles<typeof styles> {}

function CenteredProgress({ classes }: CenteredProgressProps) {
  return (
    <div className={classes.root}>
      <CircularProgress className={classes.progress} disableShrink={true} />
      <div>
        <Typography variant="caption">Fetching swaps...</Typography>
      </div>
    </div>
  );
}

export default withStyles(styles)(CenteredProgress);
