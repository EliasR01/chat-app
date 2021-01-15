import { Message } from "./types";

let socket: WebSocket;
interface cb {
  messageHandler: (msg: MessageEvent) => void;
  username: string | undefined;
}

export const connect = ({ messageHandler, username }: cb): void => {
  socket = new WebSocket(`ws://localhost:4000/ws?user=${username}`);

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

export const closeConnection = (): void => {
  socket.close(1000, "Disconnecting user");
};
