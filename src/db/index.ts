import { sequelize } from "../config/database";

export const databaseConnection = async () => {
  try {
    await sequelize.authenticate();

    // await sequelize.sync({ alter: true });
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};
