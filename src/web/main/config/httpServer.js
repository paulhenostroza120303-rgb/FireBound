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
    
    // Connect to local game server if running, otherwise use external
    const gameServerUrl = process.env.GAME_SERVER_URL || "ws://localhost:9001";
    console.log("Connecting to game server:", gameServerUrl);
    
    const WebSocket = require("ws");
    const client = new WebSocket(gameServerUrl);
    
    client.on("open", () => {
      console.log("Connected to game server successfully");
    });
    
    client.on("message", (data) => {
      console.log("Data from game server, length:", data.length);
      console.log("Game server data preview:", data.toString('hex', 0, Math.min(50, data.length)));
      if (Buffer.isBuffer(data)) {
        const array = new Uint8Array(data);
        ws.send(array.buffer);
      } else {
        ws.send(data.toString());
      }
    });
    
    ws.on("message", (message) => {
      console.log("Message from client, length:", message.length);
      console.log("Client message preview:", Buffer.isBuffer(message) ? message.toString('hex', 0, Math.min(50, message.length)) : message.substring(0, 50));
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
  
  server.listen(9002, () => {
    console.log(`HTTP server listening on port 9002`);
  });
  return server;
};

module.exports = setupHttpServer;
