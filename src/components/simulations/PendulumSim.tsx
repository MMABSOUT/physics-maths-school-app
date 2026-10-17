import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export const PendulumSim: React.FC = () => {
  const [length, setLength] = useState<number>(2.0); // meters
  const [gravity, setGravity] = useState<number>(9.81);
  const [initialAngle, setInitialAngle] = useState<number>(30); // degrees
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const [angle, setAngle] = useState<number>((30 * Math.PI) / 180);
  const [angleVel, setAngleVel] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const period = 2 * Math.PI * Math.sqrt(length / gravity);
  const frequency = 1 / period;

  const resetPendulum = () => {
    setIsRunning(false);
    setAngle((initialAngle * Math.PI) / 180);
    setAngleVel(0);
  };

  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();

    const update = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isRunning) {
        // Simple pendulum angular acceleration: alpha = -(g/L) * sin(theta)
        setAngle((prevAngle) => {
          const alpha = -(gravity / length) * Math.sin(prevAngle);
          setAngleVel((prevVel) => prevVel + alpha * dt);
          return prevAngle + angleVel * dt;
        });
      }

      animationId = requestAnimationFrame(update);
    };

    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, gravity, length, angleVel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const originX = width / 2;
    const originY = 60;
    const pixelLength = length * 100;

    const bobX = originX + pixelLength * Math.sin(angle);
    const bobY = originY + pixelLength * Math.cos(angle);

    // Ceiling support
    ctx.fillStyle = '#475569';
    ctx.fillRect(originX - 60, originY - 10, 120, 10);

    // String
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Pivot
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(originX, originY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Pendulum Bob
    ctx.fillStyle = '#06b6d4';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(bobX, bobY, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [angle, length]);

  return (
    <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Harmonic Motion: Simple Pendulum</h2>
          <p className="text-xs text-slate-400">Observe period and frequency relationship T = 2π√(L/g).</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold transition-all"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetPendulum}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-center">
          <canvas ref={canvasRef} width={500} height={350} className="w-full h-auto max-h-[350px] object-contain" />
        </div>

        <div className="space-y-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Pendulum Length (L)</span>
              <span className="text-cyan-400 font-mono">{length} m</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={3.0}
              step={0.1}
              value={length}
              onChange={(e) => {
                setLength(Number(e.target.value));
                resetPendulum();
              }}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Initial Angle</span>
              <span className="text-cyan-400 font-mono">{initialAngle}°</span>
            </div>
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={initialAngle}
              onChange={(e) => {
                setInitialAngle(Number(e.target.value));
                resetPendulum();
              }}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Gravity (g)</span>
              <span className="text-cyan-400 font-mono">{gravity} m/s²</span>
            </div>
            <input
              type="range"
              min={1.6}
              max={25}
              step={0.1}
              value={gravity}
              onChange={(e) => {
                setGravity(Number(e.target.value));
                resetPendulum();
              }}
              className="w-full accent-cyan-500"
            />
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Period (T):</span>
              <span className="text-cyan-300 font-mono font-bold">{period.toFixed(2)} s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Frequency (f):</span>
              <span className="text-cyan-300 font-mono font-bold">{frequency.toFixed(2)} Hz</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
