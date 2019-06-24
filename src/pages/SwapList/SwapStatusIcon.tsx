import {
  faCheck,
  faExclamationCircle,
  faSync,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Theme, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { Status } from "../../api/swapTypes";

const useStyles = makeStyles<Theme>(theme => ({
  inProgressIcon: {
    color: theme.palette.primary.main
  },
  notSwappedIcon: {
    color: theme.palette.common.black
  },
  internalFailureIcon: {
    color: theme.palette.error.main
  }
}));

interface SwapStatusIconProps {
  status: Status;
}

function SwapStatusIcon({ status }: SwapStatusIconProps) {
  const classes = useStyles();

  switch (status) {
    case Status.InProgress:
      return (
        <Tooltip title="Swap in progress" placement="bottom-start">
          <div>
            <FontAwesomeIcon
              icon={faSync}
              className={classes.inProgressIcon}
              size="lg"
            />
          </div>
        </Tooltip>
      );
    case Status.Swapped:
      return (
        <Tooltip title="Swap completed" placement="bottom-start">
          <div>
            <FontAwesomeIcon icon={faCheck} color="green" size="lg" />
          </div>
        </Tooltip>
      );
    case Status.NotSwapped:
      return (
        <Tooltip title="Swap finished unsuccessfully" placement="bottom-start">
          <div>
            <FontAwesomeIcon
              icon={faTimes}
              className={classes.notSwappedIcon}
              size="lg"
            />
          </div>
        </Tooltip>
      );
    case Status.InternalFailure:
      return (
        <Tooltip title="Internal failure" placement="bottom-start">
          <div>
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className={classes.internalFailureIcon}
              size="lg"
            />
          </div>
        </Tooltip>
      );
  }
}

export default SwapStatusIcon;
