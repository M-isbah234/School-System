// ============================================================
// TEACHER MOCK DATA — 15 Students, 3 Classes, 7 Teachers
// ============================================================

export const teacherProfile = {
  id: 'TCH-001',
  name: 'Mr. Tariq Mehmood',
  department: 'Science Dept',
  subjects: ['Mathematics'],
  classes: ['8-A', '9-A', '10-A'],
  campus: 'Gulshan Campus',
  phone: '+92-300-1122334',
  email: 'tariq.m@school.edu.pk',
  joinDate: '2018-08-01',
};

export const availableTeachers = [
  { id: 'TCH-001', name: 'Mr. Tariq Mehmood', department: 'Science', subjects: ['Mathematics'], classes: ['8-A', '9-A'] },
  { id: 'TCH-002', name: 'Mr. Salman Farooq', department: 'Science', subjects: ['Physics'], classes: ['9-A', '10-A'] },
  { id: 'TCH-003', name: 'Ms. Ayesha Siddiqui', department: 'Languages', subjects: ['English'], classes: ['8-A', '10-A'] },
  { id: 'TCH-004', name: 'Mr. Kamran Baig', department: 'Languages', subjects: ['Urdu'], classes: ['8-A', '9-A', '10-A'] },
  { id: 'TCH-005', name: 'Ms. Sana Mirza', department: 'Science', subjects: ['Chemistry'], classes: ['9-A', '10-A'] },
  { id: 'TCH-006', name: 'Mr. Owais Raza', department: 'Computer', subjects: ['Computer Science'], classes: ['8-A', '9-A', '10-A'] },
  { id: 'TCH-007', name: 'Ms. Hira Noor', department: 'Social Studies', subjects: ['Pakistan Studies'], classes: ['8-A', '9-A'] },
];

export const todaySchedule = [
  { period: '1st Period', time: '08:00 AM - 08:45 AM', subject: 'Mathematics', class: '8-A', status: 'completed', room: 'Room 101' },
  { period: '2nd Period', time: '08:45 AM - 09:30 AM', subject: 'Mathematics', class: '9-A', status: 'completed', room: 'Room 102' },
  { period: '3rd Period', time: '09:30 AM - 10:15 AM', subject: 'Free Period', class: '-', status: 'current', room: '-' },
  { period: '4th Period', time: '10:45 AM - 11:30 AM', subject: 'Mathematics', class: '10-A', status: 'upcoming', room: 'Room 103' },
];

// 36 Students partitioned into 3 classes with 12 students each (0 overlap!)
export const classStudents = [
  // Class 8-A (12 Students)
  { id: 'STU-001', rollNo: '01', name: 'Ahmed Raza Khan', class: '8-A', attendance: 92 },
  { id: 'STU-002', rollNo: '02', name: 'Sara Fatima', class: '8-A', attendance: 96 },
  { id: 'STU-003', rollNo: '03', name: 'Muhammad Bilal', class: '8-A', attendance: 90 },
  { id: 'STU-004', rollNo: '04', name: 'Zainab Abid', class: '8-A', attendance: 88 },
  { id: 'STU-005', rollNo: '05', name: 'Usman Ghani', class: '8-A', attendance: 94 },
  { id: 'STU-006', rollNo: '06', name: 'Rayyan Ahmed', class: '8-A', attendance: 91 },
  { id: 'STU-007', rollNo: '07', name: 'Maryam Nawaz', class: '8-A', attendance: 95 },
  { id: 'STU-008', rollNo: '08', name: 'Bilal Shah', class: '8-A', attendance: 89 },
  { id: 'STU-009', rollNo: '09', name: 'Alisha Imran', class: '8-A', attendance: 93 },
  { id: 'STU-010', rollNo: '10', name: 'Zayan Malik', class: '8-A', attendance: 87 },
  { id: 'STU-011', rollNo: '11', name: 'Hiba Noor', class: '8-A', attendance: 96 },
  { id: 'STU-012', rollNo: '12', name: 'Hamza Tanveer', class: '8-A', attendance: 92 },

  // Class 9-A (12 Students)
  { id: 'STU-013', rollNo: '13', name: 'Zara Malik', class: '9-A', attendance: 95 },
  { id: 'STU-014', rollNo: '14', name: 'Hamza Sheikh', class: '9-A', attendance: 91 },
  { id: 'STU-015', rollNo: '15', name: 'Ayesha Omer', class: '9-A', attendance: 89 },
  { id: 'STU-016', rollNo: '16', name: 'Danyal Hassan', class: '9-A', attendance: 93 },
  { id: 'STU-017', rollNo: '17', name: 'Emaan Mustafa', class: '9-A', attendance: 97 },
  { id: 'STU-018', rollNo: '18', name: 'Arham Khan', class: '9-A', attendance: 90 },
  { id: 'STU-019', rollNo: '19', name: 'Maham Tariq', class: '9-A', attendance: 94 },
  { id: 'STU-020', rollNo: '20', name: 'Saad Ali', class: '9-A', attendance: 88 },
  { id: 'STU-021', rollNo: '21', name: 'Yousuf Raza', class: '9-A', attendance: 92 },
  { id: 'STU-022', rollNo: '22', name: 'Aaniyah Khan', class: '9-A', attendance: 96 },
  { id: 'STU-023', rollNo: '23', name: 'Mustafa Zaidi', class: '9-A', attendance: 89 },
  { id: 'STU-024', rollNo: '24', name: 'Laiba Shah', class: '9-A', attendance: 93 },

  // Class 10-A (12 Students)
  { id: 'STU-025', rollNo: '25', name: 'Faisal Qureshi', class: '10-A', attendance: 87 },
  { id: 'STU-026', rollNo: '26', name: 'Hania Aamir', class: '10-A', attendance: 98 },
  { id: 'STU-027', rollNo: '27', name: 'Ibrahim Khalid', class: '10-A', attendance: 92 },
  { id: 'STU-028', rollNo: '28', name: 'Mahnoor Tariq', class: '10-A', attendance: 94 },
  { id: 'STU-029', rollNo: '29', name: 'Saad Rizvi', class: '10-A', attendance: 90 },
  { id: 'STU-030', rollNo: '30', name: 'Waqas Ahmed', class: '10-A', attendance: 86 },
  { id: 'STU-031', rollNo: '31', name: 'Aleena Fatima', class: '10-A', attendance: 93 },
  { id: 'STU-032', rollNo: '32', name: 'Shahmir Khan', class: '10-A', attendance: 91 },
  { id: 'STU-033', rollNo: '33', name: 'Kinza Hashmi', class: '10-A', attendance: 97 },
  { id: 'STU-034', rollNo: '34', name: 'Ayaan Baig', class: '10-A', attendance: 89 },
  { id: 'STU-035', rollNo: '35', name: 'Rida Siddiqui', class: '10-A', attendance: 95 },
  { id: 'STU-036', rollNo: '36', name: 'Rohail Usmani', class: '10-A', attendance: 92 },
];

