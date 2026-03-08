const dotenv = require("dotenv");

dotenv.config();

const getEnvOrDefault = (key, defaultValue) => {
  return process.env[key] || defaultValue;
};

const getRailwayMySQL = () => {
  if (process.env.MYSQL_HOST) {
    return {
      HOST: process.env.MYSQL_HOST,
      PORT: parseInt(process.env.MYSQL_PORT || "3306"),
      USER: process.env.MYSQL_USER,
      PASSWORD: process.env.MYSQL_PASSWORD,
      DATABASE: process.env.MYSQL_DATABASE,
    };
  }
  return {
    HOST: getEnvOrDefault("DB_HOST", "localhost"),
    PORT: parseInt(getEnvOrDefault("DB_PORT", "3306")),
    USER: getEnvOrDefault("DB_USER", "root"),
    PASSWORD: getEnvOrDefault("DB_PASSWORD", ""),
    DATABASE: getEnvOrDefault("DB_DATABASE", "dragonbound"),
  };
};

const dbConfig = getRailwayMySQL();

module.exports = {
  PORT: parseInt(getEnvOrDefault("WEB_PORT", "8080")),
  COOKIE: {
    SECRET: getEnvOrDefault("COOKIE_SECRET", "cookie-secret-xxx"),
  },
  DB: dbConfig,
  SESSION: {
    SECRET: getEnvOrDefault("SESSION_SECRET", "xxx"),
  },
};
