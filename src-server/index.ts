import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { sequelize } from "./models";
import auth from "./middlewares/auth";
import responseHandler from "./middlewares/response";
import { sourcesRouter, musicRouter, playlistRouter } from "./routes";
import fs from "fs/promises";
import filesConfig from "./config/files";
import history from "connect-history-api-fallback";

export const app = express();
app.use(express.json()).use(responseHandler).use(auth).use(history());

if (process.env.NODE_ENV === "development") {
  app.use((req, _res, next) => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`,
    );
    next();
  });
}

await fs.mkdir(filesConfig.coversDirPath, { recursive: true });
app.use(filesConfig.coversRoute, express.static(filesConfig.coversDirPath));
if (process.env.NODE_ENV === "production") {
  app.use(express.static(filesConfig.frontendOutput));
}

app.use("/api/sources", sourcesRouter);
app.use("/api/music", musicRouter);
app.use("/api/playlist", playlistRouter);

await sequelize.sync({ force: true });

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
