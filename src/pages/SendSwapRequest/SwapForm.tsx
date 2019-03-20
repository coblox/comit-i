import { Grid } from "@material-ui/core";
import React, { Dispatch } from "react";
import Select, { Parameter } from "./Select";

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

interface LedgerSpec {
  name: string;
  parameters: Parameter[];
  assets: AssetSpec[];
}

const emptyLedgerSpec = {
  name: "",
  parameters: [],
  assets: []
};

interface AssetSpec {
  name: string;
  parameters: Parameter[];
}

const emptyAssetSpec = {
  name: "",
  parameters: []
};

export interface Swap {
  alpha_ledger: {
    name: string;
    [parameter: string]: string | undefined;
  };
  alpha_asset: {
    name: string;
    [parameter: string]: string | undefined;
  };
  beta_ledger: {
    name: string;
    [parameter: string]: string | undefined;
  };
  beta_asset: {
    name: string;
    [parameter: string]: string | undefined;
  };
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
}

function SwapForm({ swap, ledgers, dispatch }: Props) {
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

  const ledgerOptions = ledgers.map(ledger => ledger.name);
  const alphaAssetOptions = alphaLedgerSpec.assets.map(asset => asset.name);
  const betaAssetOptions = betaLedgerSpec.assets.map(asset => asset.name);

  const onSelectionChange = (of: keyof Swap) => (selection: string) =>
    dispatch({
      type: "change-selection",
      of,
      payload: { newSelection: selection }
    });
  const onParameterChange = (of: keyof Swap) => (name: string, value: string) =>
    dispatch({
      of,
      type: "change-parameter",
      payload: { name, newValue: value }
    });

  return (
    <React.Fragment>
      <Grid item={true} xs={12}>
        <fieldset>
          <legend>Alpha</legend>
          <Select
            label={"Ledger"}
            selection={alphaLedger}
            options={ledgerOptions}
            disabledOptions={[betaLedger.name]}
            onSelectionChange={onSelectionChange("alpha_ledger")}
            onParameterChange={onParameterChange("alpha_ledger")}
            parameters={alphaLedgerSpec.parameters}
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
            />
          )}
        </fieldset>
      </Grid>
      <Grid item={true} xs={12}>
        <fieldset>
          <legend>Beta</legend>
          <Select
            label={"Ledger"}
            selection={betaLedger}
            options={ledgerOptions}
            disabledOptions={[alphaLedger.name]}
            onSelectionChange={onSelectionChange("beta_ledger")}
            onParameterChange={onParameterChange("beta_ledger")}
            parameters={betaLedgerSpec.parameters}
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
            />
          )}
        </fieldset>
      </Grid>
    </React.Fragment>
  );
}

export default SwapForm;
