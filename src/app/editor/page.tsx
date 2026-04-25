'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

export default function EditorPage() {
  const [password, setPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [slug, setSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: '开始写文章...' }),
    ],
    content: '',
  });

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async () => {
    if (!title || !slug || !editor?.getHTML()) {
      setMessage({ type: 'error', text: '请填写标题和内容' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-password': password,
        },
        body: JSON.stringify({
          title,
          slug,
          description,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          content: editor.getHTML(),
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: '文章保存成功！' });
        setTimeout(() => router.push('/'), 1500);
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || '保存失败' });
      }
    } catch {
      setMessage({ type: 'error', text: '网络错误' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVerified) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <h1 className="text-2xl font-bold mb-6 neon-text">文章编辑器</h1>
        <input
          type="password"
          placeholder="输入编辑密码"
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
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm font-mono text-[#71717a] hover:text-[#22d3ee]"
        >
          ← 返回
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 neon-text">文章编辑器</h1>

      <div className="space-y-4">
        <div className="text-xs font-mono text-[#4ade80]">✓ 已验证</div>

        <input
          type="text"
          placeholder="文章标题"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full p-3 bg-[#0f0f14] border border-[#1e1e2e] rounded font-mono"
        />

        <textarea
          placeholder="文章描述"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 bg-[#0f0f14] border border-[#1e1e2e] rounded font-mono h-20"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="标签（逗号分隔）"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="p-3 bg-[#0f0f14] border border-[#1e1e2e] rounded font-mono"
          />
          <input
            type="text"
            placeholder="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="p-3 bg-[#0f0f14] border border-[#1e1e2e] rounded font-mono"
          />
        </div>

        <div className="border border-[#1e1e2e] rounded overflow-hidden">
          <div className="flex gap-2 p-2 bg-[#0f0f14] border-b border-[#1e1e2e]">
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-2 rounded font-bold ${
                editor?.isActive('bold')
                  ? 'bg-[#22d3ee] text-[#0a0a0f]'
                  : 'hover:bg-[#1e1e2e]'
              }`}
            >
              B
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-2 rounded ${
                editor?.isActive('italic')
                  ? 'bg-[#22d3ee] text-[#0a0a0f]'
                  : 'hover:bg-[#1e1e2e]'
              }`}
            >
              I
            </button>
            <button
              onClick={() => {
                const url = prompt('输入链接 URL');
                if (url) editor?.chain().focus().setLink({ href: url }).run();
              }}
              className="p-2 rounded hover:bg-[#1e1e2e]"
            >
              🔗
            </button>
            <button
              onClick={() => {
                const url = prompt('输入图片 URL');
                if (url) editor?.chain().focus().setImage({ src: url }).run();
              }}
              className="p-2 rounded hover:bg-[#1e1e2e]"
            >
              🖼
            </button>
          </div>

          <EditorContent
            editor={editor}
            className="prose prose-invert max-w-none p-4 min-h-[300px]"
          />
        </div>

        {message && (
          <div
            className={`text-sm font-mono ${
              message.type === 'success' ? 'text-[#4ade80]' : 'text-[#f87171]'
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="terminal-btn"
        >
          {isSubmitting ? '保存中...' : '保存文章'}
        </button>
      </div>
    </div>
  );
}
