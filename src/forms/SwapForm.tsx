import { Grid } from "@material-ui/core";
import React, { Dispatch } from "react";
import Fieldset from "../components/Fieldset";
import { LedgerSpec } from "../ledgerSpec";
import Select from "../pages/SendSwapRequest/Select";

function findLedgerSpec(ledgers: LedgerSpec[], ledger: string) {
  return (
    ledgers.find(ledgerSpec => ledgerSpec.name === ledger) || emptyLedgerSpec
  );
}

function findAssetSpec(ledgers: LedgerSpec[], ledger: string, asset: string) {
  const ledgerSpec = findLedgerSpec(ledgers, ledger);

  return (
    ledgerSpec.assets.find(assetSpec => assetSpec.name === asset) ||
    emptyAssetSpec
  );
}

const emptyLedgerSpec = {
  name: "",
  label: "",
  parameters: [],
  assets: []
};

const emptyAssetSpec = {
  name: "",
  label: "",
  parameters: []
};

export interface SwapValue {
  name: string;
  [parameter: string]: string | undefined;
}

export interface Swap {
  alpha_ledger: SwapValue;
  alpha_asset: SwapValue;
  beta_ledger: SwapValue;
  beta_asset: SwapValue;
}

export type Action =
  | {
      type: "change-parameter";
      of: keyof Swap;
      payload: { name: string; newValue: string };
    }
  | {
      type: "change-selection";
      of: keyof Swap;
      payload: { newSelection: string };
    };

export function reducer(swap: Swap, action: Action): Swap {
  switch (action.type) {
    case "change-parameter": {
      return {
        ...swap,
        [action.of]: {
          ...swap[action.of],
          [action.payload.name]: action.payload.newValue
        }
      };
    }
    case "change-selection": {
      const newSwap = {
        ...swap,
        [action.of]: {
          name: action.payload.newSelection
        }
      };

      const defaultAsset = { name: "" };
      switch (action.of) {
        case "alpha_ledger": {
          return {
            ...newSwap,
            alpha_asset: defaultAsset
          };
        }
        case "beta_ledger": {
          return {
            ...newSwap,
            beta_asset: defaultAsset
          };
        }
        default:
          return newSwap;
      }
    }
  }
}

export const emptySwap: Swap = {
  alpha_ledger: {
    name: ""
  },
  alpha_asset: {
    name: ""
  },
  beta_ledger: {
    name: ""
  },
  beta_asset: {
    name: ""
  }
};

interface Props {
  swap: Swap;
  ledgers: LedgerSpec[];
  dispatch: Dispatch<Action>;
  onAlphaLedgerChange?: () => void;
  onBetaLedgerChange?: () => void;
  disabled?: boolean;
}

function SwapForm({
  swap,
  ledgers,
  dispatch,
  onAlphaLedgerChange,
  onBetaLedgerChange,
  disabled = false
}: Props) {
  const alphaLedger = swap.alpha_ledger;
  const betaLedger = swap.beta_ledger;
  const alphaAsset = swap.alpha_asset;
  const betaAsset = swap.beta_asset;

  const alphaLedgerSpec = findLedgerSpec(ledgers, alphaLedger.name);
  const alphaAssetSpec = findAssetSpec(
    ledgers,
    alphaLedger.name,
    alphaAsset.name
  );
  const betaLedgerSpec = findLedgerSpec(ledgers, betaLedger.name);
  const betaAssetSpec = findAssetSpec(ledgers, betaLedger.name, betaAsset.name);

  const ledgerOptions = ledgers.map(ledger => ({
    key: ledger.name,
    label: ledger.label
  }));
  const alphaAssetOptions = alphaLedgerSpec.assets.map(asset => ({
    key: asset.name,
    label: asset.label
  }));
  const betaAssetOptions = betaLedgerSpec.assets.map(asset => ({
    key: asset.name,
    label: asset.label
  }));

  const onSelectionChange = (of: keyof Swap, callback?: () => void) => (
    selection: string
  ) => {
    dispatch({
      type: "change-selection",
      of,
      payload: { newSelection: selection }
    });
    if (callback) {
      callback();
    }
  };
  const onParameterChange = (of: keyof Swap) => (name: string, value: string) =>
    dispatch({
      of,
      type: "change-parameter",
      payload: { name, newValue: value }
    });

  return (
    <React.Fragment>
      <Grid item={true} xs={12}>
        <Fieldset legend={"Alpha"} dataCy="alpha-fieldset" disabled={disabled}>
          <Select
            label={"Ledger"}
            selection={alphaLedger}
            options={ledgerOptions}
            disabledOptions={[betaLedger.name]}
            onSelectionChange={
              onAlphaLedgerChange
                ? onSelectionChange("alpha_ledger", () => onAlphaLedgerChange())
                : onSelectionChange("alpha_ledger")
            }
            onParameterChange={onParameterChange("alpha_ledger")}
            parameters={alphaLedgerSpec.parameters}
            dataCy="ledger-select"
            disabled={disabled}
          />
          {alphaLedger.name && (
            <Select
              label={"Asset"}
              selection={alphaAsset}
              options={alphaAssetOptions}
              disabledOptions={[]}
              onSelectionChange={onSelectionChange("alpha_asset")}
              onParameterChange={onParameterChange("alpha_asset")}
              parameters={alphaAssetSpec.parameters}
              dataCy="asset-select"
              disabled={disabled}
            />
          )}
        </Fieldset>
      </Grid>
      <Grid item={true} xs={12}>
        <Fieldset legend={"Beta"} dataCy="beta-fieldset" disabled={disabled}>
          <Select
            label={"Ledger"}
            selection={betaLedger}
            options={ledgerOptions}
            disabledOptions={[alphaLedger.name]}
            onSelectionChange={
              onBetaLedgerChange
                ? onSelectionChange("beta_ledger", () => onBetaLedgerChange())
                : onSelectionChange("beta_ledger")
            }
            onParameterChange={onParameterChange("beta_ledger")}
            parameters={betaLedgerSpec.parameters}
            dataCy="ledger-select"
            disabled={disabled}
          />
          {betaLedger.name && (
            <Select
              label={"Asset"}
              selection={betaAsset}
              options={betaAssetOptions}
              disabledOptions={[]}
              onSelectionChange={onSelectionChange("beta_asset")}
              onParameterChange={onParameterChange("beta_asset")}
              parameters={betaAssetSpec.parameters}
              dataCy="asset-select"
              disabled={disabled}
            />
          )}
        </Fieldset>
      </Grid>
    </React.Fragment>
  );
}

export default SwapForm;
