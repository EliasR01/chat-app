import { Dispatch } from "react";
import axios from "axios";
import { Action, UserPayload } from "./types";

export const userMiddleware = async (
  action: string,
  payload: UserPayload,
  dispatch: Dispatch<Action>
): Promise<boolean | string> => {
  switch (action) {
    case "LOGIN": {
      let result = false;
      await axios
        .get(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}auth?type=${action}&email=${payload.email}&password=${payload.password}`,
          { withCredentials: true }
        )
        .then((response) => {
          if (response.status === 200) {
            dispatch({ payload: response.data, type: action });
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
        .post(`${process.env.REACT_APP_BACKEND_ENDPOINT}register`, payload.data)
        .then((response) => {
          if (response.status === 200) {
            dispatch({ payload: response.data, type: action });
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
          `${process.env.REACT_APP_BACKEND_ENDPOINT}auth?type=${action}&email=${payload.email}&password=${payload.password}`,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            dispatch({ payload: response.data, type: action });
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
        .get(`${process.env.REACT_APP_BACKEND_ENDPOINT}logout`, {
          withCredentials: true,
        })
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
        .put(`${process.env.REACT_APP_BACKEND_ENDPOINT}update`, payload.data)
        .then((response) => {
          if (response.status === 200) {
            dispatch({ payload: response.data, type: action });
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
