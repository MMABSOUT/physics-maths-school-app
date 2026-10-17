import React, { useState, useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';

type FunctionType = 'quadratic' | 'sine' | 'linear' | 'cubic';

export const GrapherSim: React.FC = () => {
  const [funcType, setFuncType] = useState<FunctionType>('quadratic');
  const [paramA, setParamA] = useState<number>(1);
  const [paramB, setParamB] = useState<number>(0);
  const [paramC, setParamC] = useState<number>(-4);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const evaluateFunction = (x: number): number => {
    switch (funcType) {
      case 'quadratic':
        return paramA * x * x + paramB * x + paramC;
      case 'sine':
        return paramA * Math.sin(paramB * x + paramC);
      case 'linear':
        return paramA * x + paramB;
      case 'cubic':
        return paramA * Math.pow(x, 3) + paramB * x + paramC;
      default:
        return x;
    }
  };

  const getEquationText = () => {
    switch (funcType) {
      case 'quadratic':
        return `f(x) = ${paramA}x² ${paramB >= 0 ? '+' : ''}${paramB}x ${paramC >= 0 ? '+' : ''}${paramC}`;
      case 'sine':
        return `f(x) = ${paramA} · sin(${paramB}x ${paramC >= 0 ? '+' : ''}${paramC})`;
      case 'linear':
        return `f(x) = ${paramA}x ${paramB >= 0 ? '+' : ''}${paramB}`;
      case 'cubic':
        return `f(x) = ${paramA}x³ ${paramB >= 0 ? '+' : ''}${paramB}x ${paramC >= 0 ? '+' : ''}${paramC}`;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Coordinate system setup (-10 to +10 for x and y)
    const minX = -10;
    const maxX = 10;
    const minY = -10;
    const maxY = 10;

    const toCanvasX = (x: number) => ((x - minX) / (maxX - minX)) * width;
    const toCanvasY = (y: number) => height - ((y - minY) / (maxY - minY)) * height;

    // Draw grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;

    for (let x = minX; x <= maxX; x += 1) {
      const cx = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.stroke();
    }

    for (let y = minY; y <= maxY; y += 1) {
      const cy = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;

    // X Axis
    const originY = toCanvasY(0);
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Y Axis
    const originX = toCanvasX(0);
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Axis numbers
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '10px monospace';

    for (let x = minX; x <= maxX; x += 2) {
      if (x !== 0) ctx.fillText(x.toString(), toCanvasX(x) - 6, originY + 14);
    }
    for (let y = minY; y <= maxY; y += 2) {
      if (y !== 0) ctx.fillText(y.toString(), originX + 6, toCanvasY(y) + 4);
    }

    // Plot Curve
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 3;
    ctx.beginPath();

    let isFirst = true;
    for (let px = 0; px <= width; px += 1) {
      const x = minX + (px / width) * (maxX - minX);
      const y = evaluateFunction(x);
      const py = toCanvasY(y);

      if (py >= 0 && py <= height) {
        if (isFirst) {
          ctx.moveTo(px, py);
          isFirst = false;
        } else {
          ctx.lineTo(px, py);
        }
      } else {
        isFirst = true;
      }
    }
    ctx.stroke();

    // Find & mark roots (where y ≈ 0)
    ctx.fillStyle = '#38bdf8';
    for (let x = minX; x <= maxX; x += 0.05) {
      const y1 = evaluateFunction(x);
      const y2 = evaluateFunction(x + 0.05);
      if (y1 * y2 <= 0) {
        const rootX = x;
        const cx = toCanvasX(rootX);
        const cy = toCanvasY(0);
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [funcType, paramA, paramB, paramC]);

  return (
    <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            Interactive Function Grapher
          </h2>
          <p className="text-xs text-slate-400">
            Plot functions in real-time, inspect roots, and test coefficient transformations.
          </p>
        </div>
        <div className="bg-purple-950/60 border border-purple-500/40 px-4 py-2 rounded-xl text-purple-200 font-mono text-sm font-bold">
          {getEquationText()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-center">
          <canvas ref={canvasRef} width={600} height={400} className="w-full h-auto max-h-[400px] object-contain" />
        </div>

        <div className="space-y-5 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Function Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['quadratic', 'sine', 'linear', 'cubic'] as FunctionType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setFuncType(type)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                    funcType === type
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Parameter A</span>
                <span className="text-purple-400 font-mono">{paramA}</span>
              </div>
              <input
                type="range"
                min={-5}
                max={5}
                step={0.5}
                value={paramA}
                onChange={(e) => setParamA(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Parameter B</span>
                <span className="text-purple-400 font-mono">{paramB}</span>
              </div>
              <input
                type="range"
                min={-5}
                max={5}
                step={0.5}
                value={paramB}
                onChange={(e) => setParamB(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Parameter C (Offset)</span>
                <span className="text-purple-400 font-mono">{paramC}</span>
              </div>
              <input
                type="range"
                min={-8}
                max={8}
                step={0.5}
                value={paramC}
                onChange={(e) => setParamC(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
