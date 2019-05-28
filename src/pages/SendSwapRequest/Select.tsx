import { Grid } from "@material-ui/core";
import pascalCase from "pascal-case";
import React from "react";
import TextField from "../../components/TextField";
import { Parameter, ParameterKind } from "../../ledgerSpec";

export interface Selection {
  name: string;
  [parameter: string]: any;
}

export interface Option {
  key: string;
  label: string;
}

interface SelectProps {
  selection: Selection;
  options: Option[];
  disabledOptions?: string[];
  label: string;
  parameters: Parameter[];
  onSelectionChange: (selection: string, callback?: () => void) => void;
  onParameterChange: (name: string, value: string) => void;
  dataCy?: string;
  disabled?: boolean;
}

function Select({
  selection,
  options,
  disabledOptions = [],
  parameters,
  label,
  onSelectionChange,
  onParameterChange,
  dataCy,
  disabled
}: SelectProps) {
  return (
    <Grid item={true} xs={12} container={true} spacing={0}>
      <Grid item={true} xs={12} md={6}>
        <TextField
          label={label}
          required={true}
          value={selection.name}
          onChange={event => onSelectionChange(event.target.value)}
          select={true}
          SelectProps={{
            native: true
          }}
          data-cy={dataCy}
          disabled={disabled}
        >
          <option key={""} />
          {options
            .filter(item => item.key !== "")
            .map(option => (
              <option
                key={option.key}
                disabled={disabledOptions.indexOf(option.key) !== -1}
                value={option.key}
              >
                {option.label}
              </option>
            ))}
        </TextField>
      </Grid>
      {selection.name &&
        parameters.map(param => {
          switch (param.type) {
            case ParameterKind.Network: {
              return (
                <Grid key={param.name} item={true} xs={12} md={6}>
                  <TextField
                    label={param.label}
                    required={true}
                    value={selection[param.name] || ""}
                    onChange={event =>
                      onParameterChange(param.name, event.target.value)
                    }
                    select={true}
                    SelectProps={{
                      native: true
                    }}
                    data-cy="network-select"
                    disabled={disabled}
                  >
                    <option key={""} />
                    {param.options &&
                      (param.options as string[]).map(value => (
                        <option value={value} key={value}>
                          {pascalCase(value)}
                        </option>
                      ))}
                  </TextField>
                </Grid>
              );
            }
            case ParameterKind.Quantity: {
              return (
                <Grid key={param.name} item={true} xs={12} md={6}>
                  <TextField
                    label={param.label}
                    required={true}
                    type="number"
                    value={selection[param.name] || ""}
                    onChange={event => {
                      onParameterChange(param.name, event.target.value);
                    }}
                    data-cy="quantity-input"
                    disabled={disabled}
                  />
                </Grid>
              );
            }
            default: {
              return (
                <Grid key={param.name} item={true} xs={12} md={12}>
                  <TextField
                    label={param.label}
                    required={true}
                    value={selection[param.name] || ""}
                    onChange={event => {
                      onParameterChange(param.name, event.target.value);
                    }}
                    data-cy="address-input"
                    disabled={disabled}
                  />
                </Grid>
              );
            }
          }
        })}
    </Grid>
  );
}

export default Select;
