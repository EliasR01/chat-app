import { makeStyles } from "@material-ui/core";

export const useCardStyles = makeStyles({
  root: {
    width: "100%",
    height: "auto",
    display: "flex",
    flexFlow: "column",
    justifyContent: "space-around",
    background: "none",
    boxShadow: "none",
  },
});

export const useBoxStyles = makeStyles({
  root: {
    width: "40%",
    display: "flex",
    flexFlow: "row",
    justifyContent: "space-around",
  },
});

export const useDialogStyles = makeStyles({
  paper: {
    width: "50%",
    height: "50%",
  },
});

export const useInputStyles = makeStyles({
  root: {
    maxWidth: "250px",
    marginBottom: "8%",
  },
});
