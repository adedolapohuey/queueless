require("dotenv").config();

module.exports = {
  development: {
    use_env_variable: process.env.DATABASE_URL,
    dialect: "postgres",
    url: process.env.DATABASE_URL,
  },
  production: {
    use_env_variable: process.env.DATABASE_URL,
    dialect: "postgres",
    url: process.env.DATABASE_URL,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