export type AttendanceStatus = 'present' | 'absent' | 'leave';

export interface AttendanceRecord {
  studentId: string;
  name: string;
  rollNo: string;
  status: AttendanceStatus;
  class?: string;
}

export const todayAttendance: AttendanceRecord[] = classStudents.map((s, i) => ({
  studentId: s.id,
  name: s.name,
  rollNo: s.rollNo,
  class: s.class,
  status: i % 4 === 3 ? 'absent' : 'present',
}));

export interface GradeEntry {
  studentId: string;
  name: string;
  rollNo: string;
  class: string;
  quiz: number;
  classTest: number;
  monthlyTest: number;
  assignment: number;
  total: number;
}

export const gradeBook: GradeEntry[] = classStudents.map((s, i) => {
  const quiz = 8 + (i % 3);
  const classTest = 14 + (i % 4);
  const monthlyTest = 38 + (i % 8);
  const assignment = 18 + (i % 3);
  return {
    studentId: s.id,
    name: s.name,
    rollNo: s.rollNo,
    class: s.class,
    quiz,
    classTest,
    monthlyTest,
    assignment,
    total: Math.round(((quiz / 10 + classTest / 20 + monthlyTest / 50 + assignment / 20) / 4) * 100),
  };
});

export interface HomeworkEntry {
  id: string;
  class: string;
  subject: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  submissionsCount: number;
  totalStudents: number;
}

export let homeworkEntries: HomeworkEntry[] = [
  { id: 'HW-001', class: '8-A', subject: 'Mathematics', title: 'Algebra Practice Ex 4.2', description: 'Complete questions 1 to 10 from exercise 4.2.', assignedDate: '2026-06-14', dueDate: '2026-06-15', submissionsCount: 4, totalStudents: 5 },
  { id: 'HW-002', class: '9-A', subject: 'Mathematics', title: 'Quadratic Equations Worksheet', description: 'Solve all problems on worksheet #3.', assignedDate: '2026-06-13', dueDate: '2026-06-16', submissionsCount: 5, totalStudents: 5 },
  { id: 'HW-003', class: '10-A', subject: 'Mathematics', title: 'Trigonometry Identities', description: 'Complete exercises on basic trigonometric identities.', assignedDate: '2026-06-12', dueDate: '2026-06-14', submissionsCount: 5, totalStudents: 5 },
];

export interface ParentMessage {
  id: string;
  parentName: string;
  studentName: string;
  class: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'query' | 'complaint' | 'appreciation';
}

export let parentMessages: ParentMessage[] = [
  { id: 'MSG-001', parentName: 'Mr. Raza Khan', studentName: 'Ahmed Raza Khan', class: '8-A', message: 'My son is struggling with Algebra. Could you please recommend extra practice problems?', date: '2026-06-14', isRead: false, type: 'query' },
  { id: 'MSG-002', parentName: 'Mr. Asif Malik', studentName: 'Zara Malik', class: '9-A', message: 'Zara was absent due to illness yesterday. Here is the doctor certificate.', date: '2026-06-12', isRead: true, type: 'query' },
  { id: 'MSG-003', parentName: 'Mr. Kamran Qureshi', studentName: 'Faisal Qureshi', class: '10-A', message: 'Thank you for the guidance on Math. Faisal got 87% in the monthly test!', date: '2026-06-10', isRead: true, type: 'appreciation' },
];

export const weeklyAttendanceTrend = [
  { day: 'Mon', present: 14, absent: 1 },
  { day: 'Tue', present: 13, absent: 2 },
  { day: 'Wed', present: 15, absent: 0 },
  { day: 'Thu', present: 14, absent: 1 },
  { day: 'Fri', present: 13, absent: 2 },
  { day: 'Sat', present: 14, absent: 1 },
];
