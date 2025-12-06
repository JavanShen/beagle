import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { sequelize } from "./models";
import auth from "./middlewares/auth";
import responseHandler from "./middlewares/response";
import errorHandle from "./middlewares/errorHandle";
import { sourcesRouter, musicRouter, playlistRouter } from "./routes";
import fs from "fs/promises";
import filesConfig from "./config/files";
import history from "connect-history-api-fallback";

export const app = express();
export const isElectron = process.env.ELECTRON === "true";

const init = async () => {
  app.use(express.json()).use(responseHandler).use(auth);

  if (process.env.NODE_ENV !== "production") {
    app.use((req, _res, next) => {
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`,
      );
      next();
    });
  }

  app.use("/api/sources", sourcesRouter);
  app.use("/api/music", musicRouter);
  app.use("/api/playlist", playlistRouter);

  app.use(history());

  await fs.mkdir(filesConfig.coversDirPath, { recursive: true });
  app.use(filesConfig.coversRoute, express.static(filesConfig.coversDirPath));

  if (
    !isElectron &&
    (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test")
  ) {
    app.use(express.static(filesConfig.frontendOutput));
  }

  app.use(errorHandle);

  await sequelize.sync({ force: false });

  app.listen(3000, () => {
    console.log("Server started on port 3000");
  });
};
init();
