import { makeStyles, Theme } from "@material-ui/core";
import { boxProps, itemProps } from "./types";

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
    overflow: "hidden",
    maxHeight: "100%",
  },
});

export const useBoxStyles = makeStyles<Theme, boxProps>({
  root: {
    width: "100%",
    minHeight: "50px",
    position: ({ type }) => (type === "b" ? "relative" : "static"),
    height: ({ type }) =>
      type === "h" ? "50px" : type === "c" ? "50px" : "100%",
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
    // gridTemplateRows: "auto",
    justifyContent: "safe flex-end",
    alignItems: "safe flex-end",
    justifyItems: "end",
    flexFlow: "column",
    overflowX: "hidden",
    overflowY: "auto",
    flex: 1,
    "::-webkit-scrollbar": {
      display: "none",
    },
    // "&:first-child": {
    //   marginTop: "auto",
    // },
  },
});

export const useListItemStyles = makeStyles<Theme, itemProps>({
  root: {
    display: "flex",
    // justifySelf: ({ primary }) => (primary ? "end" : "start"),
    alignSelf: ({ primary }) => (primary ? "flex-end" : "flex-start"),
    maxWidth: "50%",
    backgroundColor: ({ primary }) => (primary ? "#0084FF" : "#C0C0C0"),
    marginBottom: "2%",
    marginLeft: "5px",
    borderRadius: "5px",
    fontSize: "1em",
  },
});

export const useListItemAvatarStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
  },
});

export const useListItemTextStyles = makeStyles<Theme, itemProps>({
  root: {
    display: "flex",
    justifyContent: ({ primary }) => (primary ? "flex-end" : "flex-start"),
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
