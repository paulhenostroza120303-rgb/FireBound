const config = require("@web/main/config/env");
const WebSocket = require("ws");

const setupHttpServer = (app) => {
  const server = require("http").createServer(app);
  
  const wss = new WebSocket.Server({ noServer: true });
  
  wss.on("connection", (ws, req) => {
    console.log("WebSocket client connected");
    
    const gameServerUrl = process.env.GAME_SERVER_URL || "localhost:9001";
    const [host, port] = gameServerUrl.split(":");
    const gamePort = parseInt(port) || 9001;
    
    const net = require("net");
    const client = net.createConnection(gamePort, host, () => {
      console.log("Connected to game server");
    });
    
    client.setEncoding("utf8");
    
    client.on("data", (data) => {
      ws.send(data.toString());
    });
    
    ws.on("message", (message) => {
      if (Buffer.isBuffer(message)) {
        client.write(message);
      } else {
        client.write(message);
      }
    });
    
    client.on("close", () => {
      ws.close();
    });
    
    ws.on("close", () => {
      client.destroy();
    });
    
    client.on("error", (err) => {
      console.error("Game server connection error:", err.message);
      ws.close();
    });
  });
  
  server.on("upgrade", (request, socket, head) => {
    if (request.url.startsWith("/")) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } else {
      socket.destroy();
    }
  });
  
  server.listen(config.PORT, () => {
    console.log(`HTTP server listening on port ${config.PORT}`);
  });
  return server;
};

module.exports = setupHttpServer;
