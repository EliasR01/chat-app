import { makeStyles } from "@material-ui/core";

export const useBoxStyles = makeStyles({
  root: {
    height: "100%",
    width: "30%",
    display: "flex",
    flexFlow: "column",
  },
});

export const useAvatarStyles = makeStyles({
  large: {
    width: "50%",
    height: "65%",
  },
});

export const useTypographyStyles = makeStyles({
  name: {
    fontWeight: "bold",
    fontSize: "1.3em",
    marginTop: "10px",
  },
  description: {
    fontWeight: "lighter",
  },
});

export const useListStyles = makeStyles({
  root: {
    maxHeight: "30px",
  },
});
