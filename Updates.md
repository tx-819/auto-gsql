# 更新记录

## 2024-12-19 - 新增数据库连接列表功能

### 新增功能

- 创建了数据库连接列表页面 (`src/renderer/src/pages/database-connections/index.tsx`)
  - 显示所有数据库连接
  - 支持新增连接按钮
  - 支持编辑现有连接
  - 支持删除连接（带确认对话框）
  - 显示连接状态（已连接/未连接/连接错误）
  - 空状态提示

### 修改功能

- 更新数据库连接页面 (`src/renderer/src/pages/database-connection/index.tsx`)
  - 支持编辑模式
  - 根据模式显示不同的标题和按钮文本
  - 编辑模式保存后返回连接列表页
  - 新建模式保存后跳转到模型检测页

- 更新数据库服务 (`src/renderer/src/services/database.ts`)
  - 新增 `ConnectionItem` 接口
  - 新增 `getConnectionList()` 方法获取连接列表

- 更新路由配置 (`src/renderer/src/main.tsx`)
  - 添加 `/database-connections` 路由

- 更新数据库选择器 (`src/renderer/src/pages/chat/_components/DatabaseSelector.tsx`)
  - 添加"管理连接"按钮，跳转到连接列表页

### 技术细节

- 使用 Material-UI 组件构建界面
- 支持响应式设计
- 实现了完整的 CRUD 操作界面
- 添加了适当的错误处理和加载状态
- 使用 TypeScript 确保类型安全
