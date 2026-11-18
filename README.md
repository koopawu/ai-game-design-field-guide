# AI Game Design Field Guide

面向游戏策划的中文交互式知识地图，系统梳理 AI 在游戏研发、运行时玩法、UGC 与经营增长中的应用，并整理技术底座、评估成本、合规治理、未来能力与 90 天学习路线。

> 内容快照：2026-10-26。行业事实、官方案例与趋势推演在页面中分开呈现。

## 在线访问

启用 GitHub Pages 后访问：

**https://koopawu.github.io/ai-game-design-field-guide/**

## 内容模块

- 行业坐标：生产管线、运行时体验、经营与生态三条路径
- 应用全景：创意、叙事、美术、原型、测试、NPC、动态难度、UGC 与商业化
- 技术底座：LLM、多模态、Token、RAG、微调、Agent、记忆、强化学习与世界模型
- AI 角色系统：感知、记忆、检索、规划、行动、表达与裁决
- 策划工作流：体验目标、事实权限、上下文包、评测集、灰度与降级
- 产品化评估：体验、系统、经营、安全指标与单位经济模型
- 边界与合规：知识产权、声音肖像、隐私、未成年人、标识与平台披露
- 未来能力：五层核心能力模型、分阶段趋势与八项能力自评
- 实践路线：90 天学习计划与可展示的作品集闭环

## 功能特点

- 响应式章节导航与移动端目录
- 知识搜索、场景筛选与交互式架构拆解
- AI 功能需求模板一键复制
- 能力自评与即时学习建议
- 官方报告、平台文档与一手技术资料来源索引
- 减少动态效果偏好适配、键盘焦点与触控目标支持

## 技术栈

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 3 + 自定义 OKLCH 视觉变量
- Lucide React 图标
- Canvas 2D 生成式首屏视觉
- 兼容 GitHub Pages 项目子路径

## 本地开发

环境要求：Node.js 20 或兼容的更新版本。

```bash
npm install
npm run dev
```

开发服务器默认运行于 `http://localhost:3000`。

### 构建与检查

```bash
npm run lint
npm run build
npm run preview
```

生产文件输出至 `dist/`。

## 项目结构

```text
.
├── src/
│   ├── App.tsx                        # 内容、组件与交互
│   ├── index.css                      # 视觉系统与响应式布局
│   └── main.tsx                       # 应用入口
├── index.html
├── LICENSE
├── package.json
└── vite.config.ts
```

## 发布到 GitHub Pages

先在本地完成生产构建：

```bash
npm install
npm run build
```

如果本机已配置 GitHub 写权限，可用 `gh-pages` 将 `dist/` 发布到 `gh-pages` 分支：

```bash
npx gh-pages -d dist
```

随后打开仓库的 **Settings → Pages**，选择 **Deploy from a branch**，将分支设为 `gh-pages`、目录设为 `/(root)`。

Vite 使用相对资源路径，路由采用 Hash 模式，可直接部署到 `/<repository>/` 项目子路径。

## 内容维护

- 更新行业数据时，同步修改页面中的“知识快照”日期与来源索引。
- 厂商案例用于理解技术结构，不等同于独立评测或普遍量产结论。
- 行业调查需保留样本口径，避免将单一调查比例外推至整个行业。
- 趋势内容应标注时间范围与不确定性，避免写成确定性事实。

## License

代码采用 [MIT License](LICENSE)。页面中引用的报告、文档与案例权利归各自权利人所有。
