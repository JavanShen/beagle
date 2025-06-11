import express from "express";
import { createClient } from "webdav";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

const app = express();
app.use(express.json());

app.post("/token", (req, res) => {
  const { username, password } = req.body;

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
});
