import { makeStyles, Theme } from "@material-ui/core";
import { boxProps } from "./types";

export const useBoxStyles = makeStyles<Theme, boxProps>({
  root: {
    height: "100%",
    width: ({ hidden }) => (hidden ? "5%" : "30%"),
    display: "flex",
    flexFlow: "column",
    transition: "all 0.2s ease-out",
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
