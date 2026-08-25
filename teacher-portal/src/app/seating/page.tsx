import React from 'react';
import { TopBar } from '@/components/AppLayout';
import { Card, Badge } from '@/components/ui';
import { LayoutGrid, Users, MapPin, Clock } from 'lucide-react';

const seatingRows = [
  { row: 'A', seats: ['Ali', 'Zara', 'Bilal', 'Sara', 'Hamza', 'Maryam'] },
  { row: 'B', seats: ['Ayesha', 'Omar', 'Hina', 'Rizwan', 'Sana', 'Usman'] },
  { row: 'C', seats: ['Areeba', 'Fahad', 'Noor', 'Ammar', 'Hassan', 'Zainab'] },
];

const notes = [
  { icon: Clock, title: 'Rotation Plan', description: 'Rotate seating every week to improve class interaction.' },
  { icon: Users, title: 'Group Balance', description: 'Mixed seating to encourage collaboration across skills.' },
  { icon: MapPin, title: 'Special Needs', description: 'Front-side seats reserved for learners needing additional support.' },
];

export default function SeatingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans animate-fade-in-up">
      <TopBar title="Seating Plan" subtitle="Organize classroom seating for your next session" />
      <main className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <Card padding="lg" className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Class Seating Layout</h2>
                <p className="text-sm text-slate-500 mt-1">View and manage seat assignments for your classroom.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 text-cyan-700 px-4 py-2 text-xs font-semibold">
                <LayoutGrid className="w-4 h-4" />
                Standard layout
              </div>
            </div>

            <div className="grid gap-4">
              {seatingRows.map((row) => (
                <div key={row.row} className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Row {row.row}</p>
                      <p className="text-xs text-slate-500">{row.seats.length} students</p>
                    </div>
                    <Badge variant="secondary">Row {row.row}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {row.seats.map((student) => (
                      <div key={student} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700">
                        {student}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            {notes.map((note) => {
              const Icon = note.icon;
              return (
                <Card key={note.title} padding="lg" className="border border-slate-200">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{note.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{note.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
