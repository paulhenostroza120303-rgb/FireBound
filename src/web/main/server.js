require("module-alias/register");

const setupApp = require("./config/app");

const logStarted = require("@web/main/config/logStarted");
const DragonDataBase = require("@infra/db/connection");
const Logger = require("@shared/logger");
const logger = Logger.getLogger("DragonServer");


(async function () {
  try {
    await DragonDataBase.init();
    logger.log("Database connected");
    const app = await setupApp();
    
    app.get("/api/game-server", (req, res) => {
      const gameServerUrl = process.env.GAME_SERVER_URL || "";
      res.json({ url: gameServerUrl });
    });
    
    logger.break();
    logger.green("Compiled successfully!");
    logger.break();
    logStarted();
  } catch (error) {
    logger.error("Error starting the application", error);
  }
})();
