# 项目需求文档 (PRD) - 个人精美博客系统

**版本**: 1.0.0
**日期**: 2026-01-09
**状态**: 待开发
**角色**: 架构师 & 设计师

---

## 1. 项目愿景 (Vision)
构建一个高性能、视觉精美且具备高度可定制性的个人博客。核心理念是 **“内容为王，设计为翼”**。通过 **Next.js** 的现代技术栈实现极致的加载速度，利用 **MDX** 提供丰富的写作体验，并结合 **极简但个性化** 的 UI 设计语言展示个人品牌。

## 2. 设计规范 (Design Specs)

### 2.1 视觉风格
*   **核心关键词**: 极简 (Minimalist)、个性化 (Personalized)、透气感 (Airy)。
*   **色彩体系**:
    *   支持 **明亮 (Light)** / **暗黑 (Dark)** 模式无缝切换。
    *   主色调：黑白灰为主，辅以一个高饱和度的“强调色”（Accent Color）用于链接、按钮和微交互。
*   **排版**: 注重衬线体（标题）与无衬线体（正文）的搭配，强调行高与留白，提供杂志级的阅读体验。
*   **动效 (Motion)**: 使用 Framer Motion 实现平滑的页面转场、元素入场动画和鼠标悬停时的微交互，打破传统极简风的枯燥感。

### 2.2 响应式布局
*   **Mobile First**: 移动端优先设计，保证在手机上的阅读体验。
*   **Desktop**: 大屏下利用侧边栏或网格布局展示更多信息（如目录、标签云）。

---

## 3. 技术架构 (Technical Architecture)

### 3.1 核心技术栈
*   **框架**: [Next.js](https://nextjs.org/) (App Router 架构) - 兼顾 SSG (静态生成) 与 SSR，SEO 友好。
*   **语言**: TypeScript - 保证代码健壮性。
*   **样式**: Tailwind CSS - 快速构建原子化样式，方便暗黑模式适配。
*   **动画**: Framer Motion - 实现个性化 UI 动效。
*   **内容引擎**: MDX (Markdown + JSX) - 允许在文章中嵌入 React 组件。
*   **图标库**: Lucide React 或 React Icons。

### 3.2 数据存储与管理
*   **存储方式**: 本地文件系统 (Local File System)。
*   **文件结构**: 所有文章存储在 `content/posts/*.mdx`，图片资源存储在 `public/images/` 或与文章同级目录。
*   **元数据**: 使用 Frontmatter (YAML) 定义标题、日期、标签、摘要、封面图等。

### 3.3 评论系统
*   **方案**: [Giscus](https://giscus.app/)
*   **原理**: 基于 GitHub Discussions，无广告、无跟踪、轻量级，适合开发者/设计师博客。

---

## 4. 功能模块 (Functional Requirements)

### 4.1 首页 (Home)
*   **Hero 区域**: 简短的个人介绍，带有打字机效果或个性化动画。
*   **最新文章**: 展示最近发布的 3-5 篇文章（卡片式或列表式）。
*   **社交链接**: GitHub, Twitter, Email 等入口。

### 4.2 博客文章系统 (Blog System)
*   **文章列表页**: 支持按年份/月份归档，支持无限滚动或分页。
*   **文章详情页**:
    *   支持 MDX 渲染（代码高亮、数学公式、自定义组件）。
    *   **自动目录 (TOC)**: 侧边或悬浮展示，随滚动高亮。
    *   **阅读进度条**: 顶部指示阅读进度。
    *   **元信息**: 发布时间、字数统计、预计阅读时间。
    *   **上一篇/下一篇** 导航。

### 4.3 搜索与分类 (Search & Taxonomy)
*   **全文搜索**: 客户端搜索 (如使用 Fuse.js 或简单的过滤器)，支持搜索标题和内容。
*   **标签/分类系统**: 独立的 `/tags` 或 `/categories` 页面，点击标签可筛选文章。

### 4.4 独立页面 (Pages)
*   **关于 (About)**: 个人详细介绍，经历时间轴。
*   **作品集 (Portfolio/Projects)**: 展示个人项目，图文并茂的卡片布局。

### 4.5 辅助功能
*   **主题切换器**: 顶部导航栏可见，一键切换日/夜模式。
*   **SEO 优化**: 自动生成 Sitemap, RSS Feed, Open Graph 图片 (用于社交媒体分享)。

---

## 5. 目录结构规划 (Directory Structure)

```
.
├── app/                 # Next.js App Router 页面逻辑
│   ├── blog/            # 博客列表与详情页
│   ├── tags/            # 标签页
│   ├── projects/        # 作品集
│   ├── layout.tsx       # 全局布局 (Header, Footer)
│   └── page.tsx         # 首页
├── components/          # React 组件
│   ├── ui/              # 通用 UI (Button, Card...)
│   ├── mdx/             # MDX 自定义组件
│   └── layout/          # 布局组件
├── content/             # 本地 MDX 数据
│   ├── posts/           # 文章文件
│   └── projects/        # 项目文件
├── public/              # 静态资源 (图片, 字体)
├── lib/                 # 工具函数 (读取 MDX, 日期格式化)
├── styles/              # 全局样式
└── tailwind.config.ts   # 样式配置
```

## 6. 开发路线图 (Roadmap)

1.  **初始化**: 搭建 Next.js + TypeScript + Tailwind 环境。
2.  **核心架构**: 实现 MDX 读取与解析逻辑 (Data Layer)。
3.  **基础页面**: 开发首页、文章列表、文章详情页静态布局。
4.  **功能完善**: 集成搜索、标签、评论系统。
5.  **UI/UX 升级**: 添加暗黑模式、Framer Motion 动画、排版微调。
6.  **SEO & 部署**: 配置元数据，生成 Sitemap，部署测试。
