import { TableCell, TableRow, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: theme.spacing(20)
  }
}));

function EmptySwapListTableRow() {
  const classes = useStyles();

  return (
    <TableRow data-cy="empty-swap-list-placeholder">
      <TableCell
        classes={{
          root: classes.root
        }}
        align={"center"}
        colSpan={100} // Just needs to be more than our actual number of columns to span all of them
      >
        <Typography variant="h3">The list of swaps is empty :(</Typography>
      </TableCell>
    </TableRow>
  );
}

export default EmptySwapListTableRow;
