import { Dispatch } from "react";
import axios from "axios";
import { User, Action } from "./types";

export const userMiddleware = async (
  action: string,
  payload: User,
  dispatch: Dispatch<Action>
): Promise<boolean | string> => {
  switch (action) {
    case "LOGIN": {
      let result = false;
      await axios
        .get(
          `http://localhost:4000/auth?type=${action}&email=${payload.email}&password=${payload.password}`,
          { withCredentials: true }
        )
        .then((response) => {
          if (response.status === 200) {
            dispatch({ payload: response.data, type: "LOGIN" });
            result = true;
          } else {
            result = response.data;
          }
        })
        .catch((err) => {
          result = err;
        });
      return result;
    }
    case "REGISTER": {
      let result = false;
      await axios
        .post("http://localhost:4000/register", payload)
        .then((response) => {
          if (response.status === 200) {
            dispatch({ payload: response.data, type: "REGISTER" });
            result = true;
          } else {
            result = response.data;
          }
        })
        .catch((err) => {
          result = err;
        });
      return result;
    }
    case "RELOAD": {
      let result = false;
      await axios
        .get(
          `http://localhost:4000/auth?type=${action}&email=${payload.email}&password=${payload.password}`,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            dispatch({ payload: response.data, type: "RELOAD" });
            result = true;
          }
        })
        .catch(() => {
          result = false;
        });
      return result;
    }
    case "LOGOUT": {
      let result = false;
      await axios
        .get("http://localhost:4000/logout", { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            dispatch({ payload: response.data, type: "LOGOUT" });
            result = true;
          }
        });
      return result;
    }
    case "UPDATE": {
      let result = "";
      await axios
        .put("http://localhost:4000/update", payload)
        .then((response) => {
          if (response.status === 200) {
            dispatch({ payload: response.data, type: "UPDATE" });
            result = response.data;
          }
        })
        .catch((err) => {
          result = err;
        });
      return result;
    }
    default: {
      return false;
    }
  }
};
