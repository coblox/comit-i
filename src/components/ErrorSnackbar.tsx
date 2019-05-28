import {
  createStyles,
  IconButton,
  Snackbar,
  SnackbarContent,
  Theme,
  Typography,
  WithStyles,
  withStyles
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ErrorIcon from "@material-ui/icons/Error";
import React from "react";

const styles = (theme: Theme) =>
  createStyles({
    content: {
      backgroundColor: theme.palette.error.dark
    },
    message: {
      display: "flex",
      alignItems: "center"
    },
    icon: {
      marginRight: theme.spacing(1)
    }
  });

interface ErrorSnackbarProps extends WithStyles<typeof styles> {
  open: boolean;
  onClose?: () => void;
  message: string;
}

function ErrorSnackbar({
  open,
  onClose,
  message,
  classes
}: ErrorSnackbarProps) {
  return (
    <Snackbar
      data-cy="error-snackbar"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      open={open}
      onClose={onClose}
      ClickAwayListenerProps={{
        onClickAway: () => undefined
      }}
    >
      <SnackbarContent
        classes={{
          root: classes.content,
          message: classes.message
        }}
        message={
          <React.Fragment>
            <ErrorIcon className={classes.icon} />
            <Typography color={"inherit"}>{message}</Typography>
          </React.Fragment>
        }
        action={
          onClose && [
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          ]
        }
      />
    </Snackbar>
  );
}

export default withStyles(styles)(ErrorSnackbar);
