const dotenv = require("dotenv");

dotenv.config();

const getEnvOrDefault = (key, defaultValue) => {
  return process.env[key] || defaultValue;
};

const parseMySQLUrl = (url) => {
  if (!url) return null;
  try {
    const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (match) {
      return {
        HOST: match[3],
        PORT: parseInt(match[4]),
        USER: match[1],
        PASSWORD: match[2],
        DATABASE: "dragonbound", // Force dragonbound database
      };
    }
  } catch (e) {}
  return null;
};

const getRailwayMySQL = () => {
  const mysqlUrl = getEnvOrDefault("MYSQL_URL", "");
  if (mysqlUrl) {
    const parsed = parseMySQLUrl(mysqlUrl);
    if (parsed) return parsed;
  }
  
  const mysqlHost = getEnvOrDefault("MYSQLHOST", getEnvOrDefault("MYSQL_HOST", ""));
  if (mysqlHost) {
    return {
      HOST: mysqlHost,
      PORT: parseInt(getEnvOrDefault("MYSQLPORT", getEnvOrDefault("MYSQL_PORT", "3306"))),
      USER: getEnvOrDefault("MYSQLUSER", getEnvOrDefault("MYSQL_USER", "")),
      PASSWORD: getEnvOrDefault("MYSQLPASSWORD", getEnvOrDefault("MYSQL_PASSWORD", "")),
      DATABASE: getEnvOrDefault("MYSQL_DATABASE", "dragonbound"),
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
