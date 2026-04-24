# Personal Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建一个 Next.js + Markdown 的个人技术博客，支持文章列表、文章详情、关于页，部署到 Vercel

**Architecture:** 使用 Next.js 15 App Router，文章以 Markdown 文件存储在 content/posts/，通过 lib/posts.ts 读取和解析，Tailwind CSS 样式，Vercel 静态部署

**Tech Stack:** Next.js 15, React 19, Tailwind CSS, gray-matter (Markdown frontmatter), remark/rehype (Markdown 渲染), rehype-highlight (代码高亮), Vercel

---

## File Structure

```
blog/
├── content/
│   └── posts/
│       ├── hello-world.md
│       └── my-tech-journey.md
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── posts/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   └── lib/
│       ├── posts.ts
│       └── utils.ts
├── public/
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## Task 1: 初始化项目

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/lib/utils.ts`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "personal-blog",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "gray-matter": "^4.0.3",
    "remark": "^15.0.1",
    "remark-rehype": "^11.0.0",
    "rehype-highlight": "^7.0.0",
    "rehype-stringify": "^11.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/typography": "^0.5.0",
    "typescript": "^5.0.0"
  }
}
```

- [ ] **Step 2: 创建 next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: 创建 tailwind.config.ts**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
```

- [ ] **Step 5: 创建 postcss.config.js**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 6: 创建 src/app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 代码高亮样式 */
@import "highlight.js/styles/github.css";

:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 255, 255, 255;
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
}
```

- [ ] **Step 7: 创建 src/app/layout.tsx**

```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "我的博客",
  description: "技术分享与个人成长",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="max-w-3xl mx-auto px-4 py-8">{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: 创建 src/lib/utils.ts**

```typescript
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
```

- [ ] **Step 9: 安装依赖**

Run: `npm install`
Expected: 安装成功，生成 node_modules

- [ ] **Step 10: 提交**

```bash
git add package.json next.config.ts tsconfig.json tailwind.config.ts postcss.config.js src/app/globals.css src/app/layout.tsx src/lib/utils.ts
git commit -m "feat: initialize Next.js project with Tailwind"
```

---

## Task 2: 实现文章读取功能

**Files:**
- Create: `src/lib/posts.ts`
- Create: `content/posts/hello-world.md`
- Create: `content/posts/my-tech-journey.md`

- [ ] **Step 1: 创建 src/lib/posts.ts**

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
}

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"));
}

export function getPostBySlug(slug: string): Post {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    title: data.title,
    date: data.date,
    description: data.description,
    tags: data.tags || [],
    content,
  };
}

export async function getPostContent(slug: string): Promise<string> {
  const post = getPostBySlug(slug);
  const processedContent = await remark()
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(post.content);
  return processedContent.toString();
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  return slugs
    .map((slug) => getPostBySlug(slug))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}
```

- [ ] **Step 2: 创建 content/posts/hello-world.md**

```markdown
---
title: 你好，世界
date: 2026-04-24
description: 我的第一篇博客文章
tags: [随笔]
---

# 你好，世界

这是我的第一篇博客文章。从今天开始，我会在这个博客分享技术与个人成长的心得。

## 为什么写博客

1. 整理思路
2. 帮助他人
3. 建立个人品牌

让我们开始吧！
```

- [ ] **Step 3: 创建 content/posts/my-tech-journey.md（带代码块）**

```markdown
---
title: 我的技术成长之路
date: 2026-04-20
description: 回顾我从零开始学习技术的经历
tags: [技术, 成长]
---

# 我的技术成长之路

从懵懂入门到找到方向，这是一段漫长的旅程。

## 初识编程

最初接触编程是在大学时代，当时觉得代码晦涩难懂。

## 突破阶段

通过不断练习和项目实战，终于找到了感觉。以下是一个简单的 Python 示例：

```python
def hello():
    print("Hello, World!")
```

## 未来计划

- 深入学习系统设计
- 贡献开源项目
- 分享更多技术文章
```

- [ ] **Step 4: 提交**

```bash
git add src/lib/posts.ts content/posts/hello-world.md content/posts/my-tech-journey.md
git commit -m "feat: add post reading utilities and sample posts"
```

---

## Task 3: 实现首页

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/page.tsx`

- [ ] **Step 1: 创建 src/app/page.tsx（带标签筛选）**

