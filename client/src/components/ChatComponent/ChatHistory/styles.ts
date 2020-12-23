import { makeStyles } from "@material-ui/core";

export const useContainerStyles = makeStyles({
  root: {
    height: "100%",
    width: "30%",
    display: "flex",
    flexFlow: "column",
    backgroundColor: "#0084ff",
    color: "#fff",
    borderRadius: "8px",
    padding: "24px",
  },
});

export const useBoxStyles = makeStyles({
  root: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "24px",
  },
});

export const useInputSyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#3D9FFF",
    "&&&:hover": {
      backgroundColor: "#5FB0FF",
    },
  },
});

export const useButtonStyles = makeStyles({
  root: {
    color: "#fff",
  },
});

export const useIconStyles = makeStyles({
  hover: {
    "&:hover": {
      backgroundColor: "#FFF",
    },
  },
  selected: {
    backgroundColor: "#FFF",
  },
});
