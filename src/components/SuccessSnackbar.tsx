// TODO: Create generic Snackbar component out of this and ErrorSnackbar
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
import DoneIcon from "@material-ui/icons/Done";
import React from "react";

const styles = (theme: Theme) =>
  createStyles({
    content: {
      backgroundColor: theme.palette.primary.dark
    },
    message: {
      display: "flex",
      alignItems: "center"
    },
    icon: {
      marginRight: theme.spacing(1)
    }
  });

interface SuccessSnackbarProps extends WithStyles<typeof styles> {
  open: boolean;
  onClose: () => void;
  message: string;
}

function SuccessSnackbar({
  open,
  onClose,
  message,
  classes
}: SuccessSnackbarProps) {
  return (
    <Snackbar
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
            <DoneIcon className={classes.icon} />
            <Typography color={"inherit"}>{message}</Typography>
          </React.Fragment>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    </Snackbar>
  );
}

export default withStyles(styles)(SuccessSnackbar);
