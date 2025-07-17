import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { sequelize } from "./models";
import auth from "./middlewares/auth";
import { sourcesRouter, musicRouter } from "./routes";

export const app = express();
app.use(express.json()).use(auth);

if (process.env.NODE_ENV === "development") {
  app.use((req, _res, next) => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`,
    );
    next();
  });
}

app.use("/sources", sourcesRouter);
app.use("/music", musicRouter);

sequelize.sync();

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
