import React, { useState } from 'react';
import { FORMULAS } from '../../data/formulas';
import { Formula } from '../../types';
import { Calculator, Sparkles } from 'lucide-react';

export const FormulaSolver: React.FC = () => {
  const [selectedFormula, setSelectedFormula] = useState<Formula>(FORMULAS[0]);
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [result, setResult] = useState<string | null>(null);

  const handleSelectFormula = (formula: Formula) => {
    setSelectedFormula(formula);
    setInputs({});
    setResult(null);
  };

  const handleInputChange = (symbol: string, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [symbol]: parseFloat(value) || 0,
    }));
  };

  const solveEquation = () => {
    const id = selectedFormula.id;
    if (id === 'f-kin-1') {
      // v = u + a * t
      const u = inputs['u'] || 0;
      const a = inputs['a'] || 0;
      const t = inputs['t'] || 0;
      const v = u + a * t;
      setResult(`v = ${v.toFixed(2)} m/s`);
    } else if (id === 'f-kin-2') {
      // s = u*t + 0.5*a*t^2
      const u = inputs['u'] || 0;
      const a = inputs['a'] || 0;
      const t = inputs['t'] || 0;
      const s = u * t + 0.5 * a * t * t;
      setResult(`s = ${s.toFixed(2)} m`);
    } else if (id === 'f-dyn-1') {
      // F = m * a
      const m = inputs['m'] || 0;
      const a = inputs['a'] || 0;
      const F = m * a;
      setResult(`F = ${F.toFixed(2)} N`);
    } else if (id === 'f-eng-1') {
      // KE = 0.5 * m * v^2
      const m = inputs['m'] || 0;
      const v = inputs['v'] || 0;
      const ke = 0.5 * m * v * v;
      setResult(`KE = ${ke.toFixed(2)} J`);
    } else if (id === 'f-alg-1') {
      // ax^2 + bx + c = 0
      const a = inputs['a'] || 1;
      const b = inputs['b'] || 0;
      const c = inputs['c'] || 0;
      const disc = b * b - 4 * a * c;
      if (disc < 0) {
        setResult('No real roots (Complex roots exist)');
      } else {
        const x1 = (-b + Math.sqrt(disc)) / (2 * a);
        const x2 = (-b - Math.sqrt(disc)) / (2 * a);
        setResult(`x₁ = ${x1.toFixed(3)}, x₂ = ${x2.toFixed(3)}`);
      }
    } else if (id === 'f-geo-1') {
      // c = sqrt(a^2 + b^2)
      const a = inputs['a'] || 0;
      const b = inputs['b'] || 0;
      const c = Math.sqrt(a * a + b * b);
      setResult(`c = ${c.toFixed(2)} m`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Formula Selector List */}
      <div className="lg:col-span-5 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 shadow-xl space-y-3">
        <h2 className="font-bold text-white text-lg border-b border-slate-700 pb-2 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-cyan-400" /> Equation Reference Hub
        </h2>
        <div className="space-y-2 overflow-y-auto max-h-[500px] pr-1">
          {FORMULAS.map((formula) => {
            const isSelected = selectedFormula.id === formula.id;
            return (
              <button
                key={formula.id}
                onClick={() => handleSelectFormula(formula)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-sm text-slate-100">{formula.name}</h3>
                  <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30">
                    {formula.category}
                  </span>
                </div>
                <div className="font-mono text-xs text-indigo-300 bg-slate-950/60 p-1.5 rounded-md border border-slate-800 font-semibold mb-1">
                  {formula.expression}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{formula.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Solver Pane */}
      <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="border-b border-slate-700 pb-4">
            <span className="text-xs uppercase font-bold tracking-wider text-cyan-400">
              Interactive Solver
            </span>
            <h1 className="text-2xl font-bold text-white">{selectedFormula.name}</h1>
            <p className="text-xs text-slate-400 mt-1">{selectedFormula.description}</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-500 block mb-1">Formula Representation</span>
            <span className="font-mono text-lg font-bold text-indigo-300">
              {selectedFormula.expression}
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Input Variable Values
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedFormula.variables.map((variable) => (
                <div key={variable.symbol} className="space-y-1">
                  <label className="block text-xs font-medium text-slate-300">
                    {variable.name} ({variable.symbol}) {variable.unit ? `[${variable.unit}]` : ''}
                  </label>
                  <input
                    type="number"
                    placeholder={`Enter ${variable.symbol}`}
                    value={inputs[variable.symbol] ?? ''}
                    onChange={(e) => handleInputChange(variable.symbol, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-700">
          <button
            onClick={solveEquation}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Compute Result
          </button>

          {result && (
            <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-xl text-center space-y-1 animate-fade-in">
              <span className="text-xs text-emerald-400 uppercase font-bold tracking-wider">
                Computed Solution
              </span>
              <div className="font-mono text-xl font-bold text-emerald-200">{result}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
