const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('开始手动打包...');

// 清理目录
const unpackedDir = path.join(__dirname, '..', 'dist', 'win-unpacked');
if (fs.existsSync(unpackedDir)) {
  console.log(`清理目录: ${unpackedDir}`);
  try {
    fs.rmSync(unpackedDir, { recursive: true, force: true });
  } catch (error) {
    console.log(`清理失败: ${error.message}`);
  }
}

// 创建目录结构
console.log('创建目录结构...');
const appDir = path.join(unpackedDir, 'resources', 'app');
fs.mkdirSync(path.join(appDir, 'dist', 'main'), { recursive: true });
fs.mkdirSync(path.join(appDir, 'dist', 'assets'), { recursive: true });

// 复制文件
console.log('复制文件...');

// 复制主进程文件
const mainFiles = ['index.js', 'preload.js', 'file-system.js'];
mainFiles.forEach(file => {
  const src = path.join(__dirname, '..', 'dist', 'main', file);
  const dest = path.join(appDir, 'dist', 'main', file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`复制: ${file}`);
  }
});

// 复制HTML文件到main目录（根据修改后的主进程代码）
const htmlSrc = path.join(__dirname, '..', 'dist', 'index.html');
const htmlDest = path.join(appDir, 'dist', 'main', 'index.html');
if (fs.existsSync(htmlSrc)) {
  fs.copyFileSync(htmlSrc, htmlDest);
  console.log('复制: index.html');
}

// 复制assets文件
const assetsSrc = path.join(__dirname, '..', 'dist', 'assets');
if (fs.existsSync(assetsSrc)) {
  const files = fs.readdirSync(assetsSrc);
  files.forEach(file => {
    const src = path.join(assetsSrc, file);
    const dest = path.join(appDir, 'dist', 'assets', file);
    fs.copyFileSync(src, dest);
    console.log(`复制: assets/${file}`);
  });
}

// 创建package.json
const packageJson = {
  name: "anime-manager",
  version: "1.0.0",
  description: "动漫资源管理器桌面应用",
  main: "dist/main/index.js",
  author: "",
  license: "MIT",
  dependencies: {
    "@types/react-window": "^1.8.8",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-window": "^2.2.7",
    "uuid": "^9.0.0"
  }
};

fs.writeFileSync(
  path.join(appDir, 'package.json'),
  JSON.stringify(packageJson, null, 2)
);
console.log('创建: package.json');

console.log('手动打包完成！');
console.log(`应用目录: ${unpackedDir}`);
console.log('注意：需要手动复制Electron运行时文件或使用electron-builder生成完整的应用。');