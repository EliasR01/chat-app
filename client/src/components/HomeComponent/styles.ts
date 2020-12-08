import { makeStyles, Theme } from "@material-ui/core/styles";
import { BoxProps, CardProps, ButtonProps } from "./interfaces";

export const usePaperStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, rgba(236,241,245,1) 26%, rgba(226,226,226,1) 78%)",
    padding: 0,
    margin: 0,
  },
});

export const useBoxStyles = makeStyles<Theme, BoxProps>(() => ({
  root: {
    width: ({ type }) => (type === "b" ? "40%" : "auto"),
    display: "flex",
    flexFlow: ({ type }) => (type === "b" ? "row" : "column"),
    justifyContent: ({ type }) => (type === "b" ? "space-around" : "center"),
  },
}));

export const useButtonStyles = makeStyles<Theme, ButtonProps>(() => ({
  root: {
    minHeight: "40px",
    maxHeight: "60px",
    minWidth: "120px",
    maxWidth: "180px",
    background: ({ color }) => color,
    fontSize: "1em",
    fontWeight: "bold",
  },
}));

export const useInputStyles = makeStyles({
  root: {
    maxWidth: "180px",
  },
});

export const useContainerStyles = makeStyles({
  root: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export const useCardStyles = makeStyles<Theme, CardProps>(() => ({
  root: {
    width: "100%",
    height: ({ type }) => (type === "login" ? "auto" : "50%"),
    display: "flex",
    flexFlow: ({ type }) => (type === "login" ? "column" : "row"),
    justifyContent: "space-around",
    background: ({ type }) => (type === "login" ? "default" : "none"),
    boxShadow: ({ type }) => (type === "login" ? "default" : "none"),
  },
}));
