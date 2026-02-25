# 剧集管理内联表单设计方案

## 概述
将剧集管理的添加新行功能从弹窗形式改为内联表单形式，提升用户体验和操作效率。

## 当前状态分析

### 现有架构
1. **WritePage.tsx** - 主页面组件
   - 管理`isEpisodeModalOpen`状态
   - 使用EpisodeModal弹窗组件
   - 处理剧集添加/编辑的弹窗打开逻辑

2. **EpisodeTable.tsx** - 剧集表格组件
   - 显示剧集列表
   - 提供"添加新行"按钮（触发弹窗）
   - 提供编辑/删除按钮

3. **EpisodeModal.tsx** - 弹窗组件
   - 模态对话框形式
   - 包含EpisodeForm表单
   - 处理关闭和提交逻辑

4. **EpisodeForm.tsx** - 表单组件
   - 剧集数据输入表单
   - 表单验证逻辑
   - 焦点管理（针对弹窗优化）

### 问题识别
- 弹窗形式打断用户操作流程
- 焦点管理复杂，存在hack代码
- 用户体验不够流畅
- 需要多次点击完成操作

## 设计方案

### 目标
将剧集添加/编辑功能从弹窗改为内联表单，提供更流畅的用户体验。

### 内联表单方案

#### 1. 组件结构调整
```
WritePage.tsx (移除弹窗依赖)
├── EpisodeTable.tsx (增强)
│   ├── 内联表单区域 (新增)
│   ├── 剧集表格
│   └── 操作按钮
└── EpisodeForm.tsx (适配内联使用)
```

#### 2. 状态管理调整
- **移除**: `isEpisodeModalOpen`, `setIsEpisodeModalOpen`
- **新增**: `isAddingNew` (boolean), `editingEpisodeId` (string | null)
- **简化**: 焦点管理逻辑，移除弹窗相关的复杂处理

#### 3. 用户界面设计
```
+-----------------------------------------------+
| 剧集管理                                      |
+-----------------------------------------------+
| [添加新行] [批量删除]          共 X 个剧集    |
+-----------------------------------------------+
| [内联表单区域]                                 |
| 标题: [_______________]                        |
| 集数: [___] 链接: [______________________]    |
| 备注: [___________________________]           |
| 观看状态: [○ 未观看 ● 已观看]                  |
| [提交] [取消] [删除]                           |
+-----------------------------------------------+
| 剧集表格                                      |
| +---+--------+----------------+-------+------+|
| | ✓ | 第1话  | 标题内容       | 链接  | 操作 ||
| +---+--------+----------------+-------+------+|
| | ✓ | 第2话  | 标题内容       | 链接  | 操作 ||
+-----------------------------------------------+
```

#### 4. 交互流程
1. **添加新剧集**:
   - 点击"添加新行"按钮
   - 表单区域显示（标题："添加新剧集"）
   - 填写表单数据
   - 点击"提交"保存
   - 表单清空，准备下一次添加

2. **编辑现有剧集**:
   - 点击表格行中的"编辑"按钮
   - 表单区域显示（标题："编辑剧集"）
   - 表单预填选中剧集的数据
   - 修改后点击"提交"更新
   - 或点击"取消"放弃编辑

3. **删除剧集**:
   - 编辑状态下显示"删除"按钮
   - 点击后确认删除
   - 表单区域恢复为添加状态

### 技术实现细节

#### 1. EpisodeTable组件修改
```typescript
// 新增状态
const [isAddingNew, setIsAddingNew] = useState(false);
const [editingEpisodeId, setEditingEpisodeId] = useState<string | null>(null);

// 计算编辑中的剧集数据
const editingEpisode = editingEpisodeId 
  ? episodes.find(ep => ep.id === editingEpisodeId)
  : null;

// 处理添加新行
const handleAddNew = () => {
  setIsAddingNew(true);
  setEditingEpisodeId(null);
};

// 处理编辑
const handleEdit = (episodeId: string) => {
  setEditingEpisodeId(episodeId);
  setIsAddingNew(false);
};

// 处理表单提交
const handleFormSubmit = (data: EpisodeFormData) => {
  if (editingEpisodeId) {
    // 调用父组件的编辑处理
    onEditEpisode?.(editingEpisodeId, data);
  } else {
    // 调用父组件的添加处理
    onAddEpisode?.(data);
  }
  // 重置表单状态
  setIsAddingNew(false);
  setEditingEpisodeId(null);
};

// 处理取消
const handleFormCancel = () => {
  setIsAddingNew(false);
  setEditingEpisodeId(null);
};
```

#### 2. EpisodeForm组件适配
- 移除`isOpen`属性和相关的焦点管理逻辑
- 简化`useEffect`依赖，只关注表单数据
- 保持表单验证功能
- 优化输入框焦点设置（直接设置，无需延迟）

#### 3. WritePage组件清理
- 移除EpisodeModal导入
- 移除弹窗相关状态
- 调整事件处理函数签名
- 更新EpisodeTable的props传递

### 实施步骤

#### 阶段1: 准备和重构
1. 创建EpisodeTable的内联表单版本原型
2. 测试表单基本功能
3. 验证状态管理逻辑

#### 阶段2: 集成和替换
1. 修改WritePage组件，移除弹窗依赖
2. 更新EpisodeTable组件接口
3. 调整事件处理流程

#### 阶段3: 测试和优化
1. 功能测试：添加、编辑、删除操作
2. 用户体验测试：焦点管理、表单验证
3. 性能测试：状态更新、渲染性能

### 风险与缓解

#### 技术风险
1. **焦点管理问题**
   - 风险：内联表单可能仍有焦点问题
   - 缓解：简化焦点逻辑，直接使用ref.focus()

2. **状态同步问题**
   - 风险：表单状态与表格数据不同步
   - 缓解：使用单一数据源，通过props传递

3. **性能问题**
   - 风险：频繁的状态更新影响性能
   - 缓解：使用useMemo优化计算，避免不必要的重渲染

#### 用户体验风险
1. **布局混乱**
   - 风险：表单区域占用空间，影响表格查看
   - 缓解：合理设计表单高度，可折叠设计

2. **操作流程不清晰**
   - 风险：用户不理解内联表单的工作方式
   - 缓解：清晰的视觉反馈，适当的提示信息

### 成功标准
1. **功能完整性**: 所有剧集管理功能正常工作
2. **用户体验**: 操作流程更流畅，减少点击次数
3. **性能**: 响应时间无明显下降
4. **代码质量**: 代码更简洁，移除hack逻辑
5. **可维护性**: 组件结构清晰，易于扩展

## 附录

### 相关文件列表
- `src/renderer/components/WritePage/WritePage.tsx`
- `src/renderer/components/common/EpisodeTable.tsx`
- `src/renderer/components/common/EpisodeModal.tsx`
- `src/renderer/components/common/EpisodeForm.tsx`

### 测试用例
1. 添加新剧集功能测试
2. 编辑现有剧集功能测试
3. 删除剧集功能测试
4. 表单验证测试
5. 焦点管理测试
6. 状态同步测试

### 验收标准
- [ ] 点击"添加新行"显示内联表单
- [ ] 表单提交后自动隐藏
- [ ] 编辑剧集时表单预填数据
- [ ] 取消操作恢复表单状态
- [ ] 删除功能正常工作
- [ ] 表单验证正常
- [ ] 焦点管理正常
- [ ] 无控制台错误
- [ ] 性能无明显下降