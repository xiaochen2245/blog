# 个人技术博客设计文档

## 概述

使用 Next.js + Markdown 从零搭建个人技术博客，用于分享技术与个人成长相关内容。

## 技术栈

| 技术 | 选择 |
|------|------|
| 框架 | Next.js 15 (App Router) |
| 样式 | Tailwind CSS |
| 文章格式 | Markdown 文件 |
| 部署平台 | Vercel |
| 域名 | 用户已有域名 |

## 目录结构

```
blog/
├── content/
│   └── posts/           # Markdown 文章
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── page.tsx     # 首页 - 文章列表
│   │   ├── posts/
│   │   │   └── [slug]/
│   │   │       └── page.tsx  # 单篇文章
│   │   ├── about/
│   │   │   └── page.tsx      # 关于页
│   │   └── layout.tsx        # 全局布局
│   └── lib/
│       ├── posts.ts    # 文章读取工具
│       └── utils.ts    # 通用工具
├── public/              # 静态资源
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## 核心功能

### 1. 首页 (/)
- 展示文章列表
- 每篇文章显示：标题、发布日期、简介
- 支持按标签筛选

### 2. 文章页 (/posts/[slug])
- 渲染 Markdown 内容
- 代码块语法高亮
- 显示发布日期和标签

### 3. 关于页 (/about)
- 个人简介
- 联系方式或社交链接

### 4. 文章管理
- 文章以 Markdown 文件存放在 `content/posts/`
- 文件命名格式：`title-slug.md`
- Frontmatter 包含：title, date, description, tags

## 文章格式

```markdown
---
title: 我的第一篇文章
date: 2026-04-24
description: 这是文章简介
tags: [技术, 成长]
---

文章内容...
```

## 部署流程

1. 创建 GitHub 仓库
2. push 代码到仓库
3. Vercel 导入仓库
4. Vercel 控制台绑定域名
5. 自动部署完成

## 后续可扩展功能

- 搜索功能
- RSS 订阅
- 文章阅读量统计
- 深色/浅色主题切换
