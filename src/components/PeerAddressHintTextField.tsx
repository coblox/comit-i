import Paper from "@material-ui/core/Paper";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from "@material-ui/core/styles";
import {
  BaseTextFieldProps,
  TextFieldProps
} from "@material-ui/core/TextField";
import React, { CSSProperties, HTMLAttributes, ReactElement } from "react";
import Select from "react-select";
import {
  ValueContainer as RSValueContainer,
  ValueContainerProps
} from "react-select/lib/components/containers";
import { ControlProps } from "react-select/lib/components/Control";
import {
  MenuList,
  MenuListComponentProps,
  MenuProps
} from "react-select/lib/components/Menu";
import { ValueType } from "react-select/lib/types";
import TextField from "./TextField";

interface PeerAddressHintTextFieldProps {
  addressHint: string;
  onAddressHintChange?: (newAddressHint: string) => void;
  disabled?: boolean;
  suggestions?: string[];
}

interface OptionType {
  label: string;
  value: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    input: {
      display: "flex",
      padding: 0,
      height: "auto"
    },
    valueContainer: {
      // The `emotion` styles of react-select are injected _after_ our styling, hence we need to workaround with !important.
      // If we can find out, how to change the injection position of `emotion`'s <style> tags, we can fix this.
      padding: "0 !important"
    },
    paper: {
      position: "absolute",
      zIndex: 1,
      marginTop: theme.spacing(1),
      left: 0,
      right: 0
    },
    divider: {
      height: theme.spacing(2)
    }
  })
);

interface InnerTextFieldProps {
  addressHint: string;
  onAddressHintChange: (newAddressHint: string) => void;
  disabled: boolean;
}

function InnerTextField({
  addressHint,
  onAddressHintChange,
  disabled,
  ...baseTextFieldProps
}: InnerTextFieldProps & TextFieldProps) {
  return (
    <TextField
      value={addressHint}
      label={"Peer Address Hint"}
      helperText={
        "Multiaddress format, to be dialed to help with resolution of the peer ID"
      }
      onChange={event => onAddressHintChange(event.target.value)}
      required={false}
      disabled={disabled}
      {...baseTextFieldProps}
    />
  );
}

type InputComponentProps = Pick<BaseTextFieldProps, "inputRef"> &
  HTMLAttributes<HTMLDivElement>;

function inputComponent({ inputRef, ...props }: InputComponentProps) {
  return <div ref={inputRef} {...props} />;
}

function Control(props: ControlProps<OptionType>) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, InnerTextFieldProps }
  } = props;

  const { "data-cy": dataCy, ...other } = InnerTextFieldProps;

  return (
    <InnerTextField
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps,
          "data-cy": dataCy
        }
      }}
      {...other}
    />
  );
}

function Menu(props: MenuProps<OptionType>) {
  return (
    <Paper
      square={true}
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

/// Why are you making my life so hard, react-select?
function RenderNothingGivenEmptyOptionsMenuList({
  children,
  ...props
}: MenuListComponentProps<OptionType>) {
  const childrenArray = React.Children.toArray(children);

  if (childrenArray.length === 1) {
    const reactElement = childrenArray[0] as ReactElement;
    const props = reactElement.props;

    if (props) {
      if (props.children === "No options") {
        return <div />;
      }
    }
  }

  return <MenuList {...props}>{children}</MenuList>;
}

function ValueContainer({
  children,
  ...props
}: ValueContainerProps<OptionType>) {
  const classes = useStyles();

  return (
    <RSValueContainer className={classes.valueContainer} {...props}>
      {children}
    </RSValueContainer>
  );
}

export default function PeerAddressHintTextField({
  addressHint,
  onAddressHintChange = () => undefined,
  disabled = false,
  suggestions = []
}: PeerAddressHintTextFieldProps) {
  const classes = useStyles();
  const theme = useTheme();

  const selectStyles = {
    input: (base: CSSProperties) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit"
      }
    })
  };

  const innerTextFieldProps = {
    addressHint,
    onAddressHintChange,
    disabled,
    "data-cy": "address-hint-input"
  };

  function onChange(event: ValueType<OptionType>) {
    if (event && !(event instanceof Array)) {
      onAddressHintChange(event.value);
    }
  }

  if (suggestions.length === 0) {
    return <InnerTextField {...innerTextFieldProps} />;
  } else {
    const options = suggestions.map(suggestion => ({
      label: suggestion,
      value: suggestion
    }));

    return (
      <div className={classes.root}>
        <Select
          openMenuOnFocus={true}
          classes={classes}
          styles={selectStyles}
          options={options}
          InnerTextFieldProps={innerTextFieldProps}
          components={{
            Control,
            Menu,
            MenuList: RenderNothingGivenEmptyOptionsMenuList,
            ValueContainer
          }}
          value={{
            label: addressHint,
            value: addressHint
          }}
          required={false}
          disabled={disabled}
          onChange={onChange}
        />
      </div>
    );
  }
}
