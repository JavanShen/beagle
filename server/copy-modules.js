// packages/backend/copy-dependencies.js
const fs = require("fs");
const path = require("path");

function copyDependencies() {
  const pkg = require("./package.json");
  const dependencies = Object.keys(pkg.dependencies || {});
  const targetDir = path.join(
    __dirname,
    "dist-bundle",
    "server",
    "node_modules",
  );

  console.log("Copying dependencies:", dependencies);

  dependencies.forEach((dep) => {
    try {
      // 找到依赖的路径
      const depPath = require.resolve(dep);
      let depRoot = path.dirname(depPath);

      // 向上查找直到找到包含 package.json 的目录
      while (depRoot !== path.dirname(depRoot)) {
        if (fs.existsSync(path.join(depRoot, "package.json"))) {
          break;
        }
        depRoot = path.dirname(depRoot);
      }

      // 复制整个依赖目录
      const targetDepPath = path.join(targetDir, dep);
      copyDirectory(depRoot, targetDepPath);

      console.log(`Copied: ${dep} -> ${targetDepPath}`);
    } catch (error) {
      console.warn(`Warning: Could not copy dependency ${dep}:`, error.message);
    }
  });
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(src)) return;

  // 创建目标目录
  fs.mkdirSync(dest, { recursive: true });

  const items = fs.readdirSync(src);

  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      // 跳过一些不必要的目录
      if (item !== "node_modules" && item !== ".git" && !item.startsWith(".")) {
        copyDirectory(srcPath, destPath);
      }
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDependencies();
