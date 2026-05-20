'use client';

import { useState, useEffect } from 'react';

export default function DrinkingBirdApp() {
  const [isDrinking, setIsDrinking] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isDrinking) {
      interval = setInterval(() => {
        setCycleCount(prev => prev + 1);
      }, 4000 / speed);
    }
    return () => clearInterval(interval);
  }, [isDrinking, speed]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-900 text-white flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">