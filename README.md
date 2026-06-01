# 🎀 Pet Companion - 智能虚拟桌宠

## 📱 项目简介

Pet Companion 是一个 AI 驱动的虚拟桌宠应用，具备：
- 🤖 智能对话（基于 Deepseek 大模型）
- 😊 情感识别与分析
- 🎬 动画驱动的2D角色表现
- 🧠 情感-行为自适应学习
- 💾 本地隐私数据存储

## 🚀 快速开始

### 环境要求
- Node.js >= 16
- npm >= 8

### 安装依赖

```bash
npm install
```

### 配置 API

创建 `.env.local` 文件：

```env
DEEPSEEK_API_KEY=your_api_key_here
```

### 开发模式

```bash
npm run dev
```

这会同时启动 Electron 窗口和 React 开发服务器。

### 生产构建

```bash
npm run build
```

## 📁 项目结构

```
Ai_pet/
├── src/
│   ├── main/                 # Electron 主进程
│   │   ├── ipcHandlers/      # IPC 处理器
│   │   ├── index.ts
│   │   └── preload.ts
│   │
│   └── renderer/             # React 前端
│       ├── components/       # 组件
│       ├── stores/           # 状态管理 (Zustand)
│       ├── engines/          # 核心业务引擎
│       ├── services/         # API 服务
│       ├── types/            # TypeScript 类型
│       └── styles/           # CSS 样式
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── electron-builder.yml
```

## 🎯 核心功能

### 1. 对话系统
- 文字输入
- AI 自动回复（Deepseek API）
- 上下文记忆

### 2. 情感系统
- 基于关键词的情感识别
- 5 种基础情感：happy, sad, angry, surprised, neutral
- 情感-动作映射

### 3. 动画引擎
- 基于关键帧的 2D 动画
- 面部表情合成
- 动作状态插值

### 4. 学习系统
- 记录用户反应
- 更新动作偏好权重
- 情感平滑过渡

## 📝 使用指南

### 创建宠物
1. 输入宠物名字
2. 选择性格（5 种可选）
3. 点击创建

### 与宠物聊天
1. 在底部聊天框输入文本
2. 按 Enter 或点击发送
3. 系统分析情感并播放对应动作
4. 宠物回复

## 🔧 配置和定制

### 修改动作
编辑 `src/renderer/types/action.ts` 中的 `PredefinedActions`

### 修改情感关键词
编辑 `src/renderer/engines/emotionEngine.ts` 中的 `emotionKeywords`

### 修改样式
编辑 `src/renderer/styles/` 中的 CSS 文件

## 💾 数据存储

所有数据本地存储在 SQLite 数据库中：
- **位置**：`~/.config/Pet Companion/pet-companion.db`
- **表**：pets, chat_history, emotion_profiles, conversation_summaries

## 🐛 故障排除

### API 错误
- 检查 DEEPSEEK_API_KEY 是否正确设置
- 查看开发工具控制台的错误信息

### 数据库错误
- 删除 `pet-companion.db` 并重启应用

## 📅 开发计划

- [ ] 语音输入/输出
- [ ] 3D 模型生成（Tripo API）
- [ ] 更多宠物性格
- [ ] 日程提醒功能
- [ ] 多语言支持

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
