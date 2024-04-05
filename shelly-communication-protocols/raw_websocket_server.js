const {WebSocketServer, WebSocket} = require("ws");
const http = require("http");

const httpServer = http.createServer();
let ws = new WebSocketServer({server: httpServer});

console.log("Starting websocket server on port 8080");

ws.on("connection", async (webSocket, request, client) => {
    console.log("New connection:", request.socket.remoteAddress);
    webSocket.on("message", async (message) => {
        message = JSON.parse(message);
        console.log(message);
    })
});

httpServer.listen(8080);
