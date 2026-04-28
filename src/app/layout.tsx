import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import PressStartGate from "./components/PressStartGate";

export const metadata: Metadata = {
  title: "404::NULL | 技术备忘录",
  description: "技术分享与个人成长",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="relative">
        <PressStartGate>
          <div className="max-w-4xl mx-auto px-8 py-12">
            {/* Header */}
            <header className="terminal-window mb-12" data-title="root@blog:~#">
              <h1 className="text-3xl font-bold text-[var(--text-bright)] animate-glow mb-2">
                404::NULL
              </h1>
              <p className="text-sm text-[var(--text-dim)]">
                # 技术备忘录，记录学习和成长过程中的点点滴滴
              </p>
            </header>

            {/* Navigation */}
            <nav className="mb-12">
              <div className="nav-item">
                <Link href="/">home</Link>
              </div>
              <div className="nav-item">
                <Link href="/about">about</Link>
              </div>
              <div className="nav-item">
                <a
                  href="https://github.com/xiaochen2245"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  repo
                </a>
                <span className="animate-blink inline-block w-2 h-4 bg-[var(--text)] ml-1 align-middle" />
              </div>
            </nav>

            {/* Main content */}
            <main className="min-h-screen">
              {children}
            </main>

            {/* Footer */}
            <footer className="footer-text">
              <p>
                <span>©</span> {new Date().getFullYear()} 404::NULL | <span>Built with</span> Next.js + Terminal Aesthetic
              </p>
            </footer>
          </div>
        </PressStartGate>
      </body>
    </html>
  );
}
