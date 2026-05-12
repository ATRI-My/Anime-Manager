import { app, BrowserWindow, protocol } from 'electron'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import { registerFileSystemHandlers } from './file-system'

const readFileAsync = promisify(fs.readFile)

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
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
        loaded = true
        break
      } catch (error) {
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
  // 注册自定义图片协议 anime-cover://
  protocol.handle('anime-cover', async (request) => {
    try {
      const urlObj = new URL(request.url)
      const encodedPath = urlObj.pathname.replace(/^\//, '')
      const filePath = decodeURIComponent(encodedPath)
      const normalizedPath = path.normalize(filePath)
      const ext = path.extname(normalizedPath).toLowerCase()
      const mimeMap: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.bmp': 'image/bmp',
      }
      const mimeType = mimeMap[ext] || 'image/png'
      const buffer = await readFileAsync(normalizedPath)
      return new Response(buffer, {
        headers: { 'Content-Type': mimeType, 'Cache-Control': 'no-cache' }
      })
    } catch (error) {
      console.error('anime-cover 协议读取失败:', error)
      return new Response('', { status: 404 })
    }
  })

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