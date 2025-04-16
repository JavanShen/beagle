// npm version 时更新 Tauri 版本号
import fs from "fs";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 读取 package.json 中的版本号
const packagePath = path.resolve(__dirname, "../package.json");
const packageJson = JSON.parse(fs.readFileSync(packagePath));
const newVersion = packageJson.version;

if (!newVersion) {
  console.error("无法获取版本号");
  process.exit(1);
}

// 更新 Tauri 配置文件
const tauriConfPath = path.resolve(__dirname, "../src-tauri/tauri.conf.json");
const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath));
tauriConf.version = newVersion;
fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2));
console.log(`✅ 更新 Tauri 版本号为 ${newVersion}`);

execSync("git add .");
