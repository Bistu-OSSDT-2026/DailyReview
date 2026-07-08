# Contributing to DailyReview

感谢参与 DailyReview 项目。本文档用于说明团队成员如何在本仓库中提交任务、创建分支、发起 Pull Request、完成 Review 和通过 CI 检查。

## 一、协作流程

本项目采用以下协作流程：

```text
Issue -> Branch -> Commit -> Pull Request -> Review -> CI -> Merge
```

每个功能、文档或修复任务都应先有 Issue，再从最新 `main` 创建独立分支进行开发。完成后提交 Pull Request，并在 PR 中关联对应 Issue。

## 二、领取 Issue

1. 在 GitHub Issues 中查看待完成任务。
2. 确认任务范围后，将自己设置为 Assignee。
3. 检查 Issue 是否设置了合适的 Labels 和 Milestone。
4. 开始开发前确认本地 `main` 已同步最新远端代码。

## 三、分支命名

建议使用以下分支命名方式：

```text
feature/功能名称
fix/问题名称
docs/文档名称
ci/CI相关任务
```

示例：

```text
docs/contributing-guide
feature/admin-supabase-integration
fix/homepage-structure-copy
```

## 四、提交信息规范

commit message 建议使用简洁的类型前缀：

```text
feat: 新功能
fix: 修复问题
docs: 文档修改
ci: CI 配置
chore: 项目维护
```

示例：

```text
docs: add contributing guide
feat: connect admin editor to Supabase
fix: handle public review detail edge cases
```

## 五、Pull Request 要求

提交 PR 时，请确保正文开头关联对应 Issue：

```md
Closes #Issue编号
```

PR 正文建议包含：

```md
## Summary

- 本次修改完成了什么
- 修改了哪些主要文件
- 对项目有什么影响

## Test

- npm run lint
- npm run build

## Notes

- 是否需要配置 Supabase
- 是否涉及环境变量
- 是否有后续事项
```

## 六、提交前检查

在提交 PR 前，至少运行：

```bash
npm run lint
npm run build
```

如果本地没有 Supabase 环境变量，构建仍应通过；但登录、读取和写入真实数据功能需要配置 `.env.local` 后才能完整验证。

## 七、Review 要求

每个 PR 至少应由一名其他成员检查。Review 重点包括：

- 是否正确关联 Issue。
- 修改范围是否符合任务目标。
- 是否通过 `npm run lint` 和 `npm run build`。
- 是否存在明显的功能问题或文档遗漏。
- 是否提交了不应提交的本地文件或密钥。

文档 PR 可以由不同成员按模块 Review：

| 成员 | Review 重点 |
| --- | --- |
| 成员 A | 管理端编辑器、表单交互、管理端说明 |
| 成员 B | Supabase、RLS、环境变量和安全说明 |
| 成员 C | 测试流程、CI、构建命令和验收说明 |
| 成员 D | Issue、PR、Review、CHANGELOG 和开源协作流程 |
| 成员 T | 整体结构、最终合并和发布检查 |

## 八、环境变量与密钥安全

严禁提交以下内容：

```text
.env
.env.local
.env.development.local
.env.production.local
Supabase service_role key
数据库密码
Vercel token
任何真实密钥或私人账号信息
```

可以提交的是：

```text
.env.example
README.md 中的占位变量名
配置说明文档
```

Supabase 环境变量应只放在本地 `.env.local` 或 Vercel Environment Variables 中：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

## 九、Supabase 与部署说明

DailyReview 的完整功能依赖 Supabase：

- 登录功能需要 Supabase Auth。
- 复盘数据读取和写入需要 `reviews` 表。
- 权限控制依赖 `schema.sql` 中的 RLS 策略。
- 线上部署需要在 Vercel 中配置 Supabase 环境变量。

如果没有配置 Supabase，项目页面和构建可以正常验证，但真实登录、读取和写入功能无法完整使用。

## 十、合并规则

PR 合并前应满足：

1. PR 已关联 Issue。
2. CI 检查通过。
3. Review 已完成。
4. 没有提交本地环境文件或真实密钥。
5. 修改范围符合任务目标。

合并后，对应 Issue 应自动关闭，形成完整协作证据链。