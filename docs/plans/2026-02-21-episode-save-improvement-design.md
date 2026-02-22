# 剧集编辑保存功能改进设计文档

## 概述
本设计文档针对 Anime Manager 应用中剧集编辑保存功能的问题进行改进设计。当前问题：用户编辑剧集后需要手动点击保存按钮，缺乏明确的保存提示，容易导致用户误以为修改已自动保存。

## 问题分析

### 当前实现
1. **数据流**：
   - 用户编辑剧集 → 点击"更新剧集" → 内存状态更新 → `isModified=true`
   - 用户需要手动点击"保存"按钮 → 数据写入文件 → `isModified=false`

2. **用户界面问题**：
   - 缺乏明显的未保存修改提示
   - 用户不清楚需要手动保存
   - 关闭应用时无保存提示

### 根本原因
- `useAppData.ts` 中的 `updateEpisode` 函数只更新内存状态
- 缺少自动保存或明确的保存提示机制
- 用户界面未突出显示未保存状态

## 设计目标

### 主要目标
1. **保持手动保存模式** - 尊重用户对数据控制的偏好
2. **增强用户提示** - 明确告知用户需要保存
3. **防止数据丢失** - 在关键操作前提示保存

### 次要目标
1. 改进用户体验
2. 保持代码简洁
3. 最小化性能影响

## 设计方案

### 1. 界面改进组件

#### 1.1 UnsavedChangesBanner 组件
位置：WritePage 组件顶部
功能：当有未保存修改时显示醒目横幅

```tsx
interface UnsavedChangesBannerProps {
  isModified: boolean;
  onSave: () => void;
  onDiscard?: () => void;
}
```

显示内容：
- 图标：⚠️
- 文本："有未保存的修改"
- 按钮："立即保存" (主按钮)
- 可选："放弃修改" (仅在特定场景)

#### 1.2 状态栏增强
位置：FileOperations 组件状态显示
改进：
- 颜色：未保存时显示橙色/红色
- 图标：添加警告图标
- 文本："⚠️ 有未保存的修改 (需要保存)"

### 2. 提示机制

#### 2.1 Toast 提示
触发时机：剧集编辑/添加/删除操作后
内容："修改已保存到内存，请点击保存按钮保存到文件"
持续时间：5秒

#### 2.2 确认对话框
触发时机：
1. 尝试关闭应用时
2. 尝试切换页面时（如从Write页切换到Query页）
3. 尝试加载新文件时

内容：
```
有未保存的修改
您有未保存的修改，是否要保存？

[保存并继续] [不保存继续] [取消]
```

### 3. 代码修改点

#### 3.1 WritePage.tsx
- 导入 UnsavedChangesBanner 组件
- 在页面顶部添加横幅条件渲染
- 添加页面切换保护逻辑

#### 3.2 FileOperations.tsx
- 增强状态显示样式
- 添加保存状态监听

#### 3.3 useAppData.ts
- 添加修改操作后的Toast触发
- 添加页面切换保护逻辑

#### 3.4 App.tsx
- 添加全局未保存修改检查
- 集成路由切换保护

### 4. 用户体验流程

#### 4.1 正常编辑流程
```
1. 用户编辑剧集 → 点击"更新剧集"
2. 显示Toast："修改已保存到内存"
3. 状态栏变为："⚠️ 有未保存的修改"
4. 保存按钮高亮显示
5. 用户点击保存 → 数据持久化
6. 状态恢复："文件已保存"
```

#### 4.2 尝试关闭流程
```
1. 用户尝试关闭应用
2. 检查 isModified
3. 如果 true → 显示确认对话框
4. 用户选择：
   - 保存并关闭 → 保存后关闭
   - 不保存关闭 → 直接关闭
   - 取消 → 返回应用
```

## 技术实现细节

### 1. UnsavedChangesBanner 组件实现
```tsx
// src/renderer/components/common/UnsavedChangesBanner.tsx
const UnsavedChangesBanner: React.FC<UnsavedChangesBannerProps> = ({
  isModified,
  onSave,
  onDiscard
}) => {
  if (!isModified) return null;
  
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationIcon className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            有未保存的修改。请保存以防止数据丢失。
          </p>
          <div className="mt-2">
            <button
              onClick={onSave}
              className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
            >
              立即保存
            </button>
            {onDiscard && (
              <button
                onClick={onDiscard}
                className="ml-2 text-yellow-700 hover:text-yellow-600 text-sm"
              >
                放弃修改
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 2. 状态栏样式增强
```tsx
// 在 FileOperations.tsx 中
const statusClass = state.isModified 
  ? 'text-orange-600 font-semibold' 
  : 'text-gray-600';

<span className={statusClass}>
  {state.isModified ? '⚠️ 有未保存的修改' : '文件已保存'}
</span>
```

### 3. Toast 集成
```tsx
// 在 useAppDataWithToast.ts 或 WritePage.tsx 中
const handleEpisodeSubmit = async (episodeData: any) => {
  // ... 现有逻辑
  
  // 添加Toast提示
  addToast('info', '修改已保存', '请点击保存按钮将修改保存到文件', 5000);
};
```

## 测试计划

### 单元测试
1. UnsavedChangesBanner 组件渲染测试
2. 状态栏样式切换测试
3. Toast 触发逻辑测试

### 集成测试
1. 完整编辑保存流程测试
2. 页面切换保护测试
3. 应用关闭保护测试

### 用户验收测试
1. 编辑剧集后是否看到提示
2. 保存按钮是否高亮显示
3. 关闭应用时是否提示保存

## 风险评估

### 低风险
- 界面样式修改
- Toast提示添加

### 中风险
- 页面切换保护逻辑
- 可能影响现有用户体验

### 缓解措施
1. 逐步部署，先添加提示再添加保护
2. 提供用户设置选项（可选）
3. 充分测试所有边界情况

## 时间估算

### 阶段1：界面改进 (2-3小时)
- 创建 UnsavedChangesBanner 组件
- 增强状态栏显示
- 集成到 WritePage

### 阶段2：提示机制 (2-3小时)
- 添加操作后Toast
- 实现页面切换保护
- 添加应用关闭保护

### 阶段3：测试和优化 (1-2小时)
- 单元测试
- 集成测试
- 用户体验优化

**总计：5-8小时**

## 后续优化建议

### 短期优化
1. 添加快捷键支持 (Ctrl+S)
2. 添加自动保存选项设置
3. 改进保存进度反馈

### 长期优化
1. 实现增量保存
2. 添加版本历史
3. 云同步支持

## 批准记录

- 设计提出：2026-02-21
- 用户确认：✓
- 开发开始：[待填写]
- 完成日期：[待填写]