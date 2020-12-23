import { Message } from "./types";

let socket: WebSocket;
interface cb {
  messageHandler: (msg: MessageEvent) => void;
}

export const connect = ({ messageHandler }: cb): void => {
  socket = new WebSocket("ws://localhost:4000/ws");

  socket.onopen = () => {
    console.log("Successfully connected!");
  };

  socket.onmessage = (msg: MessageEvent) => {
    messageHandler(msg);
  };

  socket.onclose = (event: Event) => {
    console.log("Socket closed connection: ", event);
  };

  socket.onerror = (error: Event) => {
    console.error("Socket error: ", error);
  };
};

export const sendMsg = (msg: Message): void => {
  const message = JSON.stringify(msg);
  socket.send(message);
};
