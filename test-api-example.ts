// 这是一个示例文件，展示如何使用Electron API
// 在实际的React组件中，您可以通过window.electronAPI访问这些方法

// 示例：读取JSON文件
async function exampleReadFile() {
  try {
    const data = await window.electronAPI.readFile('/path/to/anime-data.json')
    console.log('读取的数据:', data)
  } catch (error) {
    console.error('读取文件失败:', error)
  }
}

// 示例：写入JSON文件
async function exampleWriteFile() {
  const animeData = {
    version: '1.0',
    animeList: [
      {
        id: '1',
        title: '示例番剧',
        watchMethod: '在线观看',
        episodes: [
          { id: '1', number: 1, title: '第一集', url: 'https://example.com/ep1', watched: false }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }
  
  try {
    const result = await window.electronAPI.writeFile('/path/to/anime-data.json', animeData)
    console.log('写入结果:', result)
  } catch (error) {
    console.error('写入文件失败:', error)
  }
}

// 示例：获取设置
async function exampleGetSettings() {
  try {
    const settings = await window.electronAPI.getSettings()
    console.log('当前设置:', settings)
  } catch (error) {
    console.error('获取设置失败:', error)
  }
}

// 示例：保存设置
async function exampleSaveSettings() {
  const newSettings = {
    toolConfig: {
      useCustomTool: true,
      customTool: {
        name: '我的播放器',
        path: 'C:\\Program Files\\MyPlayer\\player.exe',
        arguments: '--fullscreen {url}'
      }
    }
  }
  
  try {
    const result = await window.electronAPI.saveSettings(newSettings)
    console.log('保存设置结果:', result)
  } catch (error) {
    console.error('保存设置失败:', error)
  }
}

// 示例：使用工具打开链接
async function exampleOpenWithTool() {
  const toolConfig = {
    useCustomTool: true,
    customTool: {
      name: '我的播放器',
      path: 'C:\\Program Files\\MyPlayer\\player.exe',
      arguments: '--fullscreen {url}'
    }
  }
  
  try {
    const result = await window.electronAPI.openWithTool('https://example.com/video.mp4', toolConfig)
    console.log('打开结果:', result)
  } catch (error) {
    console.error('打开失败:', error)
  }
}

// 注意：在实际使用中，需要确保window.electronAPI类型声明已正确加载