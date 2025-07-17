import { Options } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

type Config = {
  development: Options;
  production: Options;
  test: Options;
};

const config: Config = {
  development: {
    storage: "./database.sqlite",
    dialect: "sqlite",
    logging: console.log,
  },
  production: {
    storage: process.env.DB_PATH || "/var/db/prod.sqlite",
    dialect: "sqlite",
    logging: false,
  },
  test: {
    storage: ":memory:",
    dialect: "sqlite",
  },
};

export default config;
