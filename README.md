# Sinlair GitHub Pages Portfolio

这是 `Sinlair` 的 GitHub Pages 作品集站点仓库。

站点目前是一个纯静态的单屏作品集主页，配合 3 个 section redirect 页面，用来展示：

- 个人公开方向
- 代表项目
- 项目阅读路径
- GitHub 与项目入口

## 页面结构

- `index.html`
  主站首页。一屏内完成定位、项目、方法和入口的表达。
- `about.html`
  跳转页，重定向到 `index.html#approach`，用于兼容旧链接和直接访问。
- `projects.html`
  跳转页，重定向到 `index.html#projects`。
- `contact.html`
  跳转页，重定向到 `index.html#links`。
- `styles.css`
  首页主样式，负责单屏布局、视觉层次和响应式适配。
- `script.js`
  负责年份更新、分区切换、hash 同步和轻量 reveal。
- `favicon.svg`
  站点图标。
- `.nojekyll`
  避免 GitHub Pages 以 Jekyll 方式处理站点。

## 当前设计方向

这版站点强调：

- 单屏进入，而不是多页面分散跳转
- 信息优先，而不是堆叠动效
- 先讲项目作用，再讲实现细节
- 通过统一的排版、间距和卡片系统建立整体感
- 保留旧 URL，同时把阅读路径收束回首页

首页目前采用：

- Hero
- Interface Map
- Projects
- Approach
- Links

## 当前代表项目

### ReAgent

- 定位：面向研究工作流的 local-first runtime 与 CLI
- 技术栈：Node.js、TypeScript、Prisma、CLI runtime、workspace memory
- 关键词：visible state、durable outputs、unified runtime

### TravelAgent

- 定位：围绕旅行规划场景构建的多步骤工作台
- 技术栈：Java 21、Spring Boot、Spring AI、Vue 3、Vite、SQLite、Amap
- 关键词：specialist routing、grounded enrichment、product-shaped workflow

## 本地预览

这是纯静态站点，不需要安装依赖。

推荐直接打开：

- `index.html`

如果要验证旧入口是否还可用，也可以分别打开：

- `about.html`
- `projects.html`
- `contact.html`

## 线上地址

- Home: `https://sinlair.github.io/`
- About Redirect: `https://sinlair.github.io/about.html`
- Projects Redirect: `https://sinlair.github.io/projects.html`
- Contact Redirect: `https://sinlair.github.io/contact.html`

## 部署方式

仓库已经连接到 GitHub Pages：

- Remote: `Sinlair/Sinlair.github.io`
- Branch: `main`

常用更新流程：

```powershell
git add .
git commit -m "update site"
git push
```

推送到 `main` 后，GitHub Pages 会自动发布。

## 备注

- 站点公开名称使用 `Sinlair`
- 页面不暴露真实姓名
- 旧页面路径仍然保留，但实际内容已集中到首页单屏结构
- 项目入口的目标是先建立上下文，再引导进入源码
