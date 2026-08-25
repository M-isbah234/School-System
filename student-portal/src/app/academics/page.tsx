"use client";

import React, { useEffect, useState } from 'react';
import { TopBar } from '@/components/AppLayout';
import { ClayCard, ClayBadge, ClayProgress } from '@/components/ui';
import { BookOpen, BarChart3, BookMarked, ChevronDown, ChevronUp, TrendingUp, CheckCircle2, Circle, Calendar } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

// --- GRADEBOOK COMPONENT ---
function Gradebook({ grades }: { grades: any[] }) {
  const [expandedIds, setExpandedIds] = useState<string[]>([grades[0]?.id, grades[1]?.id]);

  const toggleExpand = (id: string) => setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const getBadgeVariant = (percentage: number) => percentage >= 80 ? 'positive' : percentage >= 60 ? 'neutral' : 'negative';
  const getTypeBadgeVariant = (type: string) => ({'Quiz': 'event', 'Class Test': 'info', 'Monthly Test': 'urgent', 'Assignment': 'scheduled'})[type] || 'neutral';

  return (
    <div className="space-y-4">
      {grades.map(subject => {
        const isExpanded = expandedIds.includes(subject.id);
        const percentage = subject.overallPercentage;
        
        return (
          <ClayCard key={subject.id} color="white" className="overflow-hidden transition-all duration-300">
            <div className="p-4 md:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50" onClick={() => toggleExpand(subject.id)}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.02)]">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800">{subject.name}</h4>
                  <p className="text-sm text-slate-500">{subject.teacher}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-6">
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider hidden md:block">Overall</p>
                  <ClayBadge variant={getBadgeVariant(percentage) as any}>{percentage}%</ClayBadge>
                </div>
                <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>

            <div className={`transition-all duration-300 ease-in-out border-t border-slate-100 bg-slate-50/30 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 border-t-0'} overflow-hidden`}>
              <div className="p-4 md:p-6 space-y-3">
                <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 pb-2">
                  <div className="col-span-3">Type</div>
                  <div className="col-span-4">Title</div>
                  <div className="col-span-2 text-center">Marks</div>
                  <div className="col-span-1 text-center">%</div>
                  <div className="col-span-2 text-right">Date</div>
                </div>

                {subject.assessments.map((assessment: any) => {
                  const perc = Math.round((assessment.marksObtained / assessment.totalMarks) * 100);
                  return (
                    <div key={assessment.id} className="bg-white rounded-xl p-4 shadow-[2px_2px_8px_rgba(0,0,0,0.02),_inset_1px_1px_2px_rgba(255,255,255,1)] border border-slate-100">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="col-span-1 md:col-span-3 flex items-center gap-2">
                          <ClayBadge variant={getTypeBadgeVariant(assessment.type) as any}>{assessment.type}</ClayBadge>
                        </div>
                        <div className="col-span-1 md:col-span-4 font-semibold text-slate-700">{assessment.title}</div>
                        <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center">
                          <span className="md:hidden text-xs text-slate-400">Marks</span>
                          <span className="font-bold text-slate-800">{assessment.marksObtained} <span className="text-slate-400 text-sm font-normal">/ {assessment.totalMarks}</span></span>
                        </div>
                        <div className="col-span-1 md:col-span-1 flex justify-between md:justify-center items-center">
                          <span className="md:hidden text-xs text-slate-400">Percentage</span>
                          <span className={`font-bold ${perc >= 80 ? 'text-emerald-600' : perc >= 60 ? 'text-amber-500' : 'text-red-500'}`}>{perc}%</span>
                        </div>
                        <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center text-sm text-slate-500">
                          <span className="md:hidden text-xs text-slate-400">Date</span>{assessment.date}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ClayCard>
        );
      })}
    </div>
  );
}

// --- PERFORMANCE CHART COMPONENT ---
function PerformanceChart({ data }: { data: any[] }) {
  const sortedData = [...data].sort((a, b) => a.percentage - b.percentage);
  const average = Math.round(data.reduce((acc, curr) => acc + curr.percentage, 0) / data.length);

  return (
    <ClayCard color="lavender" className="p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
        <TrendingUp className="text-purple-600" /> Performance Overview
      </h3>
      <div className="flex-1 relative min-h-[350px]">
        <ResponsiveContainer width="100%" height={350}>
          <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={12} data={sortedData} startAngle={90} endAngle={-270}>
            <RadialBar background={{ fill: 'rgba(0,0,0,0.05)' }} dataKey="percentage" cornerRadius={10} />
            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value: any, name: any, props: any) => [`${value}%`, props.payload.subject]} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-bold text-slate-800">{average}%</span>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Average</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-6">
        {data.map((item) => (
          <div key={item.subject} className="flex items-center justify-between bg-white/50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
              <span className="text-xs font-medium text-slate-700">{item.subject}</span>
            </div>
            <span className="text-xs font-bold text-slate-800">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </ClayCard>
  );
}

// --- COURSE HUB COMPONENT ---
function CourseHub({ syllabus }: { syllabus: any[] }) {
  const [activeTerm, setActiveTerm] = useState('First Term');
  const terms = ['First Term', 'Second Term', 'Final'];
  const filteredSyllabus = syllabus.filter(item => item.term === activeTerm);

  return (
    <ClayCard color="cream" className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <BookMarked className="text-amber-600" /> Course Hub & Syllabus
        </h3>
        <div className="flex bg-slate-100 p-1 rounded-2xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)] w-full md:w-auto overflow-x-auto">
          {terms.map(term => (
            <button
              key={term} onClick={() => setActiveTerm(term)}
              className={`flex-1 md:flex-none whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${activeTerm === term ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-[2px_2px_8px_rgba(251,191,36,0.5)]' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {filteredSyllabus.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-white/50 rounded-2xl border border-dashed border-slate-300">No syllabus data available for {activeTerm} yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSyllabus.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-5 shadow-[2px_2px_8px_rgba(0,0,0,0.02),_inset_1px_1px_2px_rgba(255,255,255,0.8)] border border-slate-100 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><BookMarked size={16} /></div>
                  {item.subject}
                </h4>
                <ClayBadge variant="event" className="flex items-center gap-1"><Calendar size={12} /> {item.examDate}</ClayBadge>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                  <span>Syllabus Completion</span><span>{item.completionPercentage}%</span>
                </div>
                <ClayProgress value={item.completionPercentage} color="orange" size="md" />
              </div>
              <div className="mt-auto space-y-2 pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chapters</p>
                {item.chapters.map((chapter: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    {chapter.completed ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> : <Circle size={16} className="text-slate-300 shrink-0" />}
                    <span className={chapter.completed ? 'text-slate-700' : 'text-slate-500'}>{chapter.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </ClayCard>
  );
}

import { subjectGrades, performanceData, syllabusData } from '@/lib/mockData';

export default function AcademicsPage() {
  const [data, setData] = useState<any>({
    grades: subjectGrades,
    performance: performanceData,
    syllabus: syllabusData
  });
  const [activeTab, setActiveTab] = useState<'gradebook' | 'performance' | 'syllabus'>('gradebook');

  useEffect(() => {
    fetch('/api/portal?action=academics')
      .then(res => res.json())
      .then(res => {
        if (res && res.grades?.length) {
          setData({
            grades: res.grades,
            performance: res.performance?.length ? res.performance : performanceData,
            syllabus: res.syllabus?.length ? res.syllabus : syllabusData
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans animate-fade-in-up pb-24 md:pb-6">
      <TopBar title="Academic Log & Analytics" subtitle="Track your grades and syllabus progress" />
      
      <main className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex bg-white p-1.5 rounded-2xl shadow-[inset_2px_2px_6px_rgba(0,0,0,0.03)] overflow-x-auto w-full md:w-fit mx-auto md:mx-0">
          <button onClick={() => setActiveTab('gradebook')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${activeTab === 'gradebook' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-[2px_2px_8px_rgba(59,130,246,0.5)]' : 'text-slate-500 hover:bg-slate-50'}`}>
            <BookOpen size={18} /> Gradebook
          </button>
          <button onClick={() => setActiveTab('performance')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${activeTab === 'performance' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[2px_2px_8px_rgba(168,85,247,0.5)]' : 'text-slate-500 hover:bg-slate-50'}`}>
            <BarChart3 size={18} /> Performance
          </button>
          <button onClick={() => setActiveTab('syllabus')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${activeTab === 'syllabus' ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-[2px_2px_8px_rgba(251,191,36,0.5)]' : 'text-slate-500 hover:bg-slate-50'}`}>
            <BookMarked size={18} /> Course Hub
          </button>
        </div>

        <div className="animate-fade-in-up" key={activeTab}>
          {activeTab === 'gradebook' && <Gradebook grades={data.grades} />}
          {activeTab === 'performance' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2"><PerformanceChart data={data.performance} /></div>
              <div className="space-y-6">
                <ClayCard color="mint" className="p-6">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Strongest Subject</p>
                  <h4 className="text-2xl font-bold text-slate-800">Islamiat</h4>
                  <p className="text-emerald-600 font-semibold mt-1">95% Average</p>
                </ClayCard>
                <ClayCard color="pink" className="p-6">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Needs Improvement</p>
                  <h4 className="text-2xl font-bold text-slate-800">Chemistry</h4>
                  <p className="text-red-500 font-semibold mt-1">68% Average</p>
                </ClayCard>
                <ClayCard color="blue" className="p-6">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Class Rank</p>
                  <h4 className="text-3xl font-bold text-slate-800">4<span className="text-lg">th</span></h4>
                  <p className="text-slate-500 font-medium mt-1">Out of 35 students</p>
                </ClayCard>
              </div>
            </div>
          )}
          {activeTab === 'syllabus' && <CourseHub syllabus={data.syllabus} />}
        </div>
      </main>
    </div>
  );
}
