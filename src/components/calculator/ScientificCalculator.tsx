import React, { useState } from 'react';
import { Delete, Equal, RotateCcw } from 'lucide-react';

export const ScientificCalculator: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [history, setHistory] = useState<string>('');

  const appendSymbol = (sym: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(sym);
    } else {
      setDisplay(display + sym);
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setHistory('');
  };

  const deleteLast = () => {
    if (display.length <= 1 || display === 'Error') {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const evaluateExpression = () => {
    try {
      setHistory(display);
      let expr = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/\^/g, '**');

      // Controlled evaluation
      const res = new Function(`return ${expr}`)();
      if (typeof res === 'number' && !isNaN(res)) {
        setDisplay(Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(6)).toString());
      } else {
        setDisplay('Error');
      }
    } catch {
      setDisplay('Error');
    }
  };

  const buttons = [
    { label: 'sin', action: () => appendSymbol('sin('), type: 'fn' },
    { label: 'cos', action: () => appendSymbol('cos('), type: 'fn' },
    { label: 'tan', action: () => appendSymbol('tan('), type: 'fn' },
    { label: 'π', action: () => appendSymbol('π'), type: 'fn' },
    { label: 'e', action: () => appendSymbol('e'), type: 'fn' },

    { label: 'sqrt', action: () => appendSymbol('sqrt('), type: 'fn' },
    { label: 'ln', action: () => appendSymbol('ln('), type: 'fn' },
    { label: '^', action: () => appendSymbol('^'), type: 'fn' },
    { label: '(', action: () => appendSymbol('('), type: 'fn' },
    { label: ')', action: () => appendSymbol(')'), type: 'fn' },

    { label: '7', action: () => appendSymbol('7'), type: 'num' },
    { label: '8', action: () => appendSymbol('8'), type: 'num' },
    { label: '9', action: () => appendSymbol('9'), type: 'num' },
    { label: '÷', action: () => appendSymbol('÷'), type: 'op' },
    { label: 'AC', action: clearAll, type: 'clear' },

    { label: '4', action: () => appendSymbol('4'), type: 'num' },
    { label: '5', action: () => appendSymbol('5'), type: 'num' },
    { label: '6', action: () => appendSymbol('6'), type: 'num' },
    { label: '×', action: () => appendSymbol('×'), type: 'op' },
    { label: 'DEL', action: deleteLast, type: 'clear' },

    { label: '1', action: () => appendSymbol('1'), type: 'num' },
    { label: '2', action: () => appendSymbol('2'), type: 'num' },
    { label: '3', action: () => appendSymbol('3'), type: 'num' },
    { label: '-', action: () => appendSymbol('-'), type: 'op' },
    { label: '=', action: evaluateExpression, type: 'equal' },

    { label: '0', action: () => appendSymbol('0'), type: 'num' },
    { label: '.', action: () => appendSymbol('.'), type: 'num' },
    { label: '+', action: () => appendSymbol('+'), type: 'op' },
  ];

  return (
    <div className="max-w-md mx-auto bg-slate-800/90 border border-slate-700/60 rounded-2xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-700 pb-3">
        <h2 className="font-bold text-white text-lg">Scientific Calculator</h2>
        <span className="text-xs text-indigo-400 font-mono">Precision mode</span>
      </div>

      {/* Screen Display */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-right space-y-1">
        <div className="text-xs text-slate-500 font-mono h-4 overflow-hidden">{history}</div>
        <div className="text-2xl font-mono font-bold text-slate-100 tracking-wider truncate">
          {display}
        </div>
      </div>

      {/* Button Grid */}
      <div className="grid grid-cols-5 gap-2">
        {buttons.map((btn, idx) => {
          let btnStyle = 'bg-slate-900 text-slate-200 hover:bg-slate-700';
          if (btn.type === 'fn') btnStyle = 'bg-slate-800 text-purple-400 hover:bg-slate-700 font-mono text-xs';
          if (btn.type === 'op') btnStyle = 'bg-indigo-900/60 text-indigo-300 hover:bg-indigo-800/80 font-bold';
          if (btn.type === 'clear') btnStyle = 'bg-rose-950/60 text-rose-300 hover:bg-rose-900/80 text-xs font-bold';
          if (btn.type === 'equal') btnStyle = 'bg-indigo-600 text-white hover:bg-indigo-500 row-span-2 font-bold';

          return (
            <button
              key={idx}
              onClick={btn.action}
              className={`p-3 rounded-xl transition-all font-semibold flex items-center justify-center ${btnStyle}`}
            >
              {btn.label === 'DEL' ? (
                <Delete className="w-4 h-4" />
              ) : btn.label === 'AC' ? (
                <RotateCcw className="w-4 h-4" />
              ) : btn.label === '=' ? (
                <Equal className="w-5 h-5" />
              ) : (
                btn.label
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
