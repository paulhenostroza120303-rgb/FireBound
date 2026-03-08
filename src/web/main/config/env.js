const dotenv = require("dotenv");

dotenv.config();

const getEnvOrDefault = (key, defaultValue) => {
  return process.env[key] || defaultValue;
};

const getRailwayMySQL = () => {
  const mysqlHost = getEnvOrDefault("MYSQLHOST", getEnvOrDefault("MYSQL_HOST", ""));
  if (mysqlHost) {
    return {
      HOST: mysqlHost,
      PORT: parseInt(getEnvOrDefault("MYSQLPORT", getEnvOrDefault("MYSQL_PORT", "3306"))),
      USER: getEnvOrDefault("MYSQLUSER", getEnvOrDefault("MYSQL_USER", "")),
      PASSWORD: getEnvOrDefault("MYSQLPASSWORD", getEnvOrDefault("MYSQL_PASSWORD", "")),
      DATABASE: getEnvOrDefault("MYSQL_DATABASE", getEnvOrDefault("MYSQL_DATABASE", "dragonbound")),
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
