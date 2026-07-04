# Contributing

感谢关注 **X Article Import**（`mts-x-article-import`）。

## 开发环境

- Node.js 22+
- pnpm 10+

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm test:smoke
```

## 提交 PR 前

1. 改动需通过 `pnpm typecheck` 与 `pnpm test`
2. 涉及入口或构建时额外跑 `pnpm build && pnpm test:smoke`
3. 保持改动聚焦，避免无关重构
4. PR 描述请说明问题背景与验证方式

## 发布（维护者）

打 tag 触发 Release 工作流，自动构建并上传扩展 zip：

```bash
git tag v0.2.0
git push origin v0.2.0
```

## 许可证

贡献即表示同意以 [MIT](LICENSE) 许可发布。
