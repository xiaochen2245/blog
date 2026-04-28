'use client';

import { useEffect, useState, useCallback } from 'react';

export default function PressStart({ onEnter }: { onEnter: () => void }) {
  const [phase, setPhase] = useState<'boot' | 'ready' | 'entering'>('boot');
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [cursorVisible, setCursorVisible] = useState(true);

  const bootSequence = [
    '> Initializing system...',
    '> Loading kernel modules...',
    '> Mounting file systems...',
    '> Starting network services...',
    '> Establishing secure connection...',
    '> System ready.',
  ];

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    let timeout: NodeJS.Timeout;

    const typeNextChar = () => {
      if (lineIndex < bootSequence.length) {
        const currentLine = bootSequence[lineIndex];
        if (charIndex < currentLine.length) {
          setBootLines(prev => {
            const newLines = [...prev];
            newLines[lineIndex] = currentLine.substring(0, charIndex + 1);
            return newLines;
          });
          charIndex++;
          timeout = setTimeout(typeNextChar, 30 + Math.random() * 20);
        } else {
          lineIndex++;
          charIndex = 0;
          timeout = setTimeout(typeNextChar, 100);
        }
      }
    };

    timeout = setTimeout(typeNextChar, 500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (bootLines.length === bootSequence.length && bootLines[bootSequence.length - 1] === bootSequence[bootSequence.length - 1]) {
      const timer = setTimeout(() => setPhase('ready'), 500);
      return () => clearTimeout(timer);
    }
  }, [bootLines]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const handleEnter = useCallback(() => {
    if (phase === 'ready') {
      setPhase('entering');
      onEnter();
    }
  }, [phase, onEnter]);

  useEffect(() => {
    if (phase !== 'ready') return;

    const onKeyDown = () => handleEnter();
    const onClick = () => handleEnter();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('click', onClick);
    };
  }, [phase, handleEnter]);

  if (phase === 'entering') {
    return (
      <div
        className="fixed inset-0 z-[100] bg-[var(--bg)] flex items-center justify-center"
        style={{
          animation: 'fadeOut 0.6s ease-out forwards',
        }}
      >
        <style jsx>{`
          @keyframes fadeOut {
            0% { opacity: 1; }
            100% { opacity: 0; pointer-events: none; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-[var(--bg)] flex items-center justify-center cursor-pointer select-none"
      onClick={phase === 'ready' ? handleEnter : undefined}
    >
      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent"
          style={{
            animation: 'scanDown 3s linear infinite',
            top: '-2px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative text-center">
        {/* Boot terminal */}
        <div className="mb-8 font-mono text-left text-sm">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-4 min-w-[320px] max-w-[480px]">
            {bootLines.map((line, i) => (
              <div key={i} className="text-[var(--text-dim)]">
                <span className="text-[var(--accent)]">[{String(i + 1).padStart(2, '0')}]</span>{' '}
                <span className={i === bootSequence.length - 1 ? 'text-[var(--accent)]' : ''}>
                  {line}
                  {i === bootSequence.length - 1 && cursorVisible && (
                    <span className="inline-block w-2 h-4 bg-[var(--accent)] ml-1 animate-pulse" />
                  )}
                </span>
              </div>
            ))}
            {bootLines.length < bootSequence.length && (
              <div className="text-[var(--text-dim)]">
                <span className="text-[var(--accent)]">[{String(bootLines.length + 1).padStart(2, '0')}]</span>{' '}
                <span className="inline-block w-2 h-4 bg-[var(--accent)] animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* Press key prompt */}
        {phase === 'ready' && (
          <div
            className="animate-pulse"
            style={{
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            <div className="font-mono text-[var(--text)] text-lg tracking-wider">
              <span className="inline-block mr-2">▶</span>
              PRESS ANY KEY TO START
              <span className="inline-block ml-2">◀</span>
            </div>
            <div className="mt-3 font-mono text-[var(--text-dim)] text-xs">
              or click anywhere
            </div>
          </div>
        )}
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 font-mono text-[var(--border)] text-xs">
        ┌─
      </div>
      <div className="absolute top-4 right-4 font-mono text-[var(--border)] text-xs">
        ─┐
      </div>
      <div className="absolute bottom-4 left-4 font-mono text-[var(--border)] text-xs">
        └─
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[var(--border)] text-xs">
        ─┘
      </div>

      <style jsx>{`
        @keyframes scanDown {
          0% { top: -2px; }
          100% { top: 100%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
