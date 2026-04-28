import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/password';

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

export async function POST(request: Request) {
  if (!verifyPassword(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
