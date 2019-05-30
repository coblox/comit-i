import { Typography } from "@material-ui/core";
import React from "react";
import { Ledger } from "../../api/swapTypes";

export enum ResourceType {
  Transaction,
  Address
}

interface ExplorerLinkProps {
  ledger: Ledger;
  hash: string;
  resourceType: ResourceType;
}

function ExplorerLink({ ledger, hash, resourceType }: ExplorerLinkProps) {
  if (
    ledger.name === "bitcoin" &&
    (ledger.network === "mainnet" || ledger.network === "testnet")
  ) {
    const url =
      ledger.network === "mainnet"
        ? "https://live.blockcypher.com/btc/tx/"
        : "https://live.blockcypher.com/btc-testnet/tx/";

    return (
      <Typography noWrap={true}>
        <a target="_blank" rel="noopener noreferrer" href={url + hash}>
          {hash}
        </a>
      </Typography>
    );
  } else if (
    ledger.name === "ethereum" &&
    (ledger.network === "mainnet" || ledger.network === "ropsten") &&
    resourceType
  ) {
    let url =
      ledger.network === "mainnet"
        ? "https://etherscan.io/"
        : "https://ropsten.etherscan.io/";

    url =
      resourceType === ResourceType.Address ? url + "address/" : url + "tx/";

    return (
      <Typography noWrap={true}>
        <a target="_blank" href={url + hash}>
          {hash}
        </a>
      </Typography>
    );
  } else {
    return <Typography noWrap={true}>{hash}</Typography>;
  }
}

export default ExplorerLink;
