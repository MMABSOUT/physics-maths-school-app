import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Target, Shield, Zap } from 'lucide-react';

interface PlanetPreset {
  name: string;
  gravity: number;
}

const PLANETS: PlanetPreset[] = [
  { name: 'Earth (9.81 m/s²)', gravity: 9.81 },
  { name: 'Moon (1.62 m/s²)', gravity: 1.62 },
  { name: 'Mars (3.72 m/s²)', gravity: 3.72 },
  { name: 'Jupiter (24.79 m/s²)', gravity: 24.79 },
];

export const ProjectileSim: React.FC = () => {
  const [velocity, setVelocity] = useState<number>(40);
  const [angle, setAngle] = useState<number>(45);
  const [initialHeight, setInitialHeight] = useState<number>(10);
  const [gravity, setGravity] = useState<number>(9.81);
  const [targetDist, setTargetDist] = useState<number>(120);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [trajectory, setTrajectory] = useState<{ x: number; y: number }[]>([]);
  const [hitTarget, setHitTarget] = useState<boolean | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Theoretical metrics
  const rad = (angle * Math.PI) / 180;
  const vx0 = velocity * Math.cos(rad);
  const vy0 = velocity * Math.sin(rad);

  // Time of flight: h0 + vy0*t - 0.5*g*t^2 = 0
  const totalFlightTime =
    (vy0 + Math.sqrt(vy0 * vy0 + 2 * gravity * initialHeight)) / gravity;
  const maxRange = vx0 * totalFlightTime;
  const maxHeight = initialHeight + (vy0 * vy0) / (2 * gravity);

  // Current positions
  const currentX = vx0 * currentTime;
  const currentY = Math.max(0, initialHeight + vy0 * currentTime - 0.5 * gravity * currentTime * currentTime);
  const currentVy = vy0 - gravity * currentTime;
  const currentV = Math.sqrt(vx0 * vx0 + currentVy * currentVy);

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setTrajectory([]);
    setHitTarget(null);
  };

  const handleStartPause = () => {
    if (currentTime >= totalFlightTime) {
      resetSimulation();
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  useEffect(() => {
    const animate = (time: number) => {
      if (lastTimeRef.current !== null && isRunning) {
        const delta = (time - lastTimeRef.current) / 1000;
        setCurrentTime((prev) => {
          const next = prev + delta * 1.5; // 1.5x speed multiplier for smooth viewing
          if (next >= totalFlightTime) {
            setIsRunning(false);
            const finalX = vx0 * totalFlightTime;
            if (Math.abs(finalX - targetDist) <= 8) {
              setHitTarget(true);
            } else {
              setHitTarget(false);
            }
            return totalFlightTime;
          }
          return next;
        });
      }
      lastTimeRef.current = time;
      if (isRunning) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    if (isRunning) {
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, totalFlightTime, vx0, targetDist]);

  // Update trajectory array
  useEffect(() => {
    if (currentTime > 0) {
      setTrajectory((prev) => {
        const lastPoint = prev[prev.length - 1];
        if (!lastPoint || Math.abs(lastPoint.x - currentX) > 1) {
          return [...prev, { x: currentX, y: currentY }];
        }
        return prev;
      });
    }
  }, [currentTime, currentX, currentY]);

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Scale calculation (meters to pixels)
    const padding = 50;
    const maxMetersX = Math.max(200, maxRange + 40, targetDist + 30);
    const maxMetersY = Math.max(100, maxHeight + 30);

    const scaleX = (width - padding * 2) / maxMetersX;
    const scaleY = (height - padding * 2) / maxMetersY;
    const scale = Math.min(scaleX, scaleY);

    const originX = padding;
    const originY = height - padding;

    const toCanvasX = (x: number) => originX + x * scale;
    const toCanvasY = (y: number) => originY - y * scale;

    // Draw grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;

    for (let x = 0; x <= maxMetersX; x += 20) {
      const cx = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText(`${x}m`, cx - 10, height - 10);
    }

    for (let y = 0; y <= maxMetersY; y += 20) {
      const cy = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();

      if (y > 0) {
        ctx.fillStyle = '#64748b';
        ctx.fillText(`${y}m`, 10, cy + 4);
      }
    }

    // Draw Ground
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Draw Target
    const targetX = toCanvasX(targetDist);
    ctx.fillStyle = hitTarget === true ? '#22c55e' : hitTarget === false ? '#ef4444' : '#f59e0b';
    ctx.beginPath();
    ctx.arc(targetX, originY, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(targetX, originY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw Launcher Cannon
    const cannonX = toCanvasX(0);
    const cannonY = toCanvasY(initialHeight);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cannonX, cannonY);
    ctx.lineTo(
      cannonX + Math.cos(rad) * 30,
      cannonY - Math.sin(rad) * 30
    );
    ctx.stroke();

    // Draw Full Predicted Trajectory Curve (dashed line)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    for (let t = 0; t <= totalFlightTime; t += totalFlightTime / 100) {
      const px = vx0 * t;
      const py = Math.max(0, initialHeight + vy0 * t - 0.5 * gravity * t * t);
      if (t === 0) ctx.moveTo(toCanvasX(px), toCanvasY(py));
      else ctx.lineTo(toCanvasX(px), toCanvasY(py));
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Actual Travel Trajectory
    if (trajectory.length > 0) {
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      trajectory.forEach((pt, index) => {
        const cx = toCanvasX(pt.x);
        const cy = toCanvasY(pt.y);
        if (index === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      });
      ctx.stroke();
    }

    // Draw Projectile Ball
    const ballX = toCanvasX(currentX);
    const ballY = toCanvasY(currentY);

    ctx.shadowColor = '#6366f1';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#818cf8';
    ctx.beginPath();
    ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Velocity Vector Arrow
    if (isRunning || currentTime > 0) {
      const arrowLen = Math.min(50, currentV * 0.8);
      const arrowAngle = Math.atan2(currentVy, vx0);
      const endX = ballX + arrowLen * Math.cos(arrowAngle);
      const endY = ballY - arrowLen * Math.sin(arrowAngle);

      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ballX, ballY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  }, [trajectory, currentX, currentY, currentVy, vx0, vy0, rad, initialHeight, gravity, totalFlightTime, targetDist, hitTarget, currentV, maxHeight, maxRange]);

  return (
    <div className="space-y-6">
      {/* Simulation Header / Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800/90 border border-slate-700/60 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-400" />
                2D Projectile Simulator
              </h2>
              <p className="text-xs text-slate-400">
                Simulate trajectory with variable launch angle, velocity, and gravity.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleStartPause}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isRunning ? 'Pause' : currentTime >= totalFlightTime ? 'Restart' : 'Launch'}
              </button>
              <button
                onClick={resetSimulation}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>

          {/* Interactive Canvas */}
          <div className="relative flex-1 bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full h-auto max-h-[420px] object-contain"
            />

            {/* Target Hit / Miss Banner */}
            {hitTarget !== null && !isRunning && currentTime >= totalFlightTime && (
              <div
                className={`absolute top-4 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full border shadow-2xl font-bold flex items-center gap-2 animate-bounce ${
                  hitTarget
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                }`}
              >
                {hitTarget ? (
                  <>
                    <Target className="w-5 h-5 text-emerald-400" /> Direct Hit! Target Destroyed!
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 text-rose-400" /> Target Missed ({currentX.toFixed(1)}m)
                  </>
                )}
              </div>
            )}
          </div>

          {/* Live Dynamic Readouts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">Time (t)</span>
              <span className="text-lg font-mono font-bold text-indigo-300">
                {currentTime.toFixed(2)}s
              </span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">Distance (x)</span>
              <span className="text-lg font-mono font-bold text-cyan-300">
                {currentX.toFixed(1)} m
              </span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">Altitude (y)</span>
              <span className="text-lg font-mono font-bold text-emerald-300">
                {currentY.toFixed(1)} m
              </span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">Velocity (v)</span>
              <span className="text-lg font-mono font-bold text-rose-300">
                {currentV.toFixed(1)} m/s
              </span>
            </div>
          </div>
        </div>

        {/* Controls Column */}
        <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-5">
          <h3 className="font-bold text-slate-100 border-b border-slate-700 pb-2">
            Parameters & Environment
          </h3>

          <div className="space-y-4 text-sm">
            {/* Launch Velocity */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Initial Velocity (v₀)</span>
                <span className="text-indigo-400 font-mono">{velocity} m/s</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={velocity}
                onChange={(e) => {
                  setVelocity(Number(e.target.value));
                  resetSimulation();
                }}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Launch Angle */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Launch Angle (θ)</span>
                <span className="text-indigo-400 font-mono">{angle}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={90}
                value={angle}
                onChange={(e) => {
                  setAngle(Number(e.target.value));
                  resetSimulation();
                }}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Initial Height */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Initial Elevation (h₀)</span>
                <span className="text-indigo-400 font-mono">{initialHeight} m</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                value={initialHeight}
                onChange={(e) => {
                  setInitialHeight(Number(e.target.value));
                  resetSimulation();
                }}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Target Distance */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Target Location</span>
                <span className="text-amber-400 font-mono">{targetDist} m</span>
              </div>
              <input
                type="range"
                min={40}
                max={250}
                step={5}
                value={targetDist}
                onChange={(e) => {
                  setTargetDist(Number(e.target.value));
                  resetSimulation();
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Planetary Gravity Preset */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Environment Gravity
              </label>
              <select
                value={gravity}
                onChange={(e) => {
                  setGravity(Number(e.target.value));
                  resetSimulation();
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {PLANETS.map((p) => (
                  <option key={p.name} value={p.gravity}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Theoretical Summary Card */}
          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 text-xs space-y-2">
            <span className="font-bold text-slate-300 block mb-1">Theoretical Metrics</span>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Range:</span>
              <span className="text-slate-200 font-mono font-semibold">{maxRange.toFixed(1)} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Peak Height:</span>
              <span className="text-slate-200 font-mono font-semibold">{maxHeight.toFixed(1)} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Flight Time:</span>
              <span className="text-slate-200 font-mono font-semibold">{totalFlightTime.toFixed(2)} s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
