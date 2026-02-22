# 保存文件后无法更改的bug测试

## 问题描述
在WritePage界面保存JSON文件后，就不能进行更改了。

## 根本原因分析
1. `saveFile`函数在保存成功后调用`reloadData()`
2. `reloadData()`从磁盘重新加载数据
3. 这会更新`state.animeList`但不会更新WritePage组件中的`selectedAnime`状态
4. 导致`selectedAnime`指向旧对象，状态不一致

## 复现步骤
1. 在WritePage界面选择一个动漫进行编辑
2. 修改动漫信息
3. 点击"保存"按钮保存文件
4. 尝试继续编辑或添加剧集
5. 预期：操作失败或表现异常

## 解决方案
从`saveFile`和`saveAsFile`函数中移除`reloadData()`调用，因为：
1. 我们刚刚保存了当前内存中的数据到磁盘
2. 内存中的数据应该是最新的
3. 不需要重新从磁盘加载

## 代码修改
需要修改`src/renderer/contexts/AppDataContext.tsx`：
1. 移除`saveFile`函数中的`await reloadData()`调用
2. 移除`saveAsFile`函数中的`await reloadData()`调用