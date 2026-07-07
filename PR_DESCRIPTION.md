Closes #3

本次完成：
- 添加 reviews 表结构
- 添加 RLS 权限策略
- 添加 seed 测试数据
- 添加 Supabase 初始化说明

如何测试：
- 在 Supabase SQL Editor 执行 schema.sql
- 确认 reviews 表、索引、RLS 策略存在
- 执行 seed.sql 插入测试数据

Review 安排：
- 成员 T 检查字段是否满足后续数据访问层。
- 成员 A 检查字段是否满足编辑表单。
- 成员 C 检查是否能支持热力图按日期统计。
- 成员 D 检查是否能支持公开页面读取 is_public = true 数据。

完成标准：
数据库结构和权限说明能直接用于报告。
