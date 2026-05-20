'use client';

import { useEffect, useMemo, useState } from 'react';

type BirdPhase = 'idle' | 'cooling' | 'drinking' | 'resetting';

const phaseCopy: Record<BirdPhase, string> = {
  idle: 'Idle and balanced. Ready to sip.',
  cooling: 'Evaporative cooling is pulling vapor upward.',
  drinking: 'Center of mass shifts. The bird tips and drinks.',
  resetting: 'Pressure equalizes. The cog resets for another cycle.'
};

export default function DrinkingBirdApp() {
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      setCycleCount((previous) => previous + 1);
    }, Math.max(700, 3600 / speed));

    return () => clearInterval(interval);
  }, [isRunning, speed]);

  const phase = useMemo<BirdPhase>(() => {
    if (!isRunning) {
      return 'idle';
    }

    const step = cycleCount % 4;
    if (step === 0) return 'cooling';
    if (step === 1) return 'drinking';
    if (step === 2) return 'resetting';
    return 'cooling';
  }, [cycleCount, isRunning]);

  const tilt = phase === 'drinking' ? 24 : phase === 'resetting' ? -7 : 0;
  const bob = isRunning ? Math.sin(cycleCount) * 4 : 0;

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-blue-950 via-slate-950 to-black text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-10 px-6 py-10 lg:flex-row lg:gap-16">
        <div className="max-w-xl space-y-6 text-center lg:text-left">
          <span data-smoke="home-ready" className="sr-only">
            home-ready
          </span>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
            TheBluCog Lab
          </p>
          <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl">
            The Drinking Cog
          </h1>
          <p className="text-lg leading-8 text-slate-300">
            An interactive drinking bird simulation with a tiny governance panel for speed,
            cycles, state, and tilt. Science toy meets operator console. Tiny bird. Big cog energy.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-cyan-400/30 bg-white/10 p-4 shadow-2xl shadow-cyan-950/40 backdrop-blur">
              <p className="text-xs uppercase tracking-widest text-cyan-200">Cycles</p>
              <p className="mt-2 text-3xl font-bold">{cycleCount}</p>
            </div>
            <div className="rounded-2xl border border-cyan-400/30 bg-white/10 p-4 shadow-2xl shadow-cyan-950/40 backdrop-blur">
              <p className="text-xs uppercase tracking-widest text-cyan-200">Speed</p>
              <p className="mt-2 text-3xl font-bold">{speed.toFixed(1)}x</p>
            </div>
            <div className="rounded-2xl border border-cyan-400/30 bg-white/10 p-4 shadow-2xl shadow-cyan-950/40 backdrop-blur">
              <p className="text-xs uppercase tracking-widest text-cyan-200">Tilt</p>
              <p className="mt-2 text-3xl font-bold">{tilt}°</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-left shadow-2xl shadow-black/40">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Current phase
            </p>
            <p className="mt-3 text-xl font-bold capitalize text-white">{phase}</p>
            <p className="mt-2 text-slate-300">{phaseCopy[phase]}</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setIsRunning((value) => !value)}
              className="rounded-full bg-cyan-300 px-7 py-3 text-sm font-black uppercase tracking-widest text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:bg-white"
            >
              {isRunning ? 'Pause simulation' : 'Start simulation'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRunning(false);
                setCycleCount(0);
                setSpeed(1);
              }}
              className="rounded-full border border-white/20 px-7 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:border-cyan-300 hover:text-cyan-200"
            >
              Reset
            </button>
          </div>

          <label className="block rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
            <span className="text-sm font-semibold uppercase tracking-widest text-slate-300">
              Simulation speed
            </span>
            <input
              aria-label="Simulation speed"
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
              className="mt-4 w-full accent-cyan-300"
            />
          </label>
        </div>

        <div className="relative flex min-h-[520px] w-full max-w-md items-center justify-center rounded-[2rem] border border-cyan-400/20 bg-cyan-950/20 p-8 shadow-2xl shadow-cyan-950/50 backdrop-blur">
          <div className="absolute inset-x-10 bottom-16 h-5 rounded-full bg-cyan-300/20 blur-md" />
          <svg
            role="img"
            aria-label="Animated drinking bird simulation"
            viewBox="0 0 320 460"
            className="h-[460px] w-full drop-shadow-[0_30px_35px_rgba(34,211,238,0.25)]"
          >
            <defs>
              <linearGradient id="glass" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#155e75" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="liquid" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>
            </defs>

            <rect x="64" y="362" width="192" height="32" rx="16" fill="#0f172a" stroke="#67e8f9" strokeOpacity="0.4" />
            <line x1="160" y1="350" x2="160" y2="394" stroke="#67e8f9" strokeWidth="8" strokeLinecap="round" />
            <circle cx="160" cy="214" r="10" fill="#e2e8f0" />
            <line x1="106" y1="214" x2="214" y2="214" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />

            <g
              style={{
                transformOrigin: '160px 214px',
                transform: `rotate(${tilt}deg) translateY(${bob}px)`,
                transition: 'transform 600ms cubic-bezier(.2,.8,.2,1)'
              }}
            >
              <line x1="160" y1="142" x2="160" y2="316" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round" />
              <ellipse cx="160" cy="315" rx="43" ry="58" fill="url(#glass)" stroke="#cffafe" strokeWidth="4" />
              <path d="M124 325 Q160 355 196 325 L196 350 Q160 380 124 350 Z" fill="url(#liquid)" opacity="0.82" />
              <circle cx="160" cy="120" r="48" fill="url(#glass)" stroke="#cffafe" strokeWidth="4" />
              <circle cx="176" cy="108" r="6" fill="#0f172a" />
              <path d="M120 122 Q92 128 118 140" fill="none" stroke="#facc15" strokeWidth="9" strokeLinecap="round" />
              <path d="M137 72 Q160 52 183 72" fill="none" stroke="#ef4444" strokeWidth="18" strokeLinecap="round" />
              <path d="M130 91 Q160 78 190 91" fill="none" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />
            </g>

            <rect x="214" y="272" width="68" height="84" rx="16" fill="#0f172a" stroke="#67e8f9" strokeOpacity="0.5" />
            <path d="M224 324 Q248 340 272 324" fill="none" stroke="#67e8f9" strokeWidth="5" strokeLinecap="round" />
            <circle cx="248" cy="310" r="7" fill="#67e8f9" opacity={phase === 'drinking' ? 1 : 0.35} />
          </svg>
        </div>
      </section>
    </main>
  );
}
