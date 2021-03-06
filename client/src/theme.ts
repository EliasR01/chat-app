import { createMuiTheme } from "@material-ui/core";
import { green, blue } from "@material-ui/core/colors";

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[500],
    },
    secondary: {
      main: green[500],
    },
  },
});
