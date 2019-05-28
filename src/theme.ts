import { createMuiTheme, Theme } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

declare module "@material-ui/core/styles/createMixins" {
  interface Mixins {
    border: (theme: Theme) => CSSProperties;
  }
}

const appTheme = createMuiTheme({
  mixins: {
    border: (theme: Theme) => ({
      borderWidth: "1px",
      borderStyle: "solid",
      borderRadius: theme.shape.borderRadius,
      borderColor:
        theme.palette.type === "light"
          ? "rgba(0, 0, 0, 0.42)"
          : "rgba(255, 255, 255, 0.7)"
    })
  }
});

export default appTheme;
