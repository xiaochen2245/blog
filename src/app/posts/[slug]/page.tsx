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
    title: `${post.title} | 404::NULL`,
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
  const content = getPostContent(slug);

  return (
    <article className="animate-fade-in">
      {/* 返回链接 */}
      <div className="mb-8">
        <Link
          href="/"
          className="nav-item"
        >
          cd ..
        </Link>
      </div>

      {/* 文章头部 */}
      <header className="mb-10">
        {/* Terminal 窗口 */}
        <div className="terminal-window" data-title={`${slug}.md`}>
          <div className="section-header">
            <span>$</span> cat {slug}.md
          </div>
          <div className="border-b border-[var(--border)] pb-4 mb-4">
            <p className="text-[var(--text-dim)] text-xs mb-1">// metadata</p>
            <p className="text-[var(--text)] text-sm">title: <span className="text-[var(--text-bright)]">"{post.title}"</span></p>
            <p className="text-[var(--text)] text-sm">date: <span className="text-[var(--text-bright)]">"{formatDate(post.date)}"</span></p>
            <p className="text-[var(--text)] text-sm">tags: [<span className="text-[var(--accent)]">{post.tags.join(', ')}</span>]</p>
          </div>
        </div>

        {/* 标题 */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--text-bright)] animate-glow">
          {post.title}
        </h1>

        {/* 元信息 */}
        <div className="flex items-center gap-4 flex-wrap text-sm">
          <span className="text-[var(--text-dim)]">
            {formatDate(post.date)}
          </span>
          <div className="flex gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">
                [{tag.toUpperCase()}]
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* 文章内容 */}
      <div
        className="prose prose-lg max-w-none"
        style={{
          '--tw-prose-body': 'var(--text)',
          '--tw-prose-headings': 'var(--text-bright)',
          '--tw-prose-links': 'var(--accent)',
          '--tw-prose-code': 'var(--accent)',
          '--tw-prose-pre-bg': 'var(--bg-secondary)',
          '--tw-prose-pre': 'var(--text)',
          '--tw-prose-quotes': 'var(--text-dim)',
          '--tw-prose-hr': 'var(--border)',
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* 文章底部 */}
      <footer className="mt-16 pt-8 border-t border-[var(--border)]">
        <Link
          href="/"
          className="nav-item"
        >
          cd .. (back to home)
        </Link>
      </footer>
    </article>
  );
}
