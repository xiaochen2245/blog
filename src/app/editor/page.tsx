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
      Placeholder.configure({ placeholder: 'start writing...' }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none p-4 min-h-[300px] outline-none',
      },
    },
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
      setMessage({ type: 'error', text: 'error: title and content required' });
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
        setMessage({ type: 'success', text: 'save: success // redirecting...' });
        setTimeout(() => router.push('/'), 1500);
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: `error: ${data.error || 'save failed'}` });
      }
    } catch {
      setMessage({ type: 'error', text: 'error: network failure' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVerified) {
    return (
      <div className="max-w-md mx-auto">
        <div className="terminal-window" dataTitle="editor.sh --auth">
          <div className="section-header">
            <span>$</span> ./editor.sh --auth
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
      <div className="mb-6">
        <Link href="/" className="nav-item">
          cd ..
        </Link>
      </div>

      <div className="terminal-window mb-6" data-title="editor.sh">
        <div className="section-header">
          <span>$</span> vim new_post.md
        </div>
        <p className="text-[var(--accent)] text-sm">// authenticated</p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="title: "
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full p-3 bg-[var(--bg-secondary)] border border-[var(--border)] font-mono text-[var(--text)]"
        />

        <textarea
          placeholder="description: "
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 bg-[var(--bg-secondary)] border border-[var(--border)] font-mono text-[var(--text)] h-20"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="tags: (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="p-3 bg-[var(--bg-secondary)] border border-[var(--border)] font-mono text-[var(--text)]"
          />
          <input
            type="text"
            placeholder="slug: "
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="p-3 bg-[var(--bg-secondary)] border border-[var(--border)] font-mono text-[var(--text)]"
          />
        </div>

        <div className="border border-[var(--border)] rounded overflow-hidden">
          <div className="flex gap-2 p-2 bg-[var(--bg-secondary)] border-b border-[var(--border)]">
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-2 rounded font-bold ${
                editor?.isActive('bold')
                  ? 'bg-[var(--accent)] text-[var(--bg)]'
                  : 'hover:bg-[var(--bg-card)] text-[var(--text)]'
              }`}
            >
              B
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-2 rounded ${
                editor?.isActive('italic')
                  ? 'bg-[var(--accent)] text-[var(--bg)]'
                  : 'hover:bg-[var(--bg-card)] text-[var(--text)]'
              }`}
            >
              I
            </button>
            <button
              onClick={() => {
                const url = prompt('url: ');
                if (url) editor?.chain().focus().setLink({ href: url }).run();
              }}
              className="p-2 rounded hover:bg-[var(--bg-card)] text-[var(--text)]"
            >
              link
            </button>
            <button
              onClick={() => {
                const url = prompt('image url: ');
                if (url) editor?.chain().focus().setImage({ src: url }).run();
              }}
              className="p-2 rounded hover:bg-[var(--bg-card)] text-[var(--text)]"
            >
              img
            </button>
          </div>

          <EditorContent
            editor={editor}
            className="bg-[var(--bg-secondary)] text-[var(--text)]"
          />
        </div>

        {message && (
          <div
            className={`text-sm font-mono ${
              message.type === 'success' ? 'text-[var(--accent)]' : 'text-[var(--red)]'
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-[var(--accent)] text-[var(--bg)] font-mono text-sm hover:opacity-80 transition-opacity"
        >
          <span className="text-[var(--bg)]">$</span> {isSubmitting ? 'saving...' : 'save'}
        </button>
      </div>
    </div>
  );
}
