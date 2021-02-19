import { makeStyles, Theme, createStyles } from "@material-ui/core";

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
    overflow: "auto",
    "&:focus": {
      outline: "none",
    },
  },
});

export const usePaperStyles = makeStyles({
  root: {
    padding: "25px",
  },
});

export const useTextFieldStyles = makeStyles({
  root: {
    width: "100%",
    marginTop: "2%",
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
