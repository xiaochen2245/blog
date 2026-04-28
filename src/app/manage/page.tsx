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
        setMessage({ type: 'success', text: 'delete: success' });
        fetchPosts();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: `error: ${data.error || 'delete failed'}` });
      }
    } catch {
      setMessage({ type: 'error', text: 'error: network failure' });
    }
  };

  useEffect(() => {
    if (isVerified) {
      fetchPosts();
    }
  }, [isVerified]);

  if (!isVerified) {
    return (
      <div className="max-w-md mx-auto">
        <div className="terminal-window" data-title="auth.sh">
          <div className="section-header">
            <span>$</span> ./manage.sh --auth
          </div>
          <p className="text-[var(--text-dim)] text-sm mb-4">// enter password to continue</p>
          <input
            type="password"
            placeholder="password: "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-[var(--bg-secondary)] border border-[var(--border)] font-mono text-sm text-[var(--text)]"
          />
          <button
            onClick={() => setIsVerified(true)}
            className="mt-4 px-4 py-2 bg-[var(--accent)] text-[var(--bg)] font-mono text-sm hover:opacity-80 transition-opacity"
          >
            <span className="text-[var(--bg)]">$</span> verify
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="nav-item">
          cd ..
        </Link>
        <Link href="/editor" className="nav-item">
          + new_post
        </Link>
      </div>

      <div className="terminal-window mb-6" data-title="manage.sh">
        <div className="section-header">
          <span>$</span> ls -la ./posts/
        </div>
        <p className="text-[var(--text-dim)] text-sm">
          found <span className="text-[var(--accent)]">{posts.length}</span> files
        </p>
      </div>

      {message && (
        <div
          className={`text-sm font-mono mb-4 ${
            message.type === 'success' ? 'text-[var(--accent)]' : 'text-[var(--red)]'
          }`}
        >
          {message.text}
        </div>
      )}

      {isLoading ? (
        <div className="text-sm font-mono text-[var(--text-dim)]">
          <span className="text-[var(--accent)]">$</span> loading...
        </div>
      ) : posts.length === 0 ? (
        <div className="terminal-window">
          <div className="text-sm font-mono text-[var(--text-dim)]">
            <span className="text-[var(--accent)]">$</span> grep: no files found
          </div>
        </div>
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
                  className="text-lg font-bold text-[var(--text)] hover:text-[var(--text-bright)] transition-colors"
                >
                  {post.title}
                </Link>
                <div className="text-xs font-mono text-[var(--text-dim)] mt-1">
                  {new Date(post.createdAt).toLocaleDateString('zh-CN')} · {post.tags.join(', ') || 'no tags'}
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/editor?slug=${post.slug}`}
                  className="tag text-xs"
                >
                  [EDIT]
                </Link>
                <button
                  onClick={() => handleDelete(post.slug)}
                  className="tag text-xs"
                  style={{ borderColor: 'var(--red)', color: 'var(--red)' }}
                >
                  [DEL]
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
