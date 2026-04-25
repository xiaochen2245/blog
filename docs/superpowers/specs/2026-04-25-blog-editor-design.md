# 博客在线编辑器设计文档

## 概述

为博客添加在线文章管理功能，用户可直接在前台界面进行文章的创建、编辑、删除操作。

## 技术方案

### 技术栈

- **数据库**: Vercel Postgres (Serverless PostgreSQL)
- **编辑器**: 富文本编辑器 (Tiptap/Quill)
- **API**: Next.js API Routes
- **托管**: Vercel (保持现有架构)

### 架构

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│  博客前端    │ ←──→ │  Vercel API  │ ←──→ │  Vercel Postgres │
│  (现有)      │      │  Routes      │      │  (数据库)        │
└─────────────┘      └──────────────┘      └─────────────────┘
                            ↑
                            │
                     ┌──────┴──────┐
                     │   编辑器页面   │
                     │  (密码保护)   │
                     └─────────────┘
```

## 数据模型

### posts 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL | 主键 |
| slug | VARCHAR(255) | URL 唯一标识 |
| title | VARCHAR(255) | 文章标题 |
| description | TEXT | 文章描述 |
| content | TEXT | HTML 富文本内容 |
| tags | TEXT[] | 标签数组 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

## 页面设计

### 1. 文章编辑器 (`/editor`)

- 功能：新建/编辑文章
- 权限：密码保护
- 编辑器：富文本编辑器，支持插入图片 URL

### 2. 文章管理 (`/manage`)

- 功能：文章列表展示 + 删除操作
- 权限：密码保护

### 3. 文章详情 (`/posts/[slug]`)

- 功能：已有文章详情展示
- 权限：公开访问

## API 设计

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | `/api/posts` | 获取文章列表 |
| GET | `/api/posts/[slug]` | 获取单篇文章 |
| POST | `/api/posts` | 创建文章 |
| PUT | `/api/posts/[slug]` | 更新文章 |
| DELETE | `/api/posts/[slug]` | 删除文章 |

### 密码验证

- 密码存储在 Vercel 环境变量 `EDITOR_PASSWORD`
- API 请求时通过 Header 传递密码进行验证

## 环境变量

| 变量名 | 说明 |
|--------|------|
| `POSTGRES_URL` | Vercel Postgres 连接地址 |
| `POSTGRES_PRISMA_URL` | Prisma 连接 URL |
| `EDITOR_PASSWORD` | 编辑器访问密码 |

## 实现步骤

1. 创建 Vercel Postgres 数据库
2. 创建数据库连接模块 `src/lib/db.ts`
3. 创建数据库表 `posts`
4. 实现 API Routes
5. 创建密码保护中间件
6. 创建文章编辑器页面
7. 创建文章管理页面
8. 配置环境变量
