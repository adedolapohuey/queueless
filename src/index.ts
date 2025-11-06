import app from "./app";
import { databaseConnection } from "./db";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // 1️⃣ Try connecting to PostgreSQL
    await databaseConnection();

    // 3️⃣ Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server ready on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
