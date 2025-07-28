import { WebSocket, WebSocketServer } from "ws";

const server = new WebSocketServer({ port: 8008 });

server.on("connection", (ws: WebSocket) => {
  ws.on("error", (e) => console.log(e));

  ws.on("message", (data) => {
    const parsedData = JSON.parse(data.toString());

    const { message, description, type } = parsedData;
    if (type === "todo") {
      server.clients.forEach((ws) =>
        ws.send(
          JSON.stringify({
            message,
            description,
            type,
          })
        )
      );
    }
  });

  ws.on("close", (e) => console.log("connection is closed"));
});
