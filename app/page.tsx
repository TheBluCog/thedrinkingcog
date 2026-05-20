'use client';

import React, { useEffect, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

type BirdPhase = 'idle' | 'cooling' | 'drinking' | 'resetting';

const phaseCopy: Record<BirdPhase, string> = {
  idle: 'Idle and balanced. Ready to sip.',
  cooling: 'Evaporative cooling is pulling vapor upward.',
  drinking: 'Beak down. Water contact. Tiny bird is absolutely sending it.',
  resetting: 'Pressure equalizes. The cog resets for another cycle.'
};

function DrinkingBird3D({ phase, speed, isRunning }: { phase: BirdPhase; speed: number; isRunning: boolean }) {
  const groupRef = React.useRef<THREE.Group>(null!);
  const liquidRef = React.useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!isRunning) return;

    const time = state.clock.getElapsedTime() * speed * 1.5;
    const cycle = Math.sin(time);

    // Tilt the whole bird
    const tilt = phase === 'drinking' ? -0.8 : phase === 'resetting' ? 0.1 : phase === 'cooling' ? 0.05 : 0;
    groupRef.current.rotation.z = tilt + Math.sin(time * 2) * 0.05;

    // Bob head
    groupRef.current.position.y = Math.sin(time * 3) * 0.1;

    // Liquid bobble
    if (liquidRef.current) {
      liquidRef.current.position.y = phase === 'drinking' ? -0.2 : 0;
      liquidRef.current.scale.y = phase === 'drinking' ? 1.3 : 1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Glass base */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.8, 0.9, 0.4, 32]} />
        <meshStandardMaterial color="#67e8f9" transparent opacity={0.6} />
      </mesh>

      {/* Liquid */}
      <mesh ref={liquidRef} position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 1.2, 32]} />
        <meshStandardMaterial color="#ef4444" transparent opacity={0.85} />
      </mesh>

      {/* Bird body (glass bulb) */}
      <group>
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.9]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.3} roughness={0.2} />
        </mesh>

        {/* Head */}
        <mesh position={[0, 2.4, 0]}>
          <sphereGeometry args={[0.55]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>

        {/* Beak */}
        <mesh position={[0.8, 2.2, 0]} rotation={[0, 0, 0.6]}>
          <coneGeometry args={[0.2, 0.8, 4]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.2, 2.5, 0.4]}>
          <sphereGeometry args={[0.12]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        <mesh position={[0.2, 2.5, 0.4]}>
          <sphereGeometry args={[0.12]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
      </group>

      {/* Legs / pivot */}
      <mesh position={[0, -0.5, 0]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.8, 8]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
    </group>
  );
}

export default function DrinkingBirdApp() {
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const phase = useMemo<BirdPhase>(() => {
    if (!isRunning) return 'idle';
    const step = cycleCount % 4;
    if (step === 0) return 'drinking';
    if (step === 1) return 'resetting';
    if (step === 2) return 'cooling';
    return 'drinking';
  }, [cycleCount, isRunning]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setCycleCount(c => c + 1);
    }, Math.max(800, 2800 / speed));
    return () => clearInterval(interval);
  }, [isRunning, speed]);

  const tilt = phase === 'drinking' ? 40 : phase === 'resetting' ? 8 : phase === 'cooling' ? -4 : 0;

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-blue-950 via-slate-950 to-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-6xl font-black tracking-tighter mb-4">THE DRINKING COG 3D</h1>
          <p className="text-xl text-cyan-300">WebGL • React Three Fiber • Push it real good</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* 3D Viewer */}
          <div className="relative h-[520px] rounded-3xl border border-cyan-400/30 bg-black/60 overflow-hidden shadow-2xl">
            <Canvas camera={{ position: [0, 2, 6], fov: 45 }} style={{ background: 'transparent' }}>
              <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-cyan-400">Loading 3D Bird...</div>}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <DrinkingBird3D phase={phase} speed={speed} isRunning={isRunning} />
                <Environment preset="night" />
                <OrbitControls enablePan={false} enableZoom={true} minDistance={3} maxDistance={12} />
                <Stars radius={100} depth={50} count={200} factor={4} saturation={0} fade speed={1} />
              </Suspense>
            </Canvas>

            <div className="absolute bottom-6 left-6 flex gap-3 z-10">
              <button 
                onClick={() => setViewMode(viewMode === '3d' ? '2d' : '3d')}
                className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm backdrop-blur border border-white/30"
              >
                {viewMode === '3d' ? 'Switch to 2D' : 'Switch to 3D'}
              </button>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-8 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-cyan-400/30 bg-white/5 p-6 text-center">
                <div className="text-xs uppercase tracking-widest text-cyan-400">CYCLES</div>
                <div className="text-5xl font-bold text-white mt-2">{cycleCount}</div>
              </div>
              <div className="rounded-2xl border border-cyan-400/30 bg-white/5 p-6 text-center">
                <div className="text-xs uppercase tracking-widest text-cyan-400">SPEED</div>
                <div className="text-5xl font-bold text-white mt-2">{speed.toFixed(1)}×</div>
              </div>
              <div className="rounded-2xl border border-cyan-400/30 bg-white/5 p-6 text-center">
                <div className="text-xs uppercase tracking-widest text-cyan-400">TILT</div>
                <div className="text-5xl font-bold text-white mt-2">{tilt}°</div>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900/80 p-8">
              <p className="uppercase tracking-widest text-cyan-400 text-sm mb-3">CURRENT PHASE</p>
              <p className="text-3xl font-bold capitalize mb-2">{phase}</p>
              <p className="text-slate-400 leading-relaxed">{phaseCopy[phase]}</p>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="w-full py-6 text-xl font-black rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 hover:brightness-110 transition-all active:scale-[0.985] shadow-lg shadow-cyan-500/30"
              >
                {isRunning ? '⏸️ PAUSE THE BIRD' : '▶️ START DRINKING 🐦🥃'}
              </button>

              <button
                onClick={() => { setIsRunning(false); setCycleCount(0); setSpeed(1); }}
                className="w-full py-4 border border-white/30 hover:border-red-400 text-red-400 hover:text-red-300 rounded-2xl text-sm uppercase tracking-widest transition"
              >
                RESET ALL
              </button>
            </div>

            <div>
              <label className="block text-sm uppercase tracking-widest text-slate-400 mb-4">SPEED CONTROL</label>
              <input
                type="range"
                min="0.5" max="3" step="0.1"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="text-center text-sm text-slate-500">
              Drag to orbit • Scroll to zoom • The bird visibly drinks in 3D!
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
