const { spawn } = require('child_process');
const path = require('path');

const appPath = path.join(__dirname, 'dist', 'win-unpacked', 'Anime Manager.exe');

console.log('Starting Anime Manager with debug output...');
console.log('App path:', appPath);

const child = spawn(`"${appPath}"`, [], {
  stdio: 'pipe',
  shell: true
});

child.stdout.on('data', (data) => {
  console.log('STDOUT:', data.toString());
});

child.stderr.on('data', (data) => {
  console.error('STDERR:', data.toString());
});

child.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
});

// 10秒后自动退出
setTimeout(() => {
  console.log('Stopping after 10 seconds...');
  child.kill();
  process.exit(0);
}, 10000);