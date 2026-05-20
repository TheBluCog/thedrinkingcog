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
        <h1 className="text-6xl font-bold mb-4 tracking-tight">🪶 The Drinking Cog 🪶</h1>
        <p className="text-xl text-blue-300 max-w-md">A mesmerizing heat engine toy brought to life in code. Watch it drink forever!</p>
      </div>

      <div className="relative w-[400px] h-[500px] mb-12">
        {/* Glass of water */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-40 bg-blue-400/30 border-4 border-blue-300 rounded-b-3xl"></div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-28 h-4 bg-blue-500 rounded"></div>

        {/* Drinking Bird SVG with animation */}
        <svg 
          width="400" 
          height="500" 
          viewBox="0 0 400 500" 
          className="drop-shadow-2xl"
          style={{ 
            animation: isDrinking ? `bob ${4 / speed}s ease-in-out infinite` : 'none' 
          }}
        >
          {/* Body bulb */}
          <ellipse cx="200" cy="320" rx="60" ry="80" fill="#ff6b6b" stroke="#fff" strokeWidth="8"/>
          
          {/* Neck/tube */}
          <rect x="185" y="220" width="30" height="120" rx="10" fill="#ff6b6b" stroke="#fff" strokeWidth="8"/>
          
          {/* Head */}
          <g style={{ transformOrigin: '200px 180px', transform: isDrinking ? 'rotate(-35deg)' : 'rotate(0deg)', transition: 'transform 1s ease-in-out' }}>
            <ellipse cx="200" cy="150" rx="45" ry="55" fill="#ff6b6b" stroke="#fff" strokeWidth="8"/>
            {/* Beak */}
            <polygon points="230,150 270,165 230,180" fill="#ffd93d" stroke="#fff" strokeWidth="4"/>
            {/* Eye */}
            <circle cx="220" cy="140" r="10" fill="#111"/>
            <circle cx="223" cy="138" r="4" fill="#fff"/>
          </g>
          
          {/* Legs/pivot */}
          <line x1="170" y1="380" x2="150" y2="450" stroke="#ddd" strokeWidth="12" strokeLinecap="round"/>
          <line x1="230" y1="380" x2="250" y2="450" stroke="#ddd" strokeWidth="12" strokeLinecap="round"/>
          
          {/* Water in body (rising animation) */}
          <ellipse 
            cx="200" 
            cy="340" 
            rx="45" 
            ry={isDrinking ? '25' : '55'} 
            fill="#4a90e2" 
            style={{ transition: 'ry 2s ease-in-out' }}
          />
        </svg>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-4">
          <button
            onClick={() => setIsDrinking(!isDrinking)}
            className="px-10 py-4 bg-red-500 hover:bg-red-600 rounded-2xl text-xl font-semibold transition-all active:scale-95 flex items-center gap-3"
          >
            {isDrinking ? '⏸️ Pause the Bird' : '▶️ Start Drinking'}
          </button>
          
          <button
            onClick={() => setCycleCount(0)}
            className="px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-2xl text-xl font-semibold transition-all"
          >
            Reset Count
          </button>
        </div>

        <div className="flex items-center gap-4 text-lg">
          <label>Speed:</label>
          <input 
            type="range" 
            min="0.5" 
            max="3" 
            step="0.1" 
            value={speed} 
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-48 accent-red-500"
          />
          <span className="tabular-nums w-12">{speed.toFixed(1)}x</span>
        </div>

        <div className="text-3xl font-mono tabular-nums bg-black/50 px-8 py-3 rounded-2xl border border-white/10">
          Cycles: <span className="text-yellow-400">{cycleCount}</span>
        </div>
      </div>

      <div className="mt-16 max-w-md text-center text-sm text-slate-400">
        <p>The Drinking Bird is a classic heat engine. Evaporation cools the head, lowering pressure, and liquid rises making it tip forward to "drink".</p>
        <p className="mt-4">Built with ❤️ for TheBluCog using Next.js</p>
      </div>

      <style jsx>{`
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
}
