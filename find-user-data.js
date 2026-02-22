const { app } = require('electron');

// 模拟获取用户数据路径
console.log('用户数据目录路径:');
console.log('Windows: %APPDATA%\\Anime Manager');
console.log('macOS: ~/Library/Application Support/Anime Manager');
console.log('Linux: ~/.config/Anime Manager');

// 实际路径示例
console.log('\n在Windows上，完整路径可能是:');
console.log('C:\\Users\\你的用户名\\AppData\\Roaming\\Anime Manager\\anime-data.json');

console.log('\n你可以通过以下方式找到确切路径:');
console.log('1. 运行程序，在开发者工具控制台查看日志');
console.log('2. 在代码中添加 console.log(getAnimeDataPath()) 来打印路径');