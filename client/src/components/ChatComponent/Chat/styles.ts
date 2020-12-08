import { makeStyles, Theme } from "@material-ui/core";
import { boxProps } from "./types";

export const useContainerStyles = makeStyles({
  root: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexFlow: "column",
    borderRadius: "5px",
    padding: 0,
  },
});

export const useBoxStyles = makeStyles<Theme, boxProps>({
  root: {
    width: "100%",
    height: ({ type }) => (type === "h" ? "20%" : "100%"),
    display: "flex",
    justifyContent: "space-around",
    backgroundColor: "#FAFAFA",
    boxShadow: ({ type }) =>
      type === "h" ? "none" : "inset 20px 15px 6px -6px #F0F0F0",
  },
});
