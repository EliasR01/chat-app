import { makeStyles, Theme, createStyles } from "@material-ui/core";
import { PaperProps } from "./types";

export const useBoxStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "rgb(250,250,250)",
      display: "flex",
      flexFlow: "column",
      margin: "auto",
      borderRadius: "5px",
      padding: "25px",
      height: "85%",
      maxHeight: "570px",
      overflowY: "auto",
      [theme.breakpoints.down("xs")]: {
        width: "100px",
      },
      [theme.breakpoints.between("sm", "md")]: {
        width: "300px",
      },
      [theme.breakpoints.between("md", "lg")]: {
        width: "700px",
      },
      [theme.breakpoints.between("lg", "xl")]: {
        width: "1000px",
      },
      [theme.breakpoints.up("xl")]: {
        width: "1600px",
      },
    },
  })
);

export const useModalStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "none",
    "&:focus": {
      outline: "none",
    },
  },
});

export const usePaperStyles = makeStyles<Theme, PaperProps>({
  root: {
    height: "100%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexFlow: ({ form }) => (form ? "column" : "row"),
    padding: "25px",
    textAlign: "left",
  },
});

export const useTextFieldStyles = makeStyles({
  root: {
    width: "100%",
    padding: "0 5px",
  },
});

export const useButtonStyles = makeStyles({
  root: {
    width: "20%",
    height: "20%",
    backgroundColor: "#4083ff",
    color: "white",
    fontWeight: "bold",
    padding: "2px",
    "&:hover": {
      transform: "scale(1.025)",
      cursor: "pointer",
      backgroundColor: "#71a3ff",
    },
  },
});
