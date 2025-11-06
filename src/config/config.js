const fs = require("fs");

module.exports = {
  development: {
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB,
    host: process.env.DEV_DB_HOST,
    dialect: "postgres",
  },
  test: {
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB,
    host: process.env.DEV_DB_HOST,
    dialect: "postgres",
  },
  production: {
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB,
    host: process.env.DEV_DB_HOST,
    dialect: "postgres",
  },
};
