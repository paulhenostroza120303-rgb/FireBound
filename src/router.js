const serviceType = process.env.SERVICE_TYPE || "web";

if (serviceType === "game") {
  require("./src/game.js");
} else {
  require("./src/web/main/server.js");
}
