const dotenv = require("dotenv");

dotenv.config();

const getEnvOrDefault = (key, defaultValue) => {
  return process.env[key] || defaultValue;
};

module.exports = {
  DB: {
    HOST: getEnvOrDefault("DB_HOST", "localhost"),
    USER: getEnvOrDefault("DB_USER", "root"),
    PASSWORD: getEnvOrDefault("DB_PASSWORD", ""),
    DATABASE: getEnvOrDefault("DB_DATABASE", "dragonbound"),
    PORT: parseInt(getEnvOrDefault("DB_PORT", "3306")),
  },
  GAME_PORT: parseInt(getEnvOrDefault("GAME_PORT", "9001")),
};
