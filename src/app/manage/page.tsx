'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  description: string | null;
  tags: string[];
  createdAt: string;
}

export default function ManagePage() {
  const [password, setPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return;

    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
        headers: { 'x-password': password },
      });

      if (res.ok) {
        setMessage({ type: 'success', text: '删除成功' });
        fetchPosts();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || '删除失败' });
      }
    } catch {
      setMessage({ type: 'error', text: '网络错误' });
    }
  };

  useEffect(() => {
    if (isVerified) {
      fetchPosts();
    }
  }, [isVerified]);

  if (!isVerified) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <h1 className="text-2xl font-bold mb-6 neon-text">文章管理</h1>
        <input
          type="password"
          placeholder="输入管理密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-[#0f0f14] border border-[#1e1e2e] rounded font-mono text-sm"
        />
        <button onClick={() => setIsVerified(true)} className="mt-4 terminal-btn">
          验证
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-mono text-[#71717a] hover:text-[#22d3ee]"
        >
          ← 返回
        </Link>
        <Link href="/editor" className="terminal-btn">
          + 新建文章
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 neon-text">文章管理</h1>

      {message && (
        <div
          className={`text-sm font-mono mb-4 ${
            message.type === 'success' ? 'text-[#4ade80]' : 'text-[#f87171]'
          }`}
        >
          {message.text}
        </div>
      )}

      {isLoading ? (
        <div className="text-sm font-mono text-[#71717a]">加载中...</div>
      ) : posts.length === 0 ? (
        <div className="text-sm font-mono text-[#71717a]">暂无文章</div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="terminal-window p-4 flex items-center justify-between"
            >
              <div className="flex-1">
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-lg font-bold hover:text-[#22d3ee] transition-colors"
                >
                  {post.title}
                </Link>
                <div className="text-xs font-mono text-[#71717a] mt-1">
                  {new Date(post.createdAt).toLocaleDateString('zh-CN')} ·{' '}
                  {post.tags.join(', ') || '无标签'}
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/editor?slug=${post.slug}`}
                  className="terminal-btn text-xs"
                >
                  编辑
                </Link>
                <button
                  onClick={() => handleDelete(post.slug)}
                  className="terminal-btn text-xs border-[#f87171] text-[#f87171] hover:bg-[#f87171] hover:text-[#0a0a0f]"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
