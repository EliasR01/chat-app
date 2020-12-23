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
    // position: "fixed",
    boxSizing: "border-box",
    overflow: "none",
    maxHeight: "100%",
  },
});

export const useBoxStyles = makeStyles<Theme, boxProps>({
  root: {
    width: "100%",
    height: ({ type }) =>
      type === "h" ? "20%" : type === "c" ? "10%" : "100%",
    // display: ({ type }) => (type === "b" ? "block" : "flex"),
    display: "flex",
    backgroundColor: ({ type }) => (type === "c" ? "#E6E6E6" : "#FAFAFA"),
    boxShadow: ({ type }) =>
      type === "h"
        ? "none"
        : type === "c"
        ? "none"
        : "inset 20px 15px 6px -6px #F0F0F0",
    overflow: "hidden",
  },
});

export const useListStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    flex: 1,
    justifyContent: "safe flex-end",
    bottom: 0,
    flexFlow: "column",
    marginTop: "auto",
  },
});

export const useListItemStyles = makeStyles({
  root: {
    width: "100%",
    display: "flex",
    // alignSelf: "flex-end",
    marginBottom: "2%",
  },
});

export const useInputStyles = makeStyles({
  root: {
    width: "100%",
    margin: "auto",
  },
});

export const useButtonStyles = makeStyles({
  root: {
    color: "#0084ff",
  },
});
