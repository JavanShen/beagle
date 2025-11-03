import path from "path";

export default {
  coversDirPath: path.join(__dirname, "../covers"),
  coversRoute: "/covers",
  frontendOutput:
    process.env.FRONTEND_OUTPUT || path.join(__dirname, "../../dist"),
};
