import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DEV_DB_HOST,
  port: Number(process.env.DEV_DB_PORT),
  username: process.env.DEV_DB_USER,
  password: process.env.DEV_DB_PASSWORD,
  database: process.env.DEV_DB,
  logging: process.env.NODE_ENV === "development" ? console.log : false,
});
