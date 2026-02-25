import { app, BrowserWindow } from 'electron'
import path from 'path'
import { registerFileSystemHandlers } from './file-system'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'Anime Manager',
    icon: path.join(__dirname, '../assets/icon.png')
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000')
  } else {
    // 在生产环境中，尝试不同的路径
    const htmlPaths = [
      path.join(__dirname, '../index.html'),      // 正确路径：dist/index.html
      path.join(process.resourcesPath, 'app.asar.unpacked', 'dist', 'index.html'), // asar解压
      path.join(process.resourcesPath, 'app', 'dist', 'index.html'), // asar内
      path.join(__dirname, 'index.html')          // 旧路径（兼容性）
    ]
    
    let loaded = false
    for (const htmlPath of htmlPaths) {
      try {
        mainWindow.loadFile(htmlPath)
        console.log(`成功加载HTML文件: ${htmlPath}`)
        loaded = true
        break
      } catch (error) {
        console.log(`无法加载HTML文件: ${htmlPath}`, error)
      }
    }
    
    if (!loaded) {
      console.error('无法找到HTML文件，显示错误页面')
      mainWindow.loadURL(`data:text/html,<h1>应用启动失败</h1><p>无法找到HTML文件</p>`)
    }
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  registerFileSystemHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})