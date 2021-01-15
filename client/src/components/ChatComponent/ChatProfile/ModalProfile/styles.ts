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
    transition: "all 0.2s ease-out",
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
    height: "50%",
    marginTop: "2%",
  },
});
