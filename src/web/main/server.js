require("module-alias/register");

const setupApp = require("./config/app");
const setupHttpServer = require("./config/httpServer");

const logStarted = require("@web/main/config/logStarted");
const DragonDataBase = require("@infra/db/connection");
const Logger = require("@shared/logger");
const logger = Logger.getLogger("DragonServer");


(async function () {
  try {
    await DragonDataBase.init();
    logger.log("Database connected");
    const app = await setupApp();
    
    // Start game server in the same process
    logger.log("Starting game server...");
    setupHttpServer(app);
    
    logger.break();
    logger.green("Compiled successfully!");
    logger.break();
    logStarted();
  } catch (error) {
    logger.error("Error starting the application", error);
  }
})();
