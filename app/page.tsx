import React, { useState, useEffect, useRef } from 'react';

export default function DrinkingBird() {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [cycles, setCycles] = useState(0);
  const [phase, setPhase] = useState('idle');
  const birdRef = useRef<SVGSVGElement>(null);
  const gulpAudio = useRef<HTMLAudioElement | null>(null);
  const bubbleAudio = useRef<HTMLAudioElement | null>(null);
  const ambientAudio = useRef<HTMLAudioElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sound URLs (public domain / free)
  const gulpUrl = 'https://www.orangefreesounds.com/wp-content/uploads/2020/02/Drinking-sound-effect.mp3';
  const bubbleUrl = 'https://freesound.org/data/previews/66/66926_931655-lq.mp3'; // bubble example
  const ambientUrl = 'https://www.soundjay.com/water/water-stream-1.mp3';

  useEffect(() => {
    gulpAudio.current = new Audio(gulpUrl);
    bubbleAudio.current = new Audio(bubbleUrl);
    ambientAudio.current = new Audio(ambientUrl);
    if (ambientAudio.current) ambientAudio.current.loop = true;
  }, []);

  const playSound = (type: 'gulp' | 'bubble' | 'ambient') => {
    if (!soundEnabled) return;
    const audio = type === 'gulp' ? gulpAudio.current : type === 'bubble' ? bubbleAudio.current : ambientAudio.current;
    if (audio) {
      audio.currentTime = 0;
      audio.volume = type === 'ambient' ? 0.3 : 0.7;
      audio.play().catch(() => {});
    }
  };

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
    if (!isRunning && ambientAudio.current) {
      ambientAudio.current.play().catch(() => {});
    } else if (ambientAudio.current) {
      ambientAudio.current.pause();
    }
  };

  // Animation logic for drinking (simplified)
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setPhase('drinking');
      setCycles(c => c + 1);
      playSound('gulp');
      playSound('bubble');

      setTimeout(() => {
        setPhase('idle');
      }, 800);
    }, 2500 / speed);

    return () => clearInterval(interval);
  }, [isRunning, speed]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-8 font-mono">
      <h1 className="text-5xl mb-8 tracking-tight">THE DRINKING COG 🐦🥃</h1>

      <div className="relative w-[400px] h-[500px] mb-12">
        <svg ref={birdRef} viewBox="0 0 400 500" className="w-full h-full drop-shadow-2xl">
          {/* Bird body, head, beak, glass - simplified SVG for demo */}
          <ellipse cx="200" cy="300" rx="80" ry="120" fill="#3b82f6" />
          <circle cx="200" cy="180" r="60" fill="#ef4444" />
          {/* Beak */}
          <polygon points="260,180 320,190 260,200" fill="#f59e0b" className={phase === 'drinking' ? 'animate-[tilt_0.6s_ease-in-out_forwards]' : ''} />
          {/* Glass */}
          <rect x="280" y="320" width="80" height="140" rx="10" fill="none" stroke="#64748b" strokeWidth="12" />
          {/* Liquid */}
          <rect x="290" y={phase === 'drinking' ? '380' : '340'} width="60" height="80" fill="#22d3ee" />
        </svg>
      </div>

      <div className="flex gap-6 flex-wrap justify-center">
        <button onClick={toggleSimulation} className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-xl font-bold rounded-xl transition-all active:scale-95">
          {isRunning ? 'PAUSE' : 'START DRINKING'}
        </button>

        <div className="flex items-center gap-4 bg-zinc-900 px-6 py-4 rounded-xl">
          <label>Speed: {speed}x</label>
          <input type="range" min="0.5" max="3" step="0.1" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="w-48" />
        </div>

        <div className="flex items-center gap-3 bg-zinc-900 px-6 py-4 rounded-xl">
          <label>Cycles: {cycles}</label>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg">
            Sound: {soundEnabled ? 'ON 🔊' : 'OFF'}
          </button>
        </div>
      </div>

      <p className="mt-12 text-zinc-500 text-sm">The bird is visibly + audibly drinking! Push it real good.</p>
    </div>
  );
}
