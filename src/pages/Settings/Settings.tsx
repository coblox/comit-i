import { Button, Grid, Theme, Typography } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { DefaultComitNodeApiConfig } from "../../api/config";
import Fieldset from "../../components/Fieldset";
import Page from "../../components/Page";
import SuccessSnackbar from "../../components/SuccessSnackbar";
import TextField from "../../components/TextField";
import { LocalStorageSettingsStore } from "../../settingsStore";

interface StyleProps {
  overrideActive: boolean;
}

const useSettingsStyles = makeStyles<Theme, StyleProps>(theme => ({
  button: {
    margin: theme.spacing(2)
  },
  icon: {
    marginLeft: theme.spacing(1)
  },
  fieldset: ({ overrideActive }) => ({
    opacity: overrideActive ? 0.3 : 1
  })
}));

function Settings() {
  const settingsStore = new LocalStorageSettingsStore(window.localStorage);
  const config = new DefaultComitNodeApiConfig(window, settingsStore);

  const [host, setHost] = useState(config.getEffectiveHost());
  const [port, setPort] = useState(config.getEffectivePort());
  const [displaySaved, setDisplaySaved] = useState(false);

  const classes = useSettingsStyles({
    overrideActive: config.isOverrideActive()
  });

  const handleSaveSettings = (event: any) => {
    event.preventDefault();

    settingsStore.setHost(host);
    settingsStore.setPort(port);

    setDisplaySaved(true);
    setTimeout(() => setDisplaySaved(false), 2500);
  };

  return (
    <React.Fragment>
      <Page title="Set your settings">
        <form onSubmit={handleSaveSettings}>
          {config.isOverrideActive() && (
            <Typography paragraph={true} color={"secondary"}>
              This instance of comit-i is directly served from the comit-node.
              The correct configuration for the API endpoint has been injected.
            </Typography>
          )}

          <Fieldset
            legend="COMIT node"
            disabled={config.isOverrideActive()}
            className={classes.fieldset}
          >
            <Grid container={true} spacing={5}>
              <Grid item={true} xs={12} md={6}>
                <TextField
                  label="Host"
                  value={host}
                  onChange={event => setHost(event.target.value)}
                />
              </Grid>
              <Grid item={true} xs={12} md={6}>
                <TextField
                  label="Port"
                  value={port}
                  onChange={event => setPort(parseInt(event.target.value, 10))}
                />
              </Grid>
            </Grid>
          </Fieldset>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            className={classes.button}
            disabled={config.isOverrideActive()}
          >
            Save
            <SaveIcon className={classes.icon} />
          </Button>
        </form>
      </Page>
      {displaySaved && (
        <SuccessSnackbar
          message={"Your settings have been saved."}
          onClose={() => setDisplaySaved(false)}
          open={true}
        />
      )}
    </React.Fragment>
  );
}

export default Settings;
