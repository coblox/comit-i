import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import React from "react";
import { LedgerAction } from "../../api/getAction";
import Web3SendTransactionButton from "../../components/Web3SendTransactionButton";
import CopyToClipboardButton from "./CopyToClipboard";

interface LedgerActionDialogBodyProps {
  onClose: () => void;
  action: LedgerAction;
}

function LedgerActionDialogBody({
  onClose,
  action
}: LedgerActionDialogBodyProps) {
  switch (action.type) {
    case "bitcoin-broadcast-signed-transaction": {
      const expiry = action.payload.min_median_block_time;
      const whenReadyMessage = !expiry
        ? "now"
        : "when the latest block's mediantime is past " + expiry;

      return (
        <React.Fragment>
          <DialogTitle>Broadcast Bitcoin transaction</DialogTitle>
          <DialogContent>
            <Typography paragraph={true}>
              Please broadcast the following signed transaction on the{" "}
              <b>{action.payload.network}</b> network {whenReadyMessage}:
            </Typography>
            <Typography
              variant={"body1"}
              style={{
                wordWrap: "break-word"
              }}
            >
              {action.payload.hex}
            </Typography>
          </DialogContent>
          <DialogActions>
            <CopyToClipboardButton
              content={action.payload.hex}
              name="transaction"
            />
            <Button onClick={onClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </React.Fragment>
      );
    }
    case "bitcoin-send-amount-to-address": {
      return (
        <React.Fragment>
          <DialogTitle>Send Bitcoin</DialogTitle>
          <DialogContent>
            <Typography paragraph={true}>
              Please send <b>{action.payload.amount}</b> satoshi to the
              following <b>{action.payload.network}</b> address:
            </Typography>
            {action.payload.to}
          </DialogContent>
          <DialogActions>
            <CopyToClipboardButton
              content={action.payload.amount}
              name="amount"
            />
            <CopyToClipboardButton content={action.payload.to} name="address" />
            <Button onClick={onClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </React.Fragment>
      );
    }
    case "ethereum-deploy-contract": {
      return (
        <React.Fragment>
          <DialogTitle>Deploy Ethereum contract</DialogTitle>
          <DialogContent>
            <Typography paragraph={true}>
              Deploy the following contract to the Ethereum{" "}
              <b>{action.payload.network}</b> network with{" "}
              <b>{action.payload.amount}</b> wei:
            </Typography>
            <Typography
              variant={"body1"}
              style={{
                wordWrap: "break-word"
              }}
            >
              {action.payload.data}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Web3SendTransactionButton
              transactionConfig={{
                data: action.payload.data,
                value: action.payload.amount,
                gas: +action.payload.gas_limit
              }}
              onSuccess={onClose}
            />
            <Button onClick={onClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </React.Fragment>
      );
    }
    case "ethereum-call-contract": {
      const expiry = action.payload.min_block_timestamp;

      return (
        <React.Fragment>
          <DialogTitle>Invoke Ethereum contract</DialogTitle>
          <DialogContent>
            <Typography paragraph={true}>
              Invoke the contract at <b>{action.payload.contract_address}</b> on
              the Ethereum <b>{action.payload.network}</b> network with this
              data:
            </Typography>
            <Typography
              variant={"body1"}
              style={{
                wordWrap: "break-word"
              }}
            >
              {action.payload.data}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Web3SendTransactionButton
              minTimestamp={expiry}
              transactionConfig={{
                to: action.payload.contract_address,
                data: action.payload.data,
                gas: action.payload.gas_limit
              }}
              onSuccess={onClose}
            />
            <Button onClick={onClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </React.Fragment>
      );
    }
  }
}

export default LedgerActionDialogBody;
