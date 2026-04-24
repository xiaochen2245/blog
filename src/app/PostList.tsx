"use client";

import { useState } from "react";
import Link from "next/link";
import { Post } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

interface PostListProps {
  posts: Post[];
  allTags: string[];
}

export default function PostList({ posts, allTags }: PostListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  const getTagClass = (tag: string) => {
    const tagLower = tag.toLowerCase();
    if (tagLower.includes('技术') || tagLower.includes('tech')) return 'tag-tech';
    if (tagLower.includes('随笔') || tagLower.includes('life') || tagLower.includes('成长')) return 'tag-life';
    return 'tag-default';
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="terminal-window p-6 mb-8">
          <div className="terminal-header">
            <div className="terminal-dot red" />
            <div className="terminal-dot yellow" />
            <div className="terminal-dot green" />
            <span className="ml-3 text-xs font-mono text-[#71717a]">bash --logo --version</span>
          </div>
          <div className="p-6 font-mono">
            <p className="text-[#71717a] mb-2">$ whoami</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="neon-text">404::NULL</span>
              <span className="text-[#71717a]">.blog()</span>
            </h1>
            <p className="text-[#71717a] mb-2">$ cat description.txt</p>
            <p className="text-[#e4e4e7] text-lg leading-relaxed max-w-2xl">
              技术备忘录，记录学习和成长过程中的点点滴滴。
              <br />
              <span className="text-[#52525b]">
                // 保持好奇，持续学习，共同进步
              </span>
            </p>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="terminal-window p-4 text-center">
            <div className="text-2xl font-bold font-mono text-[#22d3ee]">{posts.length}</div>
            <div className="text-xs text-[#71717a] font-mono mt-1">// 文章总数</div>
          </div>
          <div className="terminal-window p-4 text-center">
            <div className="text-2xl font-bold font-mono text-[#4ade80]">{allTags.length}</div>
            <div className="text-xs text-[#71717a] font-mono mt-1">// 分类标签</div>
          </div>
          <div className="terminal-window p-4 text-center">
            <div className="text-2xl font-bold font-mono text-[#fbbf24]">
              {posts.length > 0 ? Math.floor((new Date().getTime() - new Date(posts[posts.length - 1].date).getTime()) / (1000 * 60 * 60 * 24)) : 0}
            </div>
            <div className="text-xs text-[#71717a] font-mono mt-1">// 天数运行</div>
          </div>
        </div>
      </section>

      {/* 标签筛选 */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-mono text-[#71717a]">
            <span className="text-[#22d3ee]">$</span> grep -r --include="*.md"
          </span>
          <span className="font-mono text-[#52525b]">tags:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`tag ${!selectedTag ? 'active' : ''}`}
          >
            all
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`tag ${getTagClass(tag)} ${selectedTag === tag ? 'active' : ''}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* 文章列表 */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs font-mono text-[#71717a]">
            <span className="text-[#22d3ee]">$</span> ls -la ./posts/
          </span>
          <span className="font-mono text-[#52525b]">
            [{filteredPosts.length} {filteredPosts.length === 1 ? 'file' : 'files'}]
          </span>
        </div>

        <div className="space-y-2">
          {filteredPosts.length === 0 ? (
            <div className="terminal-window p-6 text-center">
              <p className="font-mono text-[#71717a]">
                <span className="text-[#f87171]">error:</span> no files found
              </p>
            </div>
          ) : (
            filteredPosts.map((post, index) => (
              <article
                key={post.slug}
                className="article-card animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link
                  href={`/posts/${post.slug}`}
                  className="block group"
                >
                  {/* 文章元信息行 */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-[#52525b]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <time className="text-xs font-mono text-[#71717a]">
                      {formatDate(post.date)}
                    </time>
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

                  {/* 文章标题 */}
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-[#22d3ee] transition-colors">
                    {post.title}
                  </h2>

                  {/* 文章描述 */}
                  <p className="text-[#71717a] text-sm leading-relaxed">
                    {post.description}
                  </p>

                  {/* 阅读更多指示 */}
                  <div className="mt-3 flex items-center gap-2 text-xs font-mono text-[#52525b] group-hover:text-[#22d3ee] transition-colors">
                    <span>read more</span>
                    <span className="animate-blink">_</span>
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
