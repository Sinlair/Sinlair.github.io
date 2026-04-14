# GitHub Pages 主页模板

这个目录已经是一套可直接发布的静态主页。

## 目录

- `index.html`
- `styles.css`
- `script.js`
- `.nojekyll`

## 你先改这几个地方

打开 `index.html`，把这些占位内容替换掉：

- `你的名字`
- `你的GitHub用户名`
- `you@example.com`
- `项目名称 A / B / C`

## 怎么发布到 GitHub Pages

1. 去 GitHub 新建一个公开仓库。
2. 仓库名必须是 `你的GitHub用户名.github.io`。
3. 把这个目录里的文件上传到仓库根目录。
4. 如果 GitHub 没自动发布，就到 `Settings -> Pages`。
5. 在 `Build and deployment` 里选择：
   - `Source: Deploy from a branch`
   - `Branch: main`
   - `Folder: /(root)`
6. 保存后等待几分钟。
7. 访问 `https://你的GitHub用户名.github.io/`

## 如果你想用 git 命令上传

把下面命令里的 `你的GitHub用户名` 改掉，然后在这个目录执行：

```powershell
git init
git add .
git commit -m "Initial GitHub Pages homepage"
git branch -M main
git remote add origin https://github.com/你的GitHub用户名/你的GitHub用户名.github.io.git
git push -u origin main
```

## 备注

- 这是纯静态页面，不需要安装依赖。
- GitHub Pages 对这种站点最省事。
- `.nojekyll` 用来避免 GitHub Pages 按 Jekyll 方式处理站点。
