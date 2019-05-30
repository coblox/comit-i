import { Typography } from "@material-ui/core";
import React from "react";
import { useAsync } from "react-async";
import { RouteComponentProps } from "react-router-dom";
import { EmbeddedRepresentationSubEntity } from "../../gen/siren";
import getComitResource from "../api/getComitResource";
import CenteredProgress from "../components/CenteredProgress";
import ErrorSnackbar from "../components/ErrorSnackbar";
import SwapList from "./ListSwaps/ListSwaps";
import Swap from "./SwapPage/Swap";

const getComitResourceFn = async ({ resourcePath }: any) => {
  return getComitResource(resourcePath);
};

function ShowResource({ location }: RouteComponentProps) {
  const resourcePath = location.pathname.replace("/show_resource/", "");

  const { data: entity, isLoading, error, reload } = useAsync(
    getComitResourceFn,
    { resourcePath }
  );

  if (isLoading) {
    return <CenteredProgress title="Fetching..." />;
  } else if (
    !error &&
    entity &&
    entity.class &&
    entity.class.includes("swaps")
  ) {
    return (
      <SwapList
        swaps={entity.entities as EmbeddedRepresentationSubEntity[]}
        reload={reload}
      />
    );
  } else if (
    !error &&
    entity &&
    entity.class &&
    entity.class.includes("swap")
  ) {
    return <Swap swap={entity} />;
  } else {
    const title = error ? "404 Resource Not Found" : "400 Bad JSON";
    return (
      <React.Fragment>
        <Typography variant="h3">{title}</Typography>
        {error && (
          <ErrorSnackbar
            message="Failed to fetch resource. Is your COMIT node running?"
            open={true}
          />
        )}
      </React.Fragment>
    );
  }
}

export default ShowResource;
