import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';
import { monthlyAttendance, todayTimetable, subjectGrades, performanceData, syllabusData, feeLedger, challanData, studentProfile } from '@/lib/mockData';

async function withTimeout<T>(promise: Promise<T>, ms = 1200): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(val => { clearTimeout(id); resolve(val); }).catch(err => { clearTimeout(id); reject(err); });
  });
}

async function tryFetch<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await withTimeout(fn(), 1200);
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    const supabase = createAdminClient();

    switch (action) {
      case 'student': {
        const data = await tryFetch(async () => {
          const { data: profile } = await supabase.from('profiles').select('*').limit(1).single();
          const { data: student } = await supabase.from('students').select('*').limit(1).single();
          return { ...profile, ...student };
        });
        return NextResponse.json(data || studentProfile);
      }

      case 'attendance': {
        const data = await tryFetch(async () => {
          const { data: attendance, error } = await supabase.from('attendance').select('*').limit(30);
          if (error || !attendance?.length) throw new Error('empty');
          const totalDays = attendance.length;
          const present = attendance.filter((a: any) => a.status === 'present').length;
          const absent = attendance.filter((a: any) => a.status === 'absent').length;
          const leaves = attendance.filter((a: any) => a.status === 'leave').length;
          return {
            timetable: todayTimetable,
            monthly: { totalDays, present, absent, leaves, records: attendance }
          };
        });
        return NextResponse.json(data || { timetable: todayTimetable, monthly: monthlyAttendance });
      }

      case 'academics': {
        const data = await tryFetch(async () => {
          const { data: assessments, error } = await supabase.from('assessments').select('*').limit(50);
          if (error || !assessments?.length) throw new Error('empty');
          return { grades: subjectGrades, performance: performanceData, syllabus: syllabusData };
        });
        return NextResponse.json(data || { grades: subjectGrades, performance: performanceData, syllabus: syllabusData });
      }

      case 'fees': {
        const data = await tryFetch(async () => {
          const { data: fees, error } = await supabase.from('fees').select('*').limit(20);
          if (error || !fees?.length) throw new Error('empty');
          return { ledger: feeLedger, challan: challanData };
        });
        return NextResponse.json(data || { ledger: feeLedger, challan: challanData });
      }

      default:
        return NextResponse.json({ timetable: todayTimetable, monthly: monthlyAttendance, grades: subjectGrades, performance: performanceData, syllabus: syllabusData, ledger: feeLedger, challan: challanData });
    }
  } catch {
    return NextResponse.json({ timetable: todayTimetable, monthly: monthlyAttendance, grades: subjectGrades, performance: performanceData, syllabus: syllabusData, ledger: feeLedger, challan: challanData });
  }
}
