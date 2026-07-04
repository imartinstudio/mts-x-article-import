# mts-x-article-import

**X Article Import** — 独立的 Chrome MV3 扩展：将本地 Markdown 文件导入 X (Twitter) Articles 草稿编辑器。

从内部 monorepo 拆分独立维护，零外部运行时依赖。许可证：[MIT](LICENSE)

## 功能

- 在 `x.com/compose/articles` 编辑器上挂载「导入 Markdown」按钮
- 解析 Markdown（标题、正文、封面图、内容图片/视频、代码块、分割线）
- 针对 X Premium / Premium+ 订阅层级自动适配（表格转图、深层标题扁平化、Mermaid 提示）
- 通过 MAIN world 脚本将草稿写入 X 编辑器

## 目录结构

```
src/
  core/        领域逻辑（Markdown 解析、X 适配，自原 monorepo core 包内联）
  ui/          导入对话框、加载态、按钮样式（原生 DOM）
  services/    扩展运行时抽象（chrome.storage / localStorage）
  utils/       深度 DOM 查询、MAIN world 消息常量
  dom/         X 编辑器 DOM 定位与写入适配层
  files/       本地媒体文件注册与导入准备
  import/      Markdown → 草稿写入 payload 转换
  render/      表格 / Mermaid 转 PNG
  content/     content script 入口
  background/  MV3 service worker（MAIN world 注入桥）
  main-world/  MAIN world 草稿写入器
tests/         smoke 测试
privacy/       隐私政策页面（随构建打包）
screenshots/   Chrome 商店截图 demo 与推广图
```

## 开发

```bash
pnpm install
pnpm typecheck     # tsc --noEmit（strict）
pnpm test          # vitest（jsdom）
pnpm build         # esbuild → dist/（可加载的未打包扩展）
pnpm test:smoke    # 入口 smoke 测试 + dist 产物校验
```

构建后在 Chrome `chrome://extensions` 中「加载已解压的扩展程序」选择 `dist/` 目录。

## 发布

维护者打 tag 后，GitHub Actions 会自动构建并发布扩展 zip（见 [CONTRIBUTING.md](CONTRIBUTING.md)）。商店文案与截图说明见 [STORE_LISTING.md](STORE_LISTING.md)。
