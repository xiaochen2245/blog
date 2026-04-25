# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal blog with a dark terminal/cyberpunk aesthetic, built with Next.js and deployed on Vercel. Posts are authored in Markdown and processed at build time.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm start        # Start production server
```

## Architecture

### Static Generation
The blog uses `output: "export"` in `next.config.ts` for full static HTML generation. This means:
- All pages are pre-rendered at build time
- No server-side rendering at runtime
- API routes cannot be used in the traditional sense with static export

### Content Pipeline
Posts live in `content/posts/*.md` and are processed at build time:
1. `gray-matter` parses frontmatter (title, date, description, tags)
2. `remark` converts Markdown to AST
3. `remark-rehype` converts to rehype AST
4. `rehype-highlight` applies syntax highlighting
5. `rehype-stringify` outputs HTML

The `src/lib/posts.ts` module provides `getAllPosts()`, `getPostBySlug()`, and `getPostSlugs()` for data access.

### Styling
- Tailwind CSS with custom theme in `tailwind.config.ts`
- `@tailwindcss/typography` plugin for prose styling
- CSS variables defined in `src/app/globals.css` for colors and animations
- JetBrains Mono for headings/code, Space Grotesk for body text

### Design System
- Primary accent: `#22d3ee` (cyan)
- Success: `#4ade80` (green)
- Background: `#0a0a0f` (near-black)
- Border: `#1e1e2e`
- Terminal-style animations (scan lines, blinking cursor)

### New Feature: Blog Editor (In Progress)
A database-backed editor is being implemented:
- `prisma/schema.prisma` - Post model for Vercel Postgres
- `src/lib/db.ts` - Prisma client singleton
- `src/app/api/posts/` - API routes for CRUD operations
- `src/app/editor/` - Tiptap-based rich text editor (planned)
- `src/app/manage/` - Post management page (planned)

## Data Model (Prisma)

```prisma
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

## Environment Variables

```bash
POSTGRES_URL          # Vercel Postgres connection string
EDITOR_PASSWORD       # Password for editor/manage pages
```

## Key Files

- `src/app/layout.tsx` - Root layout with header, footer, PressStartGate
- `src/app/page.tsx` - Home page with post list
- `src/app/posts/[slug]/page.tsx` - Individual post page
- `src/app/about/page.tsx` - About page
- `src/lib/posts.ts` - Post data fetching utilities
- `src/app/components/PressStart.tsx` - Boot animation overlay

## Git Commit Guidelines

- **Do not include Co-Authored-By trailers** in commit messages
- Commits should be attributed to jett.Chen <1519755291@qq.com>
- Use concise, descriptive commit messages in Chinese or English
