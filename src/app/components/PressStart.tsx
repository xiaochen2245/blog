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

  // Typing effect for boot sequence
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

  // Show ready state after boot
  useEffect(() => {
    if (bootLines.length === bootSequence.length && bootLines[bootSequence.length - 1] === bootSequence[bootSequence.length - 1]) {
      const timer = setTimeout(() => setPhase('ready'), 500);
      return () => clearTimeout(timer);
    }
  }, [bootLines]);

  // Cursor blink
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

  // Listen for any key or click
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
        className="fixed inset-0 z-[100] bg-[#0a0a0f] flex items-center justify-center"
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
      className="fixed inset-0 z-[100] bg-[#0a0a0f] flex items-center justify-center cursor-pointer select-none"
      onClick={phase === 'ready' ? handleEnter : undefined}
    >
      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#22d3ee]/30 to-transparent"
          style={{
            animation: 'scanDown 3s linear infinite',
            top: '-2px',
          }}
        />
      </div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative text-center">
        {/* Boot terminal */}
        <div className="mb-8 font-mono text-left text-sm">
          <div className="bg-[#0f0f14] border border-[#1e1e2e] rounded p-4 min-w-[320px] max-w-[480px]">
            {bootLines.map((line, i) => (
              <div key={i} className="text-[#71717a]">
                <span className="text-[#22d3ee]">[{String(i + 1).padStart(2, '0')}]</span>{' '}
                <span className={i === bootSequence.length - 1 ? 'text-[#4ade80]' : ''}>
                  {line}
                  {i === bootSequence.length - 1 && cursorVisible && (
                    <span className="inline-block w-2 h-4 bg-[#22d3ee] ml-1 animate-pulse" />
                  )}
                </span>
              </div>
            ))}
            {bootLines.length < bootSequence.length && (
              <div className="text-[#71717a]">
                <span className="text-[#22d3ee]">[{String(bootLines.length + 1).padStart(2, '0')}]</span>{' '}
                <span className="inline-block w-2 h-4 bg-[#22d3ee] animate-pulse" />
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
            <div className="font-mono text-[#22d3ee] text-lg tracking-wider">
              <span className="inline-block mr-2">▶</span>
              PRESS ANY KEY TO START
              <span className="inline-block ml-2">◀</span>
            </div>
            <div className="mt-3 font-mono text-[#3f3f46] text-xs">
              or click anywhere
            </div>
          </div>
        )}
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 font-mono text-[#1e1e2e] text-xs">
        ┌─
      </div>
      <div className="absolute top-4 right-4 font-mono text-[#1e1e2e] text-xs">
        ─┐
      </div>
      <div className="absolute bottom-4 left-4 font-mono text-[#1e1e2e] text-xs">
        └─
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[#1e1e2e] text-xs">
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
