import React, { useState } from 'react';
import { LESSONS } from '../../data/lessons';
import { Lesson } from '../../types';
import { BookOpen, CheckCircle, Clock, Search, ChevronRight } from 'lucide-react';

interface LessonViewProps {
  onCompleteLesson: (id: string) => void;
  completedLessons: string[];
}

export const LessonView: React.FC<LessonViewProps> = ({ onCompleteLesson, completedLessons }) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(LESSONS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSubjectFilter, setActiveSubjectFilter] = useState<'all' | 'physics' | 'maths'>('all');

  // Interactive Parameter state inside lesson content
  const [paramValues, setParamValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    if (selectedLesson.content.interactiveParams) {
      selectedLesson.content.interactiveParams.forEach((p) => {
        initial[p.name] = p.defaultVal;
      });
    }
    return initial;
  });

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    const initial: Record<string, number> = {};
    if (lesson.content.interactiveParams) {
      lesson.content.interactiveParams.forEach((p) => {
        initial[p.name] = p.defaultVal;
      });
    }
    setParamValues(initial);
  };

  const filteredLessons = LESSONS.filter((l) => {
    const matchesSubject = activeSubjectFilter === 'all' || l.subject === activeSubjectFilter;
    const matchesSearch =
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const isCompleted = completedLessons.includes(selectedLesson.id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sidebar Lesson List */}
      <div className="lg:col-span-4 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 shadow-xl flex flex-col space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h2 className="font-bold text-white text-lg">Curriculum Hub</h2>
        </div>

        {/* Filter Controls */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topics or concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            {(['all', 'physics', 'maths'] as const).map((subject) => (
              <button
                key={subject}
                onClick={() => setActiveSubjectFilter(subject)}
                className={`flex-1 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  activeSubjectFilter === subject
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Lesson Cards List */}
        <div className="space-y-2.5 overflow-y-auto max-h-[500px] pr-1">
          {filteredLessons.map((lesson) => {
            const isDone = completedLessons.includes(lesson.id);
            const isSelected = selectedLesson.id === lesson.id;
            return (
              <button
                key={lesson.id}
                onClick={() => handleSelectLesson(lesson)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-indigo-950/60 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                        lesson.subject === 'physics'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}
                    >
                      {lesson.subject}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {lesson.readTime}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-slate-100 line-clamp-1">{lesson.title}</h3>
                </div>

                {isDone ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Detailed Content View */}
      <div className="lg:col-span-8 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
                {selectedLesson.category}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{selectedLesson.difficulty} Level</span>
            </div>
            <h1 className="text-2xl font-bold text-white">{selectedLesson.title}</h1>
          </div>

          <button
            onClick={() => onCompleteLesson(selectedLesson.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
              isCompleted
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            {isCompleted ? 'Topic Completed' : 'Mark as Complete'}
          </button>
        </div>

        {/* Overview Paragraph */}
        <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <h4 className="text-indigo-300 font-semibold mb-2 text-base">Core Overview</h4>
          <p>{selectedLesson.content.overview}</p>
        </div>

        {/* Key Concepts List */}
        <div>
          <h3 className="text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider">Key Principles</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedLesson.content.keyConcepts.map((concept, idx) => (
              <li
                key={idx}
                className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                <span>{concept}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Equations */}
        {selectedLesson.content.equations.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider">Formulas & Equations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedLesson.content.equations.map((eq, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-indigo-400 block">{eq.name}</span>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg font-mono text-cyan-300 text-sm font-bold text-center border border-slate-800/80">
                    {eq.latex}
                  </div>
                  <p className="text-[11px] text-slate-400">{eq.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Parameter Sandbox */}
        {selectedLesson.content.interactiveParams && (
          <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 p-5 rounded-xl border border-indigo-500/30 space-y-4">
            <h3 className="text-sm font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-2">
              Interactive Variable Sandbox
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedLesson.content.interactiveParams.map((param) => (
                <div key={param.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">{param.name} ({param.symbol})</span>
                    <span className="text-indigo-300 font-mono font-bold">
                      {paramValues[param.name] ?? param.defaultVal} {param.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={paramValues[param.name] ?? param.defaultVal}
                    onChange={(e) =>
                      setParamValues((prev) => ({ ...prev, [param.name]: Number(e.target.value) }))
                    }
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Computed Output */}
            {selectedLesson.content.computeResult && (
              <div className="pt-3 border-t border-indigo-500/20 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {selectedLesson.content.computeResult(paramValues).map((res, idx) => (
                  <div key={idx} className="bg-slate-900/90 p-3 rounded-lg border border-indigo-500/30 text-center">
                    <span className="text-[10px] uppercase text-slate-400 block">{res.label}</span>
                    <span className="text-base font-mono font-bold text-indigo-300">
                      {res.value} {res.unit}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Real World Example */}
        <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-xl text-xs text-amber-200/90">
          <span className="font-bold text-amber-400 block mb-1">Real World Application</span>
          <p>{selectedLesson.content.realWorldExample}</p>
        </div>
      </div>
    </div>
  );
};
