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
  const content = await getPostContent(slug);

  const getTagClass = (tag: string) => {
    const tagLower = tag.toLowerCase();
    if (tagLower.includes('技术') || tagLower.includes('tech')) return 'tag-tech';
    if (tagLower.includes('随笔') || tagLower.includes('life') || tagLower.includes('成长')) return 'tag-life';
    return 'tag-default';
  };

  return (
    <article className="animate-fade-in">
      {/* 返回链接 */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-mono text-[#71717a] hover:text-[#22d3ee] transition-colors"
        >
          <span>←</span>
          <span>cd ..</span>
        </Link>
      </div>

      {/* 文章头部 */}
      <header className="mb-10">
        {/* Terminal 窗口 */}
        <div className="terminal-window mb-6">
          <div className="terminal-header">
            <div className="terminal-dot red" />
            <div className="terminal-dot yellow" />
            <div className="terminal-dot green" />
            <span className="ml-3 text-xs font-mono text-[#71717a]">{slug}.md</span>
          </div>
          <div className="p-4 font-mono">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[#22d3ee]">$</span>
              <span className="text-[#71717a]">cat {slug}.md</span>
            </div>
            <div className="border-b border-[#1e1e2e] pb-3 mb-3">
              <p className="text-[#52525b] text-xs">title: "{post.title}"</p>
              <p className="text-[#52525b] text-xs">date: "{formatDate(post.date)}"</p>
              <p className="text-[#52525b] text-xs">tags: [{post.tags.map(t => `"${t}"`).join(', ')}]</p>
            </div>
          </div>
        </div>

        {/* 标题 */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          <span className="neon-text">{post.title}</span>
        </h1>

        {/* 元信息 */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm font-mono text-[#71717a]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <time>{formatDate(post.date)}</time>
          </div>
          <div className="flex gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={`tag ${getTagClass(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* 文章内容 */}
      <div
        className="prose prose-lg max-w-none prose-invert prose-code:text-[#22d3ee] prose-pre:bg-[#16161f] prose-pre:border prose-pre:border-[#1e1e2e] prose-a:text-[#22d3ee] prose-a:no-underline hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* 文章底部 */}
      <footer className="mt-16 pt-8 border-t border-[#1e1e2e]">
        <Link
          href="/"
          className="terminal-btn inline-flex"
        >
          <span>←</span>
          <span>返回首页</span>
        </Link>
      </footer>
    </article>
  );
}
