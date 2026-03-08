const dotenv = require("dotenv");

dotenv.config();

const getEnvOrDefault = (key, defaultValue) => {
  return process.env[key] || defaultValue;
};

module.exports = {
  PORT: parseInt(getEnvOrDefault("WEB_PORT", "8080")),
  COOKIE: {
    SECRET: getEnvOrDefault("COOKIE_SECRET", "cookie-secret-xxx"),
  },
  DB: {
    HOST: getEnvOrDefault("DB_HOST", "localhost"),
    USER: getEnvOrDefault("DB_USER", "root"),
    PASSWORD: getEnvOrDefault("DB_PASSWORD", ""),
    DATABASE: getEnvOrDefault("DB_DATABASE", "dragonbound"),
    PORT: parseInt(getEnvOrDefault("DB_PORT", "3306")),
  },
  SESSION: {
    SECRET: getEnvOrDefault("SESSION_SECRET", "xxx"),
  },
};
