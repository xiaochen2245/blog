'use client';

import { useState, useEffect } from 'react';
import PressStart from './PressStart';

export default function PressStartGate({ children }: { children: React.ReactNode }) {
  const [entered, setEntered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if already entered in this session
    const hasEntered = sessionStorage.getItem('hasEntered');
    if (hasEntered) {
      setEntered(true);
    }
  }, []);

  const handleEnter = () => {
    setEntered(true);
    sessionStorage.setItem('hasEntered', 'true');
  };

  // Show nothing until mounted (avoid hydration mismatch)
  if (!mounted) {
    return null;
  }

  return (
    <>
      {!entered && <PressStart onEnter={handleEnter} />}
      {children}
    </>
  );
}
