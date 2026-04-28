import Link from "next/link";

export default function About() {
  return (
    <article className="animate-fade-in">
      {/* 返回链接 */}
      <div className="mb-8">
        <Link href="/" className="nav-item">
          cd ..
        </Link>
      </div>

      {/* 标题 */}
      <div className="mb-10">
        <div className="terminal-window" data-title="about.md">
          <div className="section-header">
            <span>$</span> cat about.md
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-bright)] animate-glow">
          about
        </h1>
      </div>

      {/* 内容 */}
      <div className="space-y-8">
        {/* 自我介绍 */}
        <section className="terminal-window" data-title="~/intro">
          <div className="section-header">
            <span>#</span> intro
          </div>
          <div className="space-y-4 text-[var(--text)] leading-relaxed">
            <p>
              目前正在进行AscendC算子学习与开发当中，正在被性能优化难题困扰。
            </p>
            <p>
              这个博客用来记录技术学习和个人成长过程中的心得体会。希望这些内容能对你有所帮助。
            </p>
          </div>
        </section>

        {/* 技能栈 */}
        <section className="terminal-window" data-title="~/skills">
          <div className="section-header">
            <span>#</span> skills
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border)]">
              <div className="text-xs text-[var(--accent)] mb-2">// frontend</div>
              <div className="space-y-1 text-sm text-[var(--text)]">
                <p>React / Next.js</p>
                <p>TypeScript</p>
                <p>Tailwind CSS</p>
              </div>
            </div>
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border)]">
              <div className="text-xs text-[var(--accent)] mb-2">// backend</div>
              <div className="space-y-1 text-sm text-[var(--text)]">
                <p>Node.js</p>
                <p>Python</p>
                <p>PostgreSQL</p>
              </div>
            </div>
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border)]">
              <div className="text-xs text-[var(--accent)] mb-2">// tools</div>
              <div className="space-y-1 text-sm text-[var(--text)]">
                <p>Git / GitHub</p>
                <p>Docker</p>
                <p>Linux</p>
              </div>
            </div>
          </div>
        </section>

        {/* 联系方式 */}
        <section className="terminal-window" data-title="~/contact">
          <div className="section-header">
            <span>#</span> contact
          </div>
          <div className="space-y-3">
            <a
              href="mailto:jett.chen@lednets.com"
              className="nav-item block"
            >
              <span className="text-[var(--accent)]">→</span> email: jett.chen@lednets.com
            </a>
            <a
              href="https://github.com/xiaochen2245"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-item block"
            >
              <span className="text-[var(--accent)]">→</span> github: xiaochen2245
            </a>
          </div>
        </section>
      </div>
    </article>
  );
}
