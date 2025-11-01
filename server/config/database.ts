import { Options } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

type Config = {
  development: Options;
  production: Options;
  test: Options;
};

const generalConfig: Options = {
  dialect: "sqlite",
};

const config: Config = {
  development: {
    ...generalConfig,
    storage: "./database.sqlite",
    logging: console.log,
  },
  production: {
    ...generalConfig,
    storage: process.env.DB_PATH || "/var/db/prod.sqlite",
    logging: false,
  },
  test: {
    ...generalConfig,
    storage: ":memory:",
  },
};

export default config;
