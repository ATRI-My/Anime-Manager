# 虚拟滚动配置系统

## 概述

虚拟滚动配置系统为动漫管理应用提供了可配置的虚拟化参数，允许用户根据需求调整虚拟滚动组件的性能和行为。

## 配置结构

### VirtualScrollConfig 接口

```typescript
interface VirtualScrollConfig {
  // 通用配置
  enabled: boolean
  overscan: number
  
  // 动漫网格配置
  animeGrid: {
    columns: number      // 网格列数
    gap: number          // 项目间距 (px)
    itemHeight: number   // 项目高度 (px)
    threshold: number    // 虚拟化阈值
  }
  
  // 剧集列表配置
  episodeList: {
    itemHeight: number   // 项目高度 (px)
    threshold: number    // 虚拟化阈值
    height: number       // 列表高度 (px)
  }
}
```

### 默认配置

默认配置位于 `src/shared/constants.ts`：

```typescript
export const DEFAULT_VIRTUAL_SCROLL_CONFIG: VirtualScrollConfig = {
  enabled: true,
  overscan: 2,
  animeGrid: {
    columns: 3,
    gap: 4,
    itemHeight: 400,
    threshold: 20
  },
  episodeList: {
    itemHeight: 80,
    threshold: 50,
    height: 600
  }
}
```

## 使用方法

### 1. 在组件中使用配置

#### 使用 useVirtualScrollConfig 钩子

```typescript
import { useVirtualScrollConfig } from '../hooks/useVirtualScrollConfig'

const MyComponent = () => {
  const virtualScroll = useVirtualScrollConfig()
  
  // 检查是否应该使用虚拟化
  const shouldVirtualize = virtualScroll.shouldVirtualizeAnimeGrid(animeCount)
  
  // 获取配置参数
  const gridProps = virtualScroll.getAnimeGridProps()
  const listProps = virtualScroll.getEpisodeListProps()
  
  return (
    <VirtualAnimeGrid {...gridProps} />
  )
}
```

#### 直接使用工具函数

```typescript
import { getVirtualScrollConfig, shouldUseVirtualization } from '../shared/virtual-scroll-utils'

const config = getVirtualScrollConfig(settings?.virtualScrollConfig)
const shouldVirtualize = shouldUseVirtualization(itemCount, config.animeGrid.threshold, config.enabled)
```

### 2. 在设置中存储配置

配置会自动存储在应用的设置中，通过 `Settings` 接口的 `virtualScrollConfig` 字段：

```typescript
interface Settings {
  toolConfig: ToolConfig
  virtualScrollConfig?: VirtualScrollConfig
}
```

### 3. 更新配置

使用 `useSettings` 钩子更新配置：

```typescript
import { useSettings } from '../hooks/useSettings'

const { settings, saveSettings } = useSettings()

const updateConfig = async (newConfig: VirtualScrollConfig) => {
  const newSettings = {
    ...settings!,
    virtualScrollConfig: newConfig
  }
  await saveSettings(newSettings)
}
```

## 配置参数说明

### 通用参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| enabled | boolean | true | 是否启用虚拟滚动 |
| overscan | number | 2 | 预渲染数量，提高滚动流畅度 |

### 动漫网格参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| columns | number | 3 | 网格列数 |
| gap | number | 4 | 项目间距 (像素) |
| itemHeight | number | 400 | 每个动漫卡片的高度 (像素) |
| threshold | number | 20 | 虚拟化阈值，动漫数量超过此值使用虚拟化 |

### 剧集列表参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| itemHeight | number | 80 | 每个剧集项目的高度 (像素) |
| threshold | number | 50 | 虚拟化阈值，剧集数量超过此值使用虚拟化 |
| height | number | 600 | 列表容器的高度 (像素) |

## 性能优化建议

1. **调整阈值**: 根据实际数据量调整虚拟化阈值
   - 小数据集: 提高阈值，避免不必要的虚拟化开销
   - 大数据集: 降低阈值，提前启用虚拟化

2. **优化 overscan**: 
   - 快速滚动: 增加 overscan 值，减少空白区域
   - 内存敏感: 减少 overscan 值，降低内存使用

3. **项目高度**: 
   - 准确设置项目高度，避免滚动位置计算错误
   - 统一高度可以提高虚拟化效率

## 扩展性

### 添加新配置参数

1. 在 `VirtualScrollConfig` 接口中添加新字段
2. 更新 `DEFAULT_VIRTUAL_SCROLL_CONFIG`
3. 在工具函数中添加相应的处理逻辑
4. 在设置界面中添加对应的配置控件

### 支持新组件类型

1. 在配置接口中添加新的组件配置块
2. 创建对应的工具函数
3. 实现配置界面
4. 更新组件以使用新配置

## 示例

### QueryPage 组件示例

```typescript
// 使用配置决定是否虚拟化
{virtualScroll.shouldVirtualizeAnimeGrid(filteredAnimeList.length) ? (
  <VirtualAnimeGrid {...virtualScroll.getAnimeGridProps()} />
) : (
  // 普通渲染
)}
```

### 设置界面示例

参见 `src/renderer/components/SettingsPage/VirtualScrollSettings.tsx`