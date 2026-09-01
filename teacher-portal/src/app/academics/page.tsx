"use client";

import React, { useState, useEffect } from 'react';
import { TopBar } from '@/components/AppLayout';
import { Card, Button } from '@/components/ui';
import { BookOpen, Save, TrendingUp } from 'lucide-react';
import { GradeEntry } from '@/lib/mockData';
import { getGradeBook, updateGrade as updateGradeService } from '@/lib/dataService';
import { supabase } from '@/lib/supabase';

export default function AcademicsPage() {
  const [selectedClass, setSelectedClass] = useState('8-A');
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const classes = ['8-A', '9-A', '10-A'];

  useEffect(() => {
    async function loadGrades() {
      const data = await getGradeBook(selectedClass);
      setGrades(data);
      setLoading(false);
    }

    const handleFocus = () => { void loadGrades(); };
    const handleVisibility = () => { if (!document.hidden) void loadGrades(); };

    void loadGrades();
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    try {
      const channel = supabase.channel('teacher-grades-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'grades' }, () => { void loadGrades(); });

      void channel.subscribe();

      return () => {
        window.removeEventListener('focus', handleFocus);
        document.removeEventListener('visibilitychange', handleVisibility);
        void supabase.removeChannel(channel);
      };
    } catch {
      return () => {
        window.removeEventListener('focus', handleFocus);
        document.removeEventListener('visibilitychange', handleVisibility);
      };
    }
  }, [selectedClass]);

  const handleUpdateGrade = async (studentId: string, field: keyof GradeEntry, value: number) => {
    setSaved(false);
    const updated = await updateGradeService(studentId, field, value);
    setGrades(updated.filter(g => !g.class || g.class === selectedClass));
  };

  const getGradeLetter = (pct: number) => {
    if (pct >= 90) return { letter: 'A+', color: 'text-emerald-600 bg-emerald-50' };
    if (pct >= 80) return { letter: 'A', color: 'text-blue-600 bg-blue-50' };
    if (pct >= 70) return { letter: 'B', color: 'text-purple-600 bg-purple-50' };
    if (pct >= 60) return { letter: 'C', color: 'text-amber-600 bg-amber-50' };
    return { letter: 'D', color: 'text-rose-600 bg-rose-50' };
  };

  const classAvg = grades.length > 0 ? Math.round(grades.reduce((a, g) => a + g.total, 0) / grades.length) : 0;

  return (
    <div className="flex-1 bg-slate-50/50">
      <TopBar title="Manage Grades" subtitle="Enter and update student assessments — Supabase Connected" />

      <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in-up">

        {/* Class selector */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex gap-2">
            {classes.map(cls => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  selectedClass === cls
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-200'
                }`}
              >
                Class {cls}
              </button>
            ))}
          </div>
          <Button icon={<Save size={15} />} onClick={() => setSaved(true)}>
            {saved ? 'Saved ✓' : 'Save Grades'}
          </Button>
        </div>

        {/* Class summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card stat-card-accent accent-blue p-4 text-center">
            <p className="text-3xl font-bold text-slate-900">{classAvg}%</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Class Average</p>
          </div>
          <div className="card stat-card-accent accent-emerald p-4 text-center">
            <p className="text-3xl font-bold text-slate-900">{grades.filter(g => g.total >= 80).length}</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Students A Grade</p>
          </div>
          <div className="card stat-card-accent accent-rose p-4 text-center">
            <p className="text-3xl font-bold text-slate-900">{grades.filter(g => g.total < 60).length}</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Below Average</p>
          </div>
        </div>

        {/* Grade table */}
        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-slate-500" />
              <h3 className="font-bold text-slate-800">Gradebook — Class {selectedClass}</h3>
            </div>
            <span className="text-xs text-slate-400">Click any mark cell to edit</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading gradebook...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student</th>
                    <th className="text-center">Quiz (10)</th>
                    <th className="text-center">Class Test (20)</th>
                    <th className="text-center">Monthly Test (50)</th>
                    <th className="text-center">Assignment (20)</th>
                    <th className="text-center">Total %</th>
                    <th className="text-center">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g, i) => {
                    const grade = getGradeLetter(g.total);
                    return (
                      <tr key={g.studentId}>
                        <td className="text-slate-400 font-mono text-xs">{i + 1}</td>
                        <td>
                          <div>
                            <p className="font-semibold text-slate-900">{g.name}</p>
                            <p className="text-xs text-slate-400">Roll {g.rollNo}</p>
                          </div>
                        </td>
                        {(['quiz', 'classTest', 'monthlyTest', 'assignment'] as (keyof GradeEntry)[]).map(field => {
                          const maxMap: Record<string, number> = { quiz: 10, classTest: 20, monthlyTest: 50, assignment: 20 };
                          const max = maxMap[field];
                          const val = g[field] as number;
                          return (
                            <td key={field} className="text-center">
                              {editingId === g.studentId ? (
                                <input
                                  type="number"
                                  min={0}
                                  max={max}
                                  value={val}
                                  onChange={e => handleUpdateGrade(g.studentId, field, Math.min(max, Number(e.target.value)))}
                                  className="w-16 text-center input py-1 px-2"
                                />
                              ) : (
                                <span
                                  onClick={() => setEditingId(g.studentId)}
                                  className="cursor-pointer font-semibold text-slate-800 hover:text-blue-600 transition-colors"
                                  title="Click to edit"
                                >
                                  {val}/{max}
                                </span>
                              )}
                            </td>
                          );
                        })}
                        <td className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-bold text-slate-900">{g.total}%</span>
                            {g.total >= 90 && <TrendingUp size={12} className="text-emerald-500" />}
                          </div>
                        </td>
                        <td className="text-center">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${grade.color}`}>
                            {grade.letter}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}
