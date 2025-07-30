# 系统设置功能

## 功能概述

在AppBar中新增了系统设置按钮，点击可以跳转到系统设置页面，用于配置大模型的API key和其他相关设置。

## 新增功能

### 1. AppBar设置按钮

- 位置：AppBar右上角，在GPT-4标签旁边
- 图标：设置齿轮图标
- 功能：点击跳转到系统设置页面

### 2. 系统设置页面 (`/settings`)

包含以下配置项：

#### OpenAI API 配置

- **API Key**: 输入OpenAI API密钥（支持密码显示/隐藏切换）
- **API Base URL**: 配置API基础URL（默认：https://api.openai.com/v1）
- **测试连接**: 验证API配置是否正确

#### 模型配置

- **模型选择**: GPT-4、GPT-4 Turbo、GPT-3.5 Turbo
- **温度 (Temperature)**: 控制输出随机性 (0-2)
- **最大Token数**: 单次对话的最大Token数 (1-4000)
- **流式响应**: 启用/禁用流式响应

### 3. 设置管理工具 (`src/utils/settings.ts`)

提供以下功能：

- `loadSettings()`: 异步加载设置
- `saveSettings()`: 异步保存设置
- `getApiKey()`: 异步获取API密钥
- `getApiBaseUrl()`: 异步获取API基础URL
- `getModel()`: 异步获取当前模型
- `hasValidApiKey()`: 异步验证API密钥是否有效

### 4. 迁移工具 (`src/utils/migrateSettings.ts`)

提供以下功能：

- `migrateFromLocalStorage()`: 从localStorage迁移到keytar
- `checkAndMigrate()`: 检查并自动迁移旧设置

## 使用方法

1. 点击AppBar右上角的设置图标
2. 在设置页面输入OpenAI API Key
3. 根据需要调整其他配置参数
4. 点击"保存设置"按钮保存配置
5. 可以点击"测试连接"验证API配置

## 数据存储

所有设置都使用keytar安全地存储在系统密钥管理器中：

- **macOS**: Keychain
- **Windows**: Credential Locker
- **Linux**: Secret Service API / KWallet

这比localStorage更安全，特别是对于API密钥等敏感信息。

### 迁移支持

应用会自动检测localStorage中的旧设置并迁移到keytar，迁移完成后会删除localStorage中的数据。

## 文件结构

```
src/
├── main/
│   └── index.ts                       # 主进程，添加了keytar IPC处理器
├── preload/
│   ├── index.ts                       # 预加载脚本，暴露设置API
│   └── index.d.ts                     # 类型定义
└── renderer/
    ├── src/
    │   ├── pages/
    │   │   └── settings/
    │   │       └── index.tsx          # 设置页面组件
    │   ├── utils/
    │   │   ├── settings.ts            # 设置管理工具
    │   │   └── migrateSettings.ts     # 迁移工具
    │   ├── layout/
    │   │   └── chat-layout/
    │   │       └── index.tsx          # 修改了AppBar
    │   └── main.tsx                   # 添加了设置路由
```

## 技术实现

- 使用Material-UI组件库构建界面
- 使用React Router进行页面路由
- 使用keytar进行安全的密钥存储
- 使用Electron IPC进行主进程和渲染进程通信
- TypeScript提供类型安全
- 响应式设计，支持移动端和桌面端

## 故障排除

### keytar构建问题

如果遇到 `Cannot find module '../build/Release/keytar.node'` 错误，请按以下步骤解决：

1. **自动解决**（推荐）：
   项目已配置 `.npmrc` 文件，重新安装依赖时会自动构建：

   ```bash
   pnpm install
   ```

2. **手动构建keytar**：

   ```bash
   npm run build:keytar
   ```

3. **手动构建**：

   ```bash
   cd node_modules/.pnpm/keytar@7.9.0/node_modules/keytar
   npm run build
   ```

4. **pnpm配置**：
   项目已配置以下pnpm设置：
   - `.npmrc` 文件：`enable-pre-post-scripts=true`
   - `package.json` 中的 `pnpm` 配置

   如果需要手动允许构建脚本：

   ```bash
   pnpm approve-builds
   ```
