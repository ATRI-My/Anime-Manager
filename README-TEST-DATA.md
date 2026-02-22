# 测试数据设置指南

## 文件位置

番剧信息JSON文件应该放在Electron的用户数据目录：

**Windows**: `%APPDATA%\anime-manager\anime-data.json`
- 示例: `C:\Users\你的用户名\AppData\Roaming\anime-manager\anime-data.json`

**macOS**: `~/Library/Application Support/anime-manager/anime-data.json`

**Linux**: `~/.config/anime-manager/anime-data.json`

**重要**: 目录名基于package.json中的`name`字段 (`anime-manager`)，不是应用显示名称。

## 快速设置方法

### 方法1：使用批处理脚本（Windows）
运行 `setup-test-data.bat` 自动复制文件。

### 方法2：手动操作
1. 打开文件资源管理器
2. 在地址栏输入 `%APPDATA%` 并按回车
3. 创建 `anime-manager` 文件夹（如果不存在）
4. 将 `example-anime-data.json` 复制到该文件夹，重命名为 `anime-data.json`

### 方法3：通过程序自动创建
如果文件不存在，程序首次启动时会创建空的 `anime-data.json` 文件。

## 数据结构说明

JSON文件必须符合以下格式：

```json
{
  "version": "1.0.0",
  "animeList": [
    {
      "id": "唯一ID",
      "title": "番剧标题",
      "watchMethod": "观看方式", // "本地播放器"、"在线观看"、"下载观看"
      "description": "描述（可选）",
      "tags": ["标签1", "标签2"],
      "episodes": [
        {
          "id": "剧集ID",
          "number": 1,
          "title": "剧集标题",
          "url": "播放地址",
          "watched": false,
          "notes": "备注（可选）"
        }
      ],
      "createdAt": "创建时间",
      "updatedAt": "更新时间"
    }
  ]
}
```

## 示例文件内容

`example-anime-data.json` 包含5个测试番剧：

1. **咒术回战 第二季** - 3集，在线观看
2. **葬送的芙莉莲** - 4集，本地播放器  
3. **间谍过家家** - 3集，下载观看
4. **鬼灭之刃 游郭篇** - 5集，在线观看
5. **孤独摇滚！** - 3集，本地播放器

## 验证步骤

1. 放置文件到正确位置
2. 运行 `dist\win-unpacked\Anime Manager.exe`
3. 程序应该显示5个番剧卡片
4. 点击任意番剧应该显示剧集列表

## 故障排除

如果程序显示空白：
1. 检查文件路径是否正确
2. 检查JSON格式是否有效（可以使用JSON验证工具）
3. 查看开发者工具控制台（F12）的错误信息
4. 确保文件编码为UTF-8