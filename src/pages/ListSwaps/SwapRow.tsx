import { Button, TableCell, TableRow } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { EmbeddedRepresentationSubEntity } from "../../../gen/siren";
import { Asset, Properties, toMainUnit } from "../../api/swapTypes";
import SwapStatusIcon from "./SwapStatusIcon";

interface AssetCellProps {
  asset: Asset;
}

function AssetCell({ asset }: AssetCellProps) {
  return <span>{toMainUnit(asset)}</span>;
}

const useStyles = makeStyles(() => ({
  tableRow: {
    cursor: "pointer"
  }
}));

interface SwapRowProps extends RouteComponentProps {
  swap: EmbeddedRepresentationSubEntity;
}

function SwapRow({ swap, history }: SwapRowProps) {
  const classes = useStyles();

  const links = swap.links || [];
  const properties = swap.properties as Properties;
  const actions = swap.actions || [];
  const swapLink = links.find(link => link.rel.includes("self"));

  if (!swapLink) {
    throw new Error("Swap does not contain self link.");
  }

  const onRowClick = () => {
    history.push("/show_resource" + swapLink.href);
  };

  const protocolSpecLink = links.find(link =>
    link.rel.includes("human-protocol-spec")
  );

  return (
    <React.Fragment key={swapLink.href}>
      <TableRow
        hover={true}
        onClick={onRowClick}
        className={classes.tableRow}
        data-cy="swap-row"
      >
        <TableCell align="center">
          <SwapStatusIcon status={properties.status} />
        </TableCell>
        <TableCell>{properties.parameters.alpha_ledger.name}</TableCell>
        <TableCell>
          <AssetCell asset={properties.parameters.alpha_asset} />
        </TableCell>
        <TableCell>{properties.parameters.beta_ledger.name}</TableCell>
        <TableCell>
          <AssetCell asset={properties.parameters.beta_asset} />
        </TableCell>
        <TableCell>
          {protocolSpecLink ? (
            <a
              onClick={e => e.stopPropagation()}
              target={"_blank"}
              href={protocolSpecLink.href}
            >
              {properties.protocol}
            </a>
          ) : (
            properties.protocol
          )}
        </TableCell>

        <TableCell>{properties.role}</TableCell>
        <TableCell>
          {actions.map(action => (
            <Button key={action.name} variant={"contained"}>
              {action.title}
            </Button>
          ))}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default withRouter(SwapRow);
