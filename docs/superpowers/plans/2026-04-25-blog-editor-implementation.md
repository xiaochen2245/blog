# 博客编辑器实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为博客添加在线文章管理功能，包括 Vercel Postgres 数据库集成、富文本编辑器、密码保护的编辑/管理页面。

**Architecture:** 使用 Next.js API Routes 连接 Vercel Postgres，编辑器页面使用 Tiptap 富文本编辑器，通过环境变量存储密码保护管理页面。

**Tech Stack:** Vercel Postgres, Tiptap (富文本编辑器), Next.js API Routes, Prisma (可选或直接用 pg)

---

## 文件结构

```
src/
├── lib/
│   ├── db.ts                 # 数据库连接
│   └── password.ts           # 密码验证
├── middleware.ts             # 路由中间件（密码保护）
├── app/
│   ├── api/
│   │   └── posts/
│   │       ├── route.ts      # GET(列表) / POST(创建)
│   │       └── [slug]/
│   │           └── route.ts  # GET / PUT / DELETE
│   ├── editor/
│   │   └── page.tsx          # 文章编辑器
│   ├── manage/
│   │   └── page.tsx          # 文章管理（列表+删除）
│   └── posts/
│       └── [slug]/
│           └── page.tsx      # 已有文章详情（修改为从数据库读取）
```

---

## 实现步骤

### 阶段 1: 数据库设置

#### Task 1: 创建 Vercel Postgres 数据库

**Files:**
- Modify: `.env.local` (本地开发用)
- Create: `docs/db-setup.md` (数据库创建指南)

- [ ] **Step 1: 记录数据库创建步骤**

创建 `docs/db-setup.md`，内容包括：
1. 在 Vercel Dashboard 创建 Vercel Postgres 数据库
2. 获取连接字符串
3. 本地开发时设置 `POSTGRES_URL` 环境变量

#### Task 2: 创建数据库连接模块

**Files:**
- Create: `src/lib/db.ts`

- [ ] **Step 1: 创建数据库连接模块**

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

#### Task 3: 创建 Prisma Schema

**Files:**
- Create: `prisma/schema.prisma`

- [ ] **Step 1: 创建 Prisma Schema**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("POSTGRES_URL")
}

model Post {
  id          Int      @id @default(autoincrement())
  slug        String   @unique
  title       String
  description String?
  content     String   @db.Text
  tags        String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

- [ ] **Step 2: 安装 Prisma**

```bash
npm install prisma @prisma/client
npx prisma generate
```

- [ ] **Step 3: 创建数据库表**

```bash
npx prisma db push
```

- [ ] **Step 4: 提交**

```bash
git add prisma/schema.prisma src/lib/db.ts
git commit -m "feat: 添加 Prisma 和 Vercel Postgres 配置"
```

---

### 阶段 2: API Routes

#### Task 4: 创建文章列表 API (GET /api/posts)

**Files:**
- Create: `src/app/api/posts/route.ts`

- [ ] **Step 1: 创建 GET /api/posts**

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      slug: true,
      title: true,
      description: true,
      tags: true,
      createdAt: true,
    },
  });
  return NextResponse.json(posts);
}
```

- [ ] **Step 2: 提交**

```bash
git add src/app/api/posts/route.ts
git commit -m "feat: 添加获取文章列表 API"
```

#### Task 5: 创建文章详情 API (GET /api/posts/[slug])

**Files:**
- Create: `src/app/api/posts/[slug]/route.ts`

- [ ] **Step 1: 创建 GET /api/posts/[slug]**

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });
  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(post);
}
```

- [ ] **Step 2: 提交**

```bash
git add src/app/api/posts/[slug]/route.ts
git commit -m "feat: 添加获取单篇文章 API"
```

#### Task 6: 创建文章创建 API (POST /api/posts)

**Files:**
- Modify: `src/app/api/posts/route.ts`

- [ ] **Step 1: 添加 POST 处理器**

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const body = await request.json();
  const { title, slug, description, content, tags } = body;

  if (!title || !slug || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: { title, slug, description, content, tags },
  });

  return NextResponse.json(post, { status: 201 });
}
```

- [ ] **Step 2: 提交**

```bash
git add src/app/api/posts/route.ts
git commit -m "feat: 添加创建文章 API"
```

#### Task 7: 创建文章更新 API (PUT /api/posts/[slug])

**Files:**
- Modify: `src/app/api/posts/[slug]/route.ts`

- [ ] **Step 1: 添加 PUT 处理器**

```typescript
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const body = await request.json();
  const { title, description, content, tags } = body;

  const post = await prisma.post.update({
    where: { slug: params.slug },
    data: { title, description, content, tags },
  });

  return NextResponse.json(post);
}
```

- [ ] **Step 2: 提交**

```bash
git add src/app/api/posts/[slug]/route.ts
git commit -m "feat: 添加更新文章 API"
```

#### Task 8: 创建文章删除 API (DELETE /api/posts/[slug])

**Files:**
- Modify: `src/app/api/posts/[slug]/route.ts`

- [ ] **Step 1: 添加 DELETE 处理器**

```typescript
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  await prisma.post.delete({
    where: { slug: params.slug },
  });
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 2: 提交**

