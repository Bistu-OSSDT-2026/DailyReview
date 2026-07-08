# DailyReview 协作证据链索引

本文档集中记录 DailyReview 项目的主要协作证据，便于课程报告和项目复盘引用。

## 项目仓库

- 仓库：https://github.com/Bistu-OSSDT-2026/DailyReview
- 默认分支：`main`
- 协作流程：`Issue -> Branch -> Commit -> Pull Request -> Review -> CI -> Merge`

## 主要 Issue 与 PR 对照

| 模块 | Issue | Branch | PR | 状态 |
| --- | --- | --- | --- | --- |
| 项目初始化 | [#1](https://github.com/Bistu-OSSDT-2026/DailyReview/issues/1) | `chore/init-project` | [#2](https://github.com/Bistu-OSSDT-2026/DailyReview/pull/2) | merged |
| GitHub Actions CI | [#3](https://github.com/Bistu-OSSDT-2026/DailyReview/issues/3) | `ci/github-actions` | [#4](https://github.com/Bistu-OSSDT-2026/DailyReview/pull/4) | merged |
| Supabase 数据库基础 | [#7](https://github.com/Bistu-OSSDT-2026/DailyReview/issues/7) | `feature/supabase-schema` | [#5](https://github.com/Bistu-OSSDT-2026/DailyReview/pull/5) / [#8](https://github.com/Bistu-OSSDT-2026/DailyReview/pull/8) | merged |
| 登录鉴权与数据访问层 | [#9](https://github.com/Bistu-OSSDT-2026/DailyReview/issues/9) | `feature/auth-and-data-layer` | [#6](https://github.com/Bistu-OSSDT-2026/DailyReview/pull/6) / [#10](https://github.com/Bistu-OSSDT-2026/DailyReview/pull/10) | merged |
| 管理端复盘编辑器 | [#13](https://github.com/Bistu-OSSDT-2026/DailyReview/issues/13) | `feature/admin-editor` | [#14](https://github.com/Bistu-OSSDT-2026/DailyReview/pull/14) | merged |
| 首页热力图和统计组件 | [#17](https://github.com/Bistu-OSSDT-2026/DailyReview/issues/17) | `feature/home-heatmap-member-c` | [#18](https://github.com/Bistu-OSSDT-2026/DailyReview/pull/18) | merged |
| 公开复盘列表和详情页 | [#19](https://github.com/Bistu-OSSDT-2026/DailyReview/issues/19) | `feature/public-review-pages-member-d` | [#20](https://github.com/Bistu-OSSDT-2026/DailyReview/pull/20) | merged |
| 首页最终集成 | [#21](https://github.com/Bistu-OSSDT-2026/DailyReview/issues/21) | `feature/home-integration` | [#22](https://github.com/Bistu-OSSDT-2026/DailyReview/pull/22) | merged |
| 管理端 Supabase 真实写入 | [#23](https://github.com/Bistu-OSSDT-2026/DailyReview/issues/23) | `feature/admin-supabase-integration` | [#24](https://github.com/Bistu-OSSDT-2026/DailyReview/pull/24) | merged |
| 贡献流程文档 | [#25](https://github.com/Bistu-OSSDT-2026/DailyReview/issues/25) | `docs/contributing-guide` | [#26](https://github.com/Bistu-OSSDT-2026/DailyReview/pull/26) | merged |
| README 与 CHANGELOG 收尾 | [#27](https://github.com/Bistu-OSSDT-2026/DailyReview/issues/27) | `docs/readme-changelog` | [#28](https://github.com/Bistu-OSSDT-2026/DailyReview/pull/28) | merged |
| 发布说明与证据链索引 | [#29](https://github.com/Bistu-OSSDT-2026/DailyReview/issues/29) | `docs/release-evidence` | [#30](https://github.com/Bistu-OSSDT-2026/DailyReview/pull/30) | in progress |

## 代表性 Review 与问题处理

| 证据 | 链接 | 说明 |
| --- | --- | --- |
| Supabase schema Review | [PR #5](https://github.com/Bistu-OSSDT-2026/DailyReview/pull/5) | Reviewer 提出 `user_id not null`、表级 grant 和仓库文件清理建议，作者提交修复后通过 Review。 |
| 管理端编辑器 Review | [PR #14](https://github.com/Bistu-OSSDT-2026/DailyReview/pull/14) | Reviewer 要求补充 Issue 关联并同步首页结构文案，作者随后提交修复 commit。 |
| 贡献流程文档 Review | [PR #26](https://github.com/Bistu-OSSDT-2026/DailyReview/pull/26) | Review 检查了 Issue、Branch、PR、Review、CI、Merge 流程说明和密钥提交约束。 |

## 自动化质量保障

项目使用 GitHub Actions 执行 `quality-check`，主要步骤包括：

- `npm ci`
- `npm run lint`
- `npm run build`

CI 配置文件：`.github/workflows/ci.yml`

## 成员参与证据

| GitHub 账号 | 代表性工作 |
| --- | --- |
| `TaiYang-cs` | 项目协调、主线集成、PR Review、文档收尾和版本准备。 |
| `MaTsuR1-Official` | Supabase schema、RLS 策略和贡献流程文档。 |
| `BistuilderH` | GitHub Actions CI、首页热力图和统计组件。 |
| `Nnning223` | 管理端复盘编辑器和相关文案修复。 |
| `ZZQ-1215` | 公开复盘列表和详情页。 |
