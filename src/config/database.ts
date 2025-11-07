import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const { DATABASE_URL, NODE_ENV } = process.env;

if (!DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not defined in environment variables");
}

// Initialize Sequelize with full URL
export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions:
    NODE_ENV === "production"
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false, // Needed for many managed Postgres providers
          },
        }
      : {},
});
