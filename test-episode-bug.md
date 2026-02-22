# 剧集管理删除后添加新行bug测试

## 问题描述
剧集管理在删除操作后添加新行无法正常工作。

## 可能的问题场景
1. 删除剧集后，点击"添加新行"按钮，模态框不打开
2. 模态框打开，但提交后没有效果
3. 提交后出现错误

## 根本原因分析

### 假设1：selectedAnime变为null
在`handleDeleteEpisode`中：
```typescript
const updatedAnime = state.animeList.find(a => a.id === selectedAnime.id);
setSelectedAnime(updatedAnime || null);
```

如果`state.animeList.find`返回`undefined`（因为React状态更新是异步的），那么`selectedAnime`会被设置为null。

### 假设2：状态不一致
`selectedAnime`指向旧对象，而`state.animeList`包含新对象，导致状态不一致。

### 假设3：剧集编号冲突
删除剧集后，添加新剧集时可能使用相同的剧集编号，导致验证失败。

## 需要验证的问题

1. `deleteEpisode`函数是否总是返回`updatedAnime`？
2. `handleDeleteEpisode`中是否总是使用`result.updatedAnime`？
3. 添加剧集时是否检查剧集编号重复？
4. `selectedAnime`状态是否正确更新？

## 代码检查点

1. `src/renderer/contexts/AppDataContext.tsx:495` - `deleteEpisode`返回值
2. `src/renderer/components/WritePage/WritePage.tsx:165-171` - `handleDeleteEpisode`中的状态更新
3. `src/renderer/contexts/AppDataContext.tsx:354-359` - 剧集编号重复检查
4. `src/renderer/components/WritePage/WritePage.tsx:139` - `handleAddEpisode`中的`selectedAnime`检查