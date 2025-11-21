import { app, BrowserWindow } from "electron";
import { spawn, ChildProcess } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow: BrowserWindow;
let backendProcess: ChildProcess;

const isDev = process.env.NODE_ENV === "development";

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // 在开发环境中加载 Vite 开发服务器，否则加载构建后的文件
  if (isDev) {
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(
      isDev
        ? path.join(__dirname, "../../app/dist/index.html")
        : path.join(process.resourcesPath, "app/index.html"),
    );
  }
}

function startBackend() {
  const backendPath = isDev
    ? path.join(__dirname, "../../server/dist/server/index.js")
    : path.join(process.resourcesPath, "server/index.js");

  const userDataPath = app.getPath("userData");
  const dbPath = path.join(userDataPath, "app.db");

  backendProcess = spawn("node", [backendPath], {
    env: {
      ...process.env,
      ELECTRON: "true",
      NODE_ENV: process.env.NODE_ENV,
      DB_PATH: dbPath,
      NODE_PATH: path.join(
        process.resourcesPath,
        "app.asar.unpacked/server/dist-bundle/node_modules",
      ),
    },
    stdio: "inherit",
  });

  backendProcess.on("error", (err) => {
    console.error("Backend process error:", err);
  });
}

app.whenReady().then(() => {
  // 启动后端服务
  startBackend();

  // 等待后端服务启动后再创建窗口
  setTimeout(() => {
    createWindow();
  }, 2000);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (backendProcess) {
      backendProcess.kill();
    }
    app.quit();
  }
});

app.on("before-quit", () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
