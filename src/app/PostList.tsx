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

  return (
    <div className="animate-fade-in">
      {/* Posts Section */}
      <section className="terminal-window" data-title="~/posts - ls -la recent_articles">
        <div className="section-header">
          <span>~/posts</span> - ls -la recent_articles
        </div>

        {/* Article Table Header */}
        <div className="article-header">
          <span>DATE</span>
          <span>TITLE</span>
          <span>TAG</span>
        </div>

        {/* Article List */}
        <div className="articles">
          {filteredPosts.length === 0 ? (
            <div className="py-8 text-center text-[var(--text-dim)]">
              <span className="text-[var(--accent)]">$</span> grep: no files found
            </div>
          ) : (
            filteredPosts.map((post, index) => (
              <div
                key={post.slug}
                className="article-item animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className="article-date">{formatDate(post.date)}</span>
                <span className="article-title">
                  <Link href={`/posts/${post.slug}`}>
                    {post.title}
                  </Link>
                </span>
                <span className="article-tag">
                  [{post.tags[0]?.toUpperCase() || 'POST'}]
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Tags Filter */}
      <section className="terminal-window" data-title="~/tags - filter">
        <div className="section-header">
          <span>~/tags</span> - grep --include="*.md"
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedTag(null)}
            className={`tag ${!selectedTag ? 'bg-[rgba(0,255,0,0.2)]' : ''}`}
          >
            [ALL]
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`tag ${selectedTag === tag ? 'bg-[rgba(0,255,0,0.2)]' : ''}`}
            >
              [{tag.toUpperCase()}]
            </button>
          ))}
        </div>

        <div className="mt-4 text-xs text-[var(--text-dim)]">
          <span className="text-[var(--accent)]">$</span> found {filteredPosts.length} {filteredPosts.length === 1 ? 'file' : 'files'}
        </div>
      </section>
    </div>
  );
}
