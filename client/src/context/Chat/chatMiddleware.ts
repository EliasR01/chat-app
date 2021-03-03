import { Dispatch } from "react";
import axios from "axios";
import { Action, Payload, Response } from "./types";

export const chatMiddleware = async (
  action: string,
  payload: Payload,
  dispatch: Dispatch<Action>
): Promise<Response> => {
  switch (action) {
    case "LOGIN": {
      //Fetch the chat information: [messages, conversations, contacts, all the people registered in the application]
      let result = {
        data: "Nothing executed...",
        code: 0,
      };
      await axios
        .get(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}user?user=${payload.username}`,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            dispatch({ payload: response.data, type: "LOGIN" });
            result = {
              data: "Logged Succesfully",
              code: 1,
            };
          } else {
            result = { data: "Could not log in", code: 2 };
          }
        });
      return result;
    }
    case "SEND": {
      //Sends the message
      dispatch({ payload: payload, type: "SEND" });
      return { data: "Message sent successfully", code: 1 };
    }
    case "RECEIVE": {
      //Receive the message
      dispatch({ payload: payload, type: "RECEIVE" });
      return { data: "Received message!", code: 1 };
    }
    case "ADD_CONTACT": {
      let result = {
        data: "Nothing executed...",
        code: 0,
      };
      await axios
        .post(`${process.env.REACT_APP_BACKEND_ENDPOINT}add_contact`, payload, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === 200) {
            const data = {
              contacts: response.data,
              messages: {},
              conversations: {},
            };
            dispatch({ payload: data, type: action });
            result = { data: "Contact added successfully", code: 1 };
          }
        })
        .catch(() => {
          result = {
            data: "Couldn't add contact, contact the administrator",
            code: 2,
          };
        });
      return result;
    }
    case "REMOVE_CONTACT": {
      let result = {
        data: "Nothing executed...",
        code: 0,
      };
      await axios
        .delete(`${process.env.REACT_APP_BACKEND_ENDPOINT}rem_contact`, {
          data: {
            contact: payload.contacts,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            const data = {
              contacts: response.data,
              messages: {},
              conversations: {},
            };
            dispatch({ payload: data, type: action });
            result = { data: "Contact removed successfully", code: 1 };
          }
        })
        .catch(
          () =>
            (result = {
              data: "Couldn't remove contact, contact administrator",
              code: 2,
            })
        );
      return result;
    }
    case "CREATE_CONV": {
      let result = {
        data: "Nothing executed...",
        code: 0,
      };
      await axios
        .post(`${process.env.REACT_APP_BACKEND_ENDPOINT}create_conv`, {
          member: payload.username,
          creator: payload.creator,
        })
        .then((res) => {
          if (res.status === 200) {
            dispatch({ payload: res.data, type: action });
            let returningIndex = "";
            for (const index in res.data.conversation) {
              returningIndex = index;
            }

            result = { data: returningIndex, code: 1 };
          }
        })
        .catch(
          () =>
            (result = {
              data: "Couldn't create conversation, contact the administrator",
              code: 2,
            })
        );
      return result;
    }
    default:
      return {
        data: "Nothing executed...",
        code: 0,
      };
  }
};