```typescript
import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

interface HomeProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { tag: selectedTag } = await searchParams;
  const posts = getAllPosts();
  const allTags = getAllTags();

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  return (
    <main>
      <header className="mb-12">
        <h1 className="text-3xl font-bold mb-2">我的博客</h1>
        <p className="text-gray-600">技术分享与个人成长</p>
      </header>

      {/* 标签筛选 */}
      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              !selectedTag
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            全部
          </Link>
          {allTags.map((tag) => (
            <Link
              key={tag}
              href={`/?tag=${encodeURIComponent(tag)}`}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedTag === tag
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {tag}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6">
          {selectedTag ? `${selectedTag} 分类下的文章` : "最新文章"}
        </h2>
        <div className="space-y-8">
          {filteredPosts.length === 0 ? (
            <p className="text-gray-500">暂无文章</p>
          ) : (
            filteredPosts.map((post) => (
              <article key={post.slug} className="border-b border-gray-200 pb-6">
                <Link href={`/posts/${post.slug}`} className="block group">
                  <h3 className="text-xl font-medium group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{post.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <time>{formatDate(post.date)}</time>
                    {post.tags.length > 0 && (
                      <div className="flex gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 px-2 py-0.5 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: 更新 src/app/layout.tsx 添加导航**

```typescript
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "我的博客",
  description: "技术分享与个人成长",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="max-w-3xl mx-auto px-4 py-8">
        <nav className="flex gap-6 mb-8 text-sm">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            首页
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors">
            关于
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: 运行开发服务器验证**

Run: `npm run dev`
Expected: 首页显示文章列表，无报错

- [ ] **Step 4: 提交**

```bash
git add src/app/page.tsx src/app/layout.tsx
git commit -m "feat: add home page with post list"
```

---

## Task 4: 实现文章详情页

**Files:**
- Create: `src/app/posts/[slug]/page.tsx`

- [ ] **Step 1: 创建 src/app/posts/[slug]/page.tsx**

```typescript
import Link from "next/link";
import { getPostSlugs, getPostContent, getPostBySlug } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug: slug.replace(".md", "") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const content = await getPostContent(slug);

  return (
    <article>
      <header className="mb-8">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:underline mb-4 inline-block"
        >
          ← 返回列表
        </Link>
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <time>{formatDate(post.date)}</time>
          {post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 px-2 py-0.5 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
```

- [ ] **Step 2: 添加 Tailwind typography 插件**

Update `tailwind.config.ts` to include `@tailwindcss/typography` plugin for prose styling.

- [ ] **Step 3: 运行开发服务器验证**

Run: `npm run dev`
Expected: 点击文章标题进入详情页，Markdown 正确渲染

- [ ] **Step 4: 提交**

```bash
git add src/app/posts/[slug]/page.tsx
git commit -m "feat: add post detail page"
```

---

## Task 5: 实现关于页

**Files:**
- Create: `src/app/about/page.tsx`

- [ ] **Step 1: 创建 src/app/about/page.tsx**

```typescript
export default function About() {
  return (
    <main>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">关于我</h1>
      </header>

      <section className="space-y-4 text-gray-700">
        <p>
          你好！我是一名软件开发者，热爱技术，享受通过代码解决实际问题的过程。
        </p>
        <p>
          这个博客用来记录我在技术学习和个人成长过程中的心得体会。希望这些内容能对你有所帮助。
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">技术栈</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>前端：React, Next.js, TypeScript</li>
          <li>后端：Node.js, Python</li>
          <li>工具：Git, Docker, Linux</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">联系我</h2>
        <p>
          如果你有任何问题或建议，欢迎通过以下方式联系：
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>邮箱：your.email@example.com</li>
          <li>GitHub：github.com/yourusername</li>
        </ul>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: 运行开发服务器验证**

Run: `npm run dev`
Expected: /about 页面正常显示

- [ ] **Step 3: 提交**

```bash
git add src/app/about/page.tsx
git commit -m "feat: add about page"
```

---

## Task 6: 构建和部署

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: 创建 .gitignore**

```
node_modules
.next
out
.env
.env.local
```

- [ ] **Step 2: 本地构建测试**

Run: `npm run build`
Expected: 构建成功，生成 out 目录

- [ ] **Step 3: 提交所有更改**

```bash
git add .gitignore
git commit -m "chore: add gitignore"
```

- [ ] **Step 4: 输出部署指南**

部署到 Vercel：

1. GitHub 创建新仓库
2. push 代码：`git remote add origin <your-repo-url> && git push -u origin master`
3. 访问 [vercel.com](https://vercel.com)，用 GitHub 登录
4. 点击 "New Project"，导入你的仓库
5. Framework Preset 选择 "Next.js"（会自动检测）
6. 点击 "Deploy"
7. 部署完成后，进入项目 Settings → Domains，添加你的域名
8. 按 Vercel 提示配置 DNS 记录

---

## 后续可扩展功能

- [ ] 深色/浅色主题切换
- [ ] 文章搜索功能
- [ ] RSS 订阅
- [ ] 文章阅读量统计
