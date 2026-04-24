import Link from "next/link";

export default function About() {
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

      {/* 标题 */}
      <div className="mb-10">
        <div className="terminal-window mb-6">
          <div className="terminal-header">
            <div className="terminal-dot red" />
            <div className="terminal-dot yellow" />
            <div className="terminal-dot green" />
            <span className="ml-3 text-xs font-mono text-[#71717a]">about.md</span>
          </div>
          <div className="p-4 font-mono">
            <div className="flex items-center gap-3">
              <span className="text-[#22d3ee]">$</span>
              <span className="text-[#71717a]">cat about.md</span>
            </div>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">
          <span className="neon-text">关于我</span>
        </h1>
      </div>

      {/* 内容 */}
      <div className="space-y-8">
        {/* 自我介绍 */}
        <section className="terminal-window p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#22d3ee] font-mono">#</span>
            <span className="text-sm font-mono text-[#71717a]">intro</span>
          </div>
          <div className="space-y-4 text-[#e4e4e7] leading-relaxed">
            <p>
              你好！我是一名软件开发者，热爱技术，享受通过代码解决实际问题的过程。
            </p>
            <p>
              这个博客用来记录我在技术学习和个人成长过程中的心得体会。希望这些内容能对你有所帮助。
            </p>
          </div>
        </section>

        {/* 技能栈 */}
        <section className="terminal-window p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#22d3ee] font-mono">#</span>
            <span className="text-sm font-mono text-[#71717a]">skills</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#0a0a0f] rounded border border-[#1e1e2e]">
              <div className="text-xs font-mono text-[#22d3ee] mb-2">frontend</div>
              <div className="space-y-1 text-sm text-[#71717a]">
                <p>React / Next.js</p>
                <p>TypeScript</p>
                <p>Tailwind CSS</p>
              </div>
            </div>
            <div className="p-4 bg-[#0a0a0f] rounded border border-[#1e1e2e]">
              <div className="text-xs font-mono text-[#4ade80] mb-2">backend</div>
              <div className="space-y-1 text-sm text-[#71717a]">
                <p>Node.js</p>
                <p>Python</p>
                <p>PostgreSQL</p>
              </div>
            </div>
            <div className="p-4 bg-[#0a0a0f] rounded border border-[#1e1e2e]">
              <div className="text-xs font-mono text-[#fbbf24] mb-2">tools</div>
              <div className="space-y-1 text-sm text-[#71717a]">
                <p>Git / GitHub</p>
                <p>Docker</p>
                <p>Linux</p>
              </div>
            </div>
          </div>
        </section>

        {/* 联系方式 */}
        <section className="terminal-window p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#22d3ee] font-mono">#</span>
            <span className="text-sm font-mono text-[#71717a]">contact</span>
          </div>
          <div className="space-y-3">
            <a
              href="mailto:your.email@example.com"
              className="flex items-center gap-3 p-3 bg-[#0a0a0f] rounded border border-[#1e1e2e] hover:border-[#22d3ee] transition-colors group"
            >
              <svg className="w-5 h-5 text-[#71717a] group-hover:text-[#22d3ee] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-mono text-sm text-[#71717a] group-hover:text-[#e4e4e7] transition-colors">your.email@example.com</span>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-[#0a0a0f] rounded border border-[#1e1e2e] hover:border-[#22d3ee] transition-colors group"
            >
              <svg className="w-5 h-5 text-[#71717a] group-hover:text-[#22d3ee] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="font-mono text-sm text-[#71717a] group-hover:text-[#e4e4e7] transition-colors">github.com/yourusername</span>
            </a>
          </div>
        </section>
      </div>
    </article>
  );
}
