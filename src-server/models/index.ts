import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";
import { getSources } from "./sources";
import { getMusicMeta } from "./music";
import databaseConfig from "../config/database";

const sequelize = new Sequelize(
  databaseConfig[process.env.NODE_ENV || "production"],
);

const Sources = getSources(sequelize);
const MusicMeta = getMusicMeta(sequelize);

export { sequelize, Sequelize, Sources, MusicMeta };