```bash
git add src/app/api/posts/[slug]/route.ts
git commit -m "feat: 添加删除文章 API"
```

---

### 阶段 3: 密码保护

#### Task 9: 创建密码验证模块

**Files:**
- Create: `src/lib/password.ts`

- [ ] **Step 1: 创建密码验证函数**

```typescript
export function verifyPassword(request: Request): boolean {
  const password = request.headers.get('x-password');
  const correctPassword = process.env.EDITOR_PASSWORD;
  
  if (!correctPassword) {
    console.error('EDITOR_PASSWORD not set');
    return false;
  }
  
  return password === correctPassword;
}
```

- [ ] **Step 2: 提交**

```bash
git add src/lib/password.ts
git commit -m "feat: 添加密码验证模块"
```

#### Task 10: 创建 API 密码保护中间件

**Files:**
- Modify: `src/app/api/posts/route.ts`
- Modify: `src/app/api/posts/[slug]/route.ts`

- [ ] **Step 1: 在 POST/PUT/DELETE 添加密码验证**

在创建、更新、删除操作前添加：
```typescript
import { verifyPassword } from '@/lib/password';

if (!verifyPassword(request)) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

- [ ] **Step 2: 提交**

```bash
git add src/app/api/posts/route.ts src/app/api/posts/[slug]/route.ts
git commit -m "feat: API 添加密码保护"
```

---

### 阶段 4: 前端页面

#### Task 11: 创建文章编辑器页面

**Files:**
- Create: `src/app/editor/page.tsx`
- Install: Tiptap 编辑器

- [ ] **Step 1: 安装 Tiptap 编辑器**

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image
```

- [ ] **Step 2: 创建编辑器页面组件**

页面包含：
- 标题输入框
- 描述输入框
- 标签输入框
- Tiptap 富文本编辑器
- 保存按钮

```typescript
// src/app/editor/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// ... Tiptap 编辑器组件
```

- [ ] **Step 3: 实现保存功能**

```typescript
const handleSave = async () => {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-password': password,
    },
    body: JSON.stringify({ title, slug, description, content, tags }),
  });
  // 处理响应
};
```

- [ ] **Step 4: 提交**

```bash
git add src/app/editor/page.tsx
git commit -m "feat: 添加文章编辑器页面"
```

#### Task 12: 创建文章管理页面

**Files:**
- Create: `src/app/manage/page.tsx`

- [ ] **Step 1: 创建管理页面组件**

页面包含：
- 密码输入框（未验证时显示）
- 文章列表（标题、日期、删除按钮）
- 新建文章链接

```typescript
// src/app/manage/page.tsx
'use client';

import { useState } from 'react';
// ... 组件实现
```

- [ ] **Step 2: 实现删除功能**

```typescript
const handleDelete = async (slug: string) => {
  await fetch(`/api/posts/${slug}`, {
    method: 'DELETE',
    headers: { 'x-password': password },
  });
  // 刷新列表
};
```

- [ ] **Step 3: 提交**

```bash
git add src/app/manage/page.tsx
git commit -m "feat: 添加文章管理页面"
```

#### Task 13: 修改文章详情页支持数据库

**Files:**
- Modify: `src/app/posts/[slug]/page.tsx`

- [ ] **Step 1: 修改为从 API 读取数据**

将 `getPostBySlug` 改为调用 API：
```typescript
const post = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${slug}`)
  .then(res => res.json());
```

- [ ] **Step 2: 提交**

```bash
git add src/app/posts/[slug]/page.tsx
git commit -m "feat: 文章详情页支持数据库"
```

---

### 阶段 5: 导航栏入口

#### Task 14: 在导航栏添加入口

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: 添加管理入口链接**

在导航栏添加 `./manage` 链接（hover 时显示，视觉上不那么突兀）

- [ ] **Step 2: 提交**

```bash
git add src/app/layout.tsx
git commit -m "feat: 导航栏添加入口"
```

---

### 阶段 6: 环境变量配置

#### Task 15: 配置环境变量

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: 创建环境变量示例文件**

```bash
# Vercel Postgres
POSTGRES_URL="postgresql://..."

# Editor Password
EDITOR_PASSWORD="your-secure-password"
```

- [ ] **Step 2: 提交**

```bash
git add .env.example
git commit -m "docs: 添加环境变量示例"
```

---

## 总结

完成后博客将支持：
- `/editor` - 新建文章（密码保护）
- `/manage` - 管理文章列表+删除（密码保护）
- `/posts/[slug]` - 公开访问文章详情

数据库操作通过 Vercel Postgres，无额外服务器成本。
