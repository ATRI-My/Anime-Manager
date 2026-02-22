# 设计文档：修复AnimeForm组件数据不同步问题

## 问题描述
在WritePage中，当用户点击左侧番剧列表切换不同番剧时，右侧的AnimeForm组件不会自动更新显示新番剧的信息，而是继续显示上一个番剧的数据。

## 根本原因分析
1. `WritePage.tsx:40-43`的`handleSelectAnime`函数正确设置了`selectedAnime`状态
2. `WritePage.tsx:328-333`将`selectedAnime`作为`initialData`传递给`AnimeForm`组件
3. 但是`AnimeForm.tsx:30-35`只在组件初始化时使用`initialData`设置表单状态
4. 当`initialData`变化时，`AnimeForm`组件内部的`formData`状态不会自动更新

## 解决方案设计

### 方案1：使用useEffect监听initialData变化（推荐）
**实现方式：**
在`AnimeForm`组件中添加`useEffect`钩子，当`initialData`变化时更新`formData`状态。

**优点：**
- 逻辑清晰，符合React最佳实践
- 只在必要时更新表单数据
- 不会丢失用户可能的未保存输入
- 符合React组件设计模式

**缺点：**
- 需要修改`AnimeForm`组件

### 方案2：使用key属性强制重新渲染
**实现方式：**
在`WritePage`中给`AnimeForm`添加`key={selectedAnime?.id}`属性。

**优点：**
- 简单，一行代码解决问题

**缺点：**
- 每次切换都会完全重新创建组件
- 可能丢失用户正在输入的内容
- 性能开销较大

### 方案3：使用受控组件模式
**实现方式：**
将`AnimeForm`改为完全受控组件，表单状态由父组件管理。

**优点：**
- 数据流更清晰，父组件完全控制表单状态

**缺点：**
- 需要重构`AnimeForm`组件，改动较大
- 增加父组件复杂度

## 选择方案：方案1

### 具体实现
修改`src/renderer/components/common/AnimeForm.tsx`：

1. 导入`useEffect`：
```typescript
import React, { useState, useEffect } from 'react';
```

2. 添加`useEffect`监听`initialData`变化：
```typescript
useEffect(() => {
  if (initialData) {
    setFormData({
      title: initialData.title || '',
      watchMethod: initialData.watchMethod || WATCH_METHODS[0],
      description: initialData.description || '',
      tags: initialData.tags || [],
    });
  }
}, [initialData]);
```

3. 重置`tagInput`状态：
```typescript
useEffect(() => {
  setTagInput('');
}, [initialData]);
```

### 边缘情况处理
1. **空状态处理**：当`initialData`为`undefined`时（添加新番剧模式），表单保持为空
2. **标签重置**：切换番剧时清空标签输入框
3. **验证状态重置**：切换番剧时清空验证错误

### 测试验证
1. 点击左侧不同番剧，验证右侧表单正确显示对应信息
2. 添加新番剧功能正常工作
3. 表单提交功能不受影响
4. 标签管理功能正常

## 实施步骤
1. 修改`AnimeForm.tsx`组件
2. 运行测试验证功能
3. 如有必要，添加单元测试

## 风险与缓解
- **风险**：可能影响现有的表单验证逻辑
- **缓解**：确保`useEffect`只在`initialData`变化时触发，不影响用户正在进行的编辑

## 备选方案
如果方案1实施后有问题，可以回退到方案2（使用key属性），但方案1更优雅且性能更好。

---
**创建日期**：2026-02-21  
**问题类型**：Bug修复  
**影响范围**：WritePage的AnimeForm组件  
**优先级**：高