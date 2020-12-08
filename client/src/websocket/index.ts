const socket = new WebSocket("ws://localhost:4000/ws");

interface cb {
  messageHandler: (msg: MessageEvent) => void;
}

export const connect = ({ messageHandler }: cb): void => {
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

export const sendMsg = (msg: string): void => {
  console.log("Sending msg: ", msg);
  socket.send(msg);
};
