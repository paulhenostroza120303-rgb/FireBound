const serviceType = process.env.SERVICE_TYPE || "web";

if (serviceType === "game") {
  require("./game.js");
} else {
  require("./web/main/server.js");
}
