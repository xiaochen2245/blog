# Vercel Postgres 数据库设置指南

本指南帮助你完成 Vercel Postgres 数据库的创建和配置。

---

## 前提条件

- 一个 Vercel 账号
- 一个 Vercel 项目（如果你还没有，可以先创建一个空项目）

---

## 第一步：在 Vercel Dashboard 创建数据库

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)

2. 进入你的项目页面，点击顶部的 **Storage** 标签

3. 点击 **Create Database** 按钮

4. 在弹出的对话框中：
   - 选择 **Vercel Postgres**（Serverless PostgreSQL）
   - 选择数据库要关联的项目（如果还没关联）
   - 为数据库选择一个区域（Region），建议选择离你最近的区域

5. 点击 **Create** 等待数据库创建完成

---

## 第二步：获取连接字符串

数据库创建完成后，按照以下步骤获取连接字符串：

1. 在 Storage 页面，点击你创建的数据库

2. 进入 **Connection** 选项卡

3. 找到 **Connection String** 或 **Prisma** 字段

4. 点击 **Copy** 按钮复制连接字符串

连接字符串格式如下：
```
postgresql://default:xxxxxxxxxxxx@xxxxxxxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require
```

---

## 第三步：配置环境变量

### 在 Vercel 上配置（生产环境）

1. 进入项目的 **Settings** 页面

2. 点击左侧 **Environment Variables**

3. 添加以下变量：
   - **Name**: `POSTGRES_URL`
   - **Value**: 粘贴你复制的连接字符串
   - **Environments**: 选择 `Production`, `Preview`, `Development`（全选）

4. 点击 **Save** 保存

> 注意：如果修改了环境变量，需要重新部署才能生效

### 本地开发配置

1. 在项目根目录创建 `.env.local` 文件（如果不存在）

2. 添加以下内容：
   ```
   POSTGRES_URL="postgresql://default:xxxxxxxxxxxx@xxxxxxxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require"
   ```

3. 将 `.env.local` 添加到 `.gitignore`，确保不提交到 Git：
   ```
   .env.local
   ```

---

## 验证配置

配置完成后，你可以运行以下命令验证数据库连接：

```bash
npx prisma db push
```

如果连接成功，会显示：
- `The database is now in sync with the Prisma schema`
- 不会显示任何错误

---

## 常见问题

### Q: 连接字符串包含特殊字符怎么办？

如果密码包含特殊字符（如 `@`、`#`、`/` 等），URL 编码会将这些字符转换为 `%40`、`%23`、`%2F` 等形式。确保复制的是完整编码后的字符串。

### Q: 本地连接失败？

1. 确认 `.env.local` 文件路径正确（在项目根目录）
2. 确认环境变量名称是 `POSTGRES_URL`（大小写敏感）
3. 重新运行 `npx prisma db push` 测试连接

### Q: 如何重新获取连接字符串？

在 Vercel Dashboard 的 Storage 页面，点击数据库 → Connection → 重新复制连接字符串。

---

## 后续步骤

完成数据库设置后，继续执行以下步骤：

1. 创建数据库连接模块（`src/lib/db.ts`）
2. 创建 Prisma Schema（`prisma/schema.prisma`）
3. 运行 `npx prisma generate` 生成客户端
4. 运行 `npx prisma db push` 创建数据表

详见 [博客编辑器实现计划](./superpowers/plans/2026-04-25-blog-editor-implementation.md)
