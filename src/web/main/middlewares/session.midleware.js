const session = require("express-session");
const expressMysqlSession = require("express-mysql-session");

const parseMySQLUrl = (url) => {
  if (!url) return null;
  try {
    const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (match) {
      return {
        USER: match[1],
        PASSWORD: match[2],
        HOST: match[3],
        PORT: parseInt(match[4]),
        DATABASE: "dragonbound", // Force dragonbound database
      };
    }
  } catch (e) {}
  return null;
};

const getRailwayMySQL = () => {
  const mysqlUrl = process.env.MYSQL_URL;
  if (mysqlUrl) {
    const parsed = parseMySQLUrl(mysqlUrl);
    if (parsed) return parsed;
  }
  
  const mysqlHost = process.env.MYSQLHOST || process.env.MYSQL_HOST || "";
  if (mysqlHost) {
    return {
      HOST: mysqlHost,
      PORT: parseInt(process.env.MYSQLPORT || process.env.MYSQL_PORT || "3306"),
      USER: process.env.MYSQLUSER || process.env.MYSQL_USER || "",
      PASSWORD: process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || "",
      DATABASE: process.env.MYSQL_DATABASE || "dragonbound",
    };
  }
  return {
    HOST: process.env.DB_HOST || "localhost",
    PORT: parseInt(process.env.DB_PORT || "3306"),
    USER: process.env.DB_USER || "root",
    PASSWORD: process.env.DB_PASSWORD || "",
    DATABASE: process.env.DB_DATABASE || "dragonbound",
  };
};

const dbConfig = getRailwayMySQL();
console.log("Session middleware DB config:", dbConfig);

var options = {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DATABASE,
  schema: {
    tableName: "account_sessions",
    columnNames: {
      session_id: "session_id",
      expires: "expires_time",
      data: "data_acc",
    },
  },
};

var MySQLStore = expressMysqlSession(session);
var sessionStore = new MySQLStore(options);

module.exports = () =>
  session({
    key: "sessionid",
    secret: process.env.SESSION_SECRET || "xxx",
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
  });
