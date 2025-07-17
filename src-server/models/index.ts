import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";
import { getWebDAVCredential } from "./webdav";
import databaseConfig from "../config/database";

const sequelize = new Sequelize(
  databaseConfig[process.env.NODE_ENV || "production"],
);

const WebDAVCredential = getWebDAVCredential(sequelize);

export { sequelize, Sequelize, WebDAVCredential };
