const config = require("@web/main/config/env");

try {
  var WebSocket = require("ws");
} catch (e) {
  console.error("Failed to load ws:", e);
}

const setupHttpServer = (app) => {
  const server = require("http").createServer(app);
  
  const wss = new WebSocket.Server({ noServer: true });
  
  wss.on("connection", (ws, req) => {
    console.log("WebSocket client connected from:", req.socket.remoteAddress);
    
    const gameServerUrl = process.env.GAME_SERVER_URL || "zooming-harmony.railway.internal:9001";
    console.log("Connecting to game server:", gameServerUrl);
    const [host, port] = gameServerUrl.split(":");
    const gamePort = parseInt(port) || 9001;
    
    const net = require("net");
    const client = net.createConnection(gamePort, host, () => {
      console.log("Connected to game server successfully");
    });
    
    client.setEncoding("utf8");
    
    client.on("data", (data) => {
      console.log("Data from game server:", data.substring(0, 50));
      ws.send(data.toString());
    });
    
    ws.on("message", (message) => {
      console.log("Message from client:", message.toString().substring(0, 50));
      if (Buffer.isBuffer(message)) {
        client.write(message);
      } else {
        client.write(message);
      }
    });
    
    client.on("close", () => {
      console.log("Game server closed connection");
      ws.close();
    });
    
    ws.on("close", () => {
      console.log("Client closed connection");
      client.destroy();
    });
    
    client.on("error", (err) => {
      console.error("Game server connection error:", err.message);
      ws.close();
    });
    
    ws.on("error", (err) => {
      console.error("WebSocket client error:", err.message);
    });
  });
  
  server.on("upgrade", (request, socket, head) => {
    console.log("WebSocket upgrade request:", request.url);
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
