import { useState } from 'react';
import {
  BookOpen,
  Zap,
  HelpCircle,
  Calculator,
  Compass,
  Award,
  Sparkles,
  Flame,
  Activity
} from 'lucide-react';

import { ProjectileSim } from './components/simulations/ProjectileSim';
import { GrapherSim } from './components/simulations/GrapherSim';
import { PendulumSim } from './components/simulations/PendulumSim';
import { LessonView } from './components/lessons/LessonView';
import { FormulaSolver } from './components/formulas/FormulaSolver';
import { ScientificCalculator } from './components/calculator/ScientificCalculator';
import { QuizEngine } from './components/quiz/QuizEngine';

type ActiveTab = 'dashboard' | 'lessons' | 'simulations' | 'quizzes' | 'formulas' | 'calculator';
type ActiveSimSubtab = 'projectile' | 'grapher' | 'pendulum';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [activeSim, setActiveSim] = useState<ActiveSimSubtab>('projectile');

  // User Stats & Local Progress
  const [completedLessons, setCompletedLessons] = useState<string[]>(['kinematics-101']);
  const [totalPoints, setTotalPoints] = useState<number>(120);

  const handleCompleteLesson = (id: string) => {
    if (!completedLessons.includes(id)) {
      setCompletedLessons((prev) => [...prev, id]);
      setTotalPoints((prev) => prev + 25);
    }
  };

  const handleScoreUpdate = (points: number) => {
    setTotalPoints((prev) => prev + points);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <AtomIcon className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              QuantumVerse Academy
            </h1>
            <span className="text-[10px] text-slate-400 block tracking-wider uppercase font-medium">
              Interactive Physics & Mathematics Hub
            </span>
          </div>
        </div>

        {/* Global Progress Badges */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-amber-300">{totalPoints} PTS</span>
          </div>
          <div className="flex items-center gap-1.5 bg-indigo-950/80 px-3 py-1.5 rounded-xl border border-indigo-500/30 text-xs text-indigo-300 font-bold">
            <Award className="w-4 h-4 text-indigo-400" />
            <span>Mastery Lvl {Math.floor(totalPoints / 50) + 1}</span>
          </div>
        </div>
      </header>

      {/* Main Tab Navigation Bar */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-8 py-2 overflow-x-auto">
        <div className="flex gap-2 max-w-7xl mx-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Compass },
            { id: 'lessons', label: 'Lessons Hub', icon: BookOpen },
            { id: 'simulations', label: 'Simulators', icon: Zap },
            { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
            { id: 'formulas', label: 'Formula Solver', icon: Sparkles },
            { id: 'calculator', label: 'Calculator', icon: Calculator },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-indigo-900/60 via-slate-800 to-purple-900/60 border border-indigo-500/30 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
              <div className="relative z-10 max-w-2xl space-y-4">
                <span className="text-xs uppercase tracking-widest font-bold text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-500/30 inline-block">
                  Next-Gen Learning Portal
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  Explore Physics & Mathematics through Live Visual Simulations
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Interactive projectile dynamics, function graphing, formula auto-solvers, and gamified quiz assessments engineered for deep conceptual understanding.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('simulations')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition-all shadow-lg"
                  >
                    <Zap className="w-4 h-4" /> Launch Projectile Simulator
                  </button>
                  <button
                    onClick={() => setActiveTab('lessons')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs border border-slate-700 transition-all"
                  >
                    <BookOpen className="w-4 h-4" /> Browse Lessons
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => {
                  setActiveTab('simulations');
                  setActiveSim('projectile');
                }}
                className="bg-slate-800/80 border border-slate-700/60 hover:border-indigo-500/60 p-6 rounded-2xl cursor-pointer transition-all shadow-xl space-y-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">2D Projectile Simulator</h3>
                <p className="text-xs text-slate-400">
                  Simulate ballistics on Earth, Mars, or Moon with live angle/velocity vectors and hit targets.
                </p>
              </div>

              <div
                onClick={() => {
                  setActiveTab('simulations');
                  setActiveSim('grapher');
                }}
                className="bg-slate-800/80 border border-slate-700/60 hover:border-purple-500/60 p-6 rounded-2xl cursor-pointer transition-all shadow-xl space-y-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Interactive Function Grapher</h3>
                <p className="text-xs text-slate-400">
                  Plot quadratics, sine waves, and polynomials while exploring live roots and transformations.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('quizzes')}
                className="bg-slate-800/80 border border-slate-700/60 hover:border-amber-500/60 p-6 rounded-2xl cursor-pointer transition-all shadow-xl space-y-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Interactive Assessment</h3>
                <p className="text-xs text-slate-400">
                  Test your knowledge, build question streaks, and earn mastery points.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Lessons Tab */}
        {activeTab === 'lessons' && (
          <LessonView onCompleteLesson={handleCompleteLesson} completedLessons={completedLessons} />
        )}

        {/* Simulations Tab */}
        {activeTab === 'simulations' && (
          <div className="space-y-6">
            {/* Simulation Subtabs */}
            <div className="flex gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 max-w-md">
              {[
                { id: 'projectile', label: 'Projectile Motion' },
                { id: 'grapher', label: 'Function Grapher' },
                { id: 'pendulum', label: 'Pendulum Motion' },
              ].map((sim) => (
                <button
                  key={sim.id}
                  onClick={() => setActiveSim(sim.id as ActiveSimSubtab)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeSim === sim.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sim.label}
                </button>
              ))}
            </div>

            {activeSim === 'projectile' && <ProjectileSim />}
            {activeSim === 'grapher' && <GrapherSim />}
            {activeSim === 'pendulum' && <PendulumSim />}
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && <QuizEngine onScoreUpdate={handleScoreUpdate} />}

        {/* Formulas Tab */}
        {activeTab === 'formulas' && <FormulaSolver />}

        {/* Calculator Tab */}
        {activeTab === 'calculator' && <ScientificCalculator />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-6 px-8 text-center text-xs text-slate-500 mt-12">
        <p>© 2026 QuantumVerse Academy • Physics & Mathematics Interactive Learning Platform</p>
      </footer>
    </div>
  );
}

function AtomIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="2" />
      <ellipse cx="12" cy="12" rx="9" ry="3" />
      <ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(120 12 12)" />
    </svg>
  );
}
