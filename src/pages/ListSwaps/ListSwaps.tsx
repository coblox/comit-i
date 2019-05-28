import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import React from "react";
import { EmbeddedRepresentationSubEntity } from "../../../gen/siren";
import EmptySwapListTableRow from "./EmptySwapListTableRow";
import SwapRow from "./SwapRow";

interface SwapListProps {
  swaps: EmbeddedRepresentationSubEntity[];
}

function SwapList({ swaps }: SwapListProps) {
  const hasSwaps = swaps.length !== 0;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell component="th">Status</TableCell>
          <TableCell component="th">Alpha Ledger</TableCell>
          <TableCell component="th">Alpha Asset</TableCell>
          <TableCell component="th">Beta Ledger</TableCell>
          <TableCell component="th">Beta Asset</TableCell>
          <TableCell component="th">Protocol</TableCell>
          <TableCell component="th">Role</TableCell>
          <TableCell component="th">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {hasSwaps &&
          swaps.map((swap, index) => <SwapRow key={index} swap={swap} />)}
        {!hasSwaps && <EmptySwapListTableRow />}
      </TableBody>
    </Table>
  );
}

export default SwapList;
