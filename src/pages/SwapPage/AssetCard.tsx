import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  Theme,
  Typography
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/styles";
import classnames from "classnames";
import moment from "moment";
import React, { useState } from "react";
import { Asset, Ledger, toMainUnit } from "../../api/swapTypes";
import ExplorerLink, { ResourceType } from "./ExplorerLink";

const useStyles = makeStyles<Theme>(theme => ({
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  }
}));

interface AssetCardProps {
  title: string;
  ledger: Ledger;
  asset: Asset;
  tradeAction: string;
  expiry: number;
}

function AssetCard({
  title,
  ledger,
  asset,
  tradeAction,
  expiry
}: AssetCardProps) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardHeader
        title={title}
        subheader={
          tradeAction +
          " " +
          toMainUnit(asset) +
          " on " +
          ledger.name +
          " " +
          ledger.network
        }
      />
      <CardActions className={classes.actions}>
        <IconButton
          className={classnames(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label="Show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit={true}>
        <CardContent>
          {asset.token_contract && (
            <React.Fragment>
              <Typography paragraph={true}>Token contract:</Typography>
              <ExplorerLink
                ledger={ledger}
                hash={asset.token_contract}
                resourceType={ResourceType.Address}
              />
            </React.Fragment>
          )}
          <Typography paragraph={true}>
            Smart contract refund branch active at{" "}
            {moment.unix(expiry).format("MMMM Do YYYY, h:mm a")} {ledger.name}{" "}
            {ledger.network} time.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default AssetCard;
