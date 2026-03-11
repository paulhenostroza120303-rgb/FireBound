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
    
    const gameServerUrl = process.env.GAME_SERVER_URL || "firebound-o66l.onrender.com:443";
    console.log("Connecting to game server:", gameServerUrl);
    const [host, port] = gameServerUrl.split(":");
    const gamePort = parseInt(port) || 443;
    
    const WebSocket = require("ws");
    const isSecure = process.env.NODE_ENV === 'production' || gamePort === 443;
    const protocol = isSecure ? 'wss' : 'ws';
    const wsUrl = `${protocol}://${host}${gamePort === 443 ? '' : ':' + gamePort}`;
    const client = new WebSocket(wsUrl);
    
    client.on("open", () => {
      console.log("Connected to game server successfully");
    });
    
    client.on("message", (data) => {
      console.log("Data from game server, length:", data.length);
      if (Buffer.isBuffer(data)) {
        const array = new Uint8Array(data);
        ws.send(array.buffer);
      } else {
        ws.send(data.toString());
      }
    });
    
    ws.on("message", (message) => {
      console.log("Message from client, length:", message.length);
      if (Buffer.isBuffer(message)) {
        client.send(message);
      } else {
        client.send(message.toString());
      }
    });
    
    client.on("close", () => {
      console.log("Game server closed connection");
      ws.close();
    });
    
    ws.on("close", () => {
      console.log("Client closed connection");
      client.close();
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
