// ============================================================
// STUDENT & ADMIN DATA — 15 Students, 3 Classes, 7 Teachers
// ============================================================

export type UserRole = 'student' | 'teacher' | 'admin';

export interface AdminUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  class?: string;
  subjects?: string[];
  department?: string;
}

export const allStudentsList = [
  // Class 8-A (12 Students)
  { id: 'STU-001', rollNo: 'SP-2026-0001', name: 'Ahmed Raza Khan', class: '8-A', fatherName: 'Muhammad Raza Khan', motherName: 'Fatima Khan', parentEmail: 'raza.khan@gmail.com', parentPhone: '+92-300-1234567', email: 'ahmed.raza@school.edu.pk' },
  { id: 'STU-002', rollNo: 'SP-2026-0002', name: 'Sara Fatima', class: '8-A', fatherName: 'Ali Fatima', motherName: 'Sana Ali', parentEmail: 'ali.fatima@gmail.com', parentPhone: '+92-300-2345679', email: 'sara.fatima@school.edu.pk' },
  { id: 'STU-003', rollNo: 'SP-2026-0003', name: 'Muhammad Bilal', class: '8-A', fatherName: 'Naeem Hassan', motherName: 'Rubina Hassan', parentEmail: 'naeem.hassan@gmail.com', parentPhone: '+92-300-3456780', email: 'bilal.m@school.edu.pk' },
  { id: 'STU-004', rollNo: 'SP-2026-0004', name: 'Zainab Abid', class: '8-A', fatherName: 'Abid Ali', motherName: 'Shagufta Abid', parentEmail: 'abid.ali@gmail.com', parentPhone: '+92-300-4567891', email: 'zainab.a@school.edu.pk' },
  { id: 'STU-005', rollNo: 'SP-2026-0005', name: 'Usman Ghani', class: '8-A', fatherName: 'Ghani Ur Rehman', motherName: 'Zubaida Ghani', parentEmail: 'ghani.rehman@gmail.com', parentPhone: '+92-300-5678902', email: 'usman.g@school.edu.pk' },
  { id: 'STU-006', rollNo: 'SP-2026-0006', name: 'Rayyan Ahmed', class: '8-A', fatherName: 'Ahmed Faraz', motherName: 'Nida Ahmed', parentEmail: 'faraz.ahmed@gmail.com', parentPhone: '+92-300-6789013', email: 'rayyan.a@school.edu.pk' },
  { id: 'STU-007', rollNo: 'SP-2026-0007', name: 'Maryam Nawaz', class: '8-A', fatherName: 'Nawaz Sharif', motherName: 'Kalsoom Nawaz', parentEmail: 'nawaz.sharif@gmail.com', parentPhone: '+92-300-7890124', email: 'maryam.n@school.edu.pk' },
  { id: 'STU-008', rollNo: 'SP-2026-0008', name: 'Bilal Shah', class: '8-A', fatherName: 'Syed Ali Shah', motherName: 'Syeda Amna', parentEmail: 'ali.shah@gmail.com', parentPhone: '+92-300-8901235', email: 'bilal.shah@school.edu.pk' },
  { id: 'STU-009', rollNo: 'SP-2026-0009', name: 'Alisha Imran', class: '8-A', fatherName: 'Imran Abbas', motherName: 'Saba Imran', parentEmail: 'imran.abbas@gmail.com', parentPhone: '+92-300-9012346', email: 'alisha.i@school.edu.pk' },
  { id: 'STU-010', rollNo: 'SP-2026-0010', name: 'Zayan Malik', class: '8-A', fatherName: 'Tariq Malik', motherName: 'Saima Malik', parentEmail: 'tariq.malik@gmail.com', parentPhone: '+92-300-0123457', email: 'zayan.m@school.edu.pk' },
  { id: 'STU-011', rollNo: 'SP-2026-0011', name: 'Hiba Noor', class: '8-A', fatherName: 'Noor Mohammad', motherName: 'Aisha Noor', parentEmail: 'noor.mohammad@gmail.com', parentPhone: '+92-300-1234569', email: 'hiba.n@school.edu.pk' },
  { id: 'STU-012', rollNo: 'SP-2026-0012', name: 'Hamza Tanveer', class: '8-A', fatherName: 'Tanveer Ahmed', motherName: 'Shazia Tanveer', parentEmail: 'tanveer.ahmed@gmail.com', parentPhone: '+92-300-2345671', email: 'hamza.t@school.edu.pk' },

  // Class 9-A (12 Students)
  { id: 'STU-013', rollNo: 'SP-2026-0013', name: 'Zara Malik', class: '9-A', fatherName: 'Asif Malik', motherName: 'Nadia Malik', parentEmail: 'asif.malik@gmail.com', parentPhone: '+92-300-6789013', email: 'zara.malik@school.edu.pk' },
  { id: 'STU-014', rollNo: 'SP-2026-0014', name: 'Hamza Sheikh', class: '9-A', fatherName: 'Tariq Sheikh', motherName: 'Amina Sheikh', parentEmail: 'tariq.sheikh@gmail.com', parentPhone: '+92-300-7890124', email: 'hamza.sheikh@school.edu.pk' },
  { id: 'STU-015', rollNo: 'SP-2026-0015', name: 'Ayesha Omer', class: '9-A', fatherName: 'Omer Farooq', motherName: 'Samina Omer', parentEmail: 'omer.farooq@gmail.com', parentPhone: '+92-300-8901235', email: 'ayesha.o@school.edu.pk' },
  { id: 'STU-016', rollNo: 'SP-2026-0016', name: 'Danyal Hassan', class: '9-A', fatherName: 'Hassan Mahmood', motherName: 'Fareeda Hassan', parentEmail: 'hassan.mahmood@gmail.com', parentPhone: '+92-300-9012346', email: 'danyal.h@school.edu.pk' },
  { id: 'STU-017', rollNo: 'SP-2026-0017', name: 'Emaan Mustafa', class: '9-A', fatherName: 'Mustafa Kamal', motherName: 'Sadia Mustafa', parentEmail: 'mustafa.kamal@gmail.com', parentPhone: '+92-300-0123457', email: 'emaan.m@school.edu.pk' },
  { id: 'STU-018', rollNo: 'SP-2026-0018', name: 'Arham Khan', class: '9-A', fatherName: 'Jahangir Khan', motherName: 'Bina Khan', parentEmail: 'jahangir.khan@gmail.com', parentPhone: '+92-300-3456782', email: 'arham.k@school.edu.pk' },
  { id: 'STU-019', rollNo: 'SP-2026-0019', name: 'Maham Tariq', class: '9-A', fatherName: 'Tariq Aziz', motherName: 'Mehwish Tariq', parentEmail: 'tariq.aziz@gmail.com', parentPhone: '+92-300-4567893', email: 'maham.t@school.edu.pk' },
  { id: 'STU-020', rollNo: 'SP-2026-0020', name: 'Saad Ali', class: '9-A', fatherName: 'Amjad Ali', motherName: 'Farhat Ali', parentEmail: 'amjad.ali@gmail.com', parentPhone: '+92-300-5678904', email: 'saad.ali@school.edu.pk' },
  { id: 'STU-021', rollNo: 'SP-2026-0021', name: 'Yousuf Raza', class: '9-A', fatherName: 'Raza Ali', motherName: 'Nazia Raza', parentEmail: 'raza.ali@gmail.com', parentPhone: '+92-300-6789015', email: 'yousuf.r@school.edu.pk' },
  { id: 'STU-022', rollNo: 'SP-2026-0022', name: 'Aaniyah Khan', class: '9-A', fatherName: 'Kashif Khan', motherName: 'Mariam Khan', parentEmail: 'kashif.khan@gmail.com', parentPhone: '+92-300-7890126', email: 'aaniyah.k@school.edu.pk' },
  { id: 'STU-023', rollNo: 'SP-2026-0023', name: 'Mustafa Zaidi', class: '9-A', fatherName: 'Haider Zaidi', motherName: 'Shabana Zaidi', parentEmail: 'haider.zaidi@gmail.com', parentPhone: '+92-300-8901237', email: 'mustafa.z@school.edu.pk' },
  { id: 'STU-024', rollNo: 'SP-2026-0024', name: 'Laiba Shah', class: '9-A', fatherName: 'Zubair Shah', motherName: 'Erum Shah', parentEmail: 'zubair.shah@gmail.com', parentPhone: '+92-300-9012348', email: 'laiba.s@school.edu.pk' },

  // Class 10-A (12 Students)
  { id: 'STU-025', rollNo: 'SP-2026-0025', name: 'Faisal Qureshi', class: '10-A', fatherName: 'Kamran Qureshi', motherName: 'Tahira Qureshi', parentEmail: 'kamran.qureshi@gmail.com', parentPhone: '+92-300-7890124', email: 'faisal.q@school.edu.pk' },
  { id: 'STU-026', rollNo: 'SP-2026-0026', name: 'Hania Aamir', class: '10-A', fatherName: 'Aamir Hussain', motherName: 'Bushra Aamir', parentEmail: 'aamir.hussain@gmail.com', parentPhone: '+92-300-8901235', email: 'hania.a@school.edu.pk' },
  { id: 'STU-027', rollNo: 'SP-2026-0027', name: 'Ibrahim Khalid', class: '10-A', fatherName: 'Khalid Masood', motherName: 'Uzma Khalid', parentEmail: 'khalid.masood@gmail.com', parentPhone: '+92-300-9012346', email: 'ibrahim.k@school.edu.pk' },
  { id: 'STU-028', rollNo: 'SP-2026-0028', name: 'Mahnoor Tariq', class: '10-A', fatherName: 'Tariq Jameel', motherName: 'Noreen Tariq', parentEmail: 'tariq.jameel@gmail.com', parentPhone: '+92-300-0123457', email: 'mahnoor.t@school.edu.pk' },
  { id: 'STU-029', rollNo: 'SP-2026-0029', name: 'Saad Rizvi', class: '10-A', fatherName: 'Asad Rizvi', motherName: 'Khadija Rizvi', parentEmail: 'asad.rizvi@gmail.com', parentPhone: '+92-300-1234568', email: 'saad.r@school.edu.pk' },
  { id: 'STU-030', rollNo: 'SP-2026-0030', name: 'Waqas Ahmed', class: '10-A', fatherName: 'Javed Ahmed', motherName: 'Nasreen Ahmed', parentEmail: 'javed.ahmed@gmail.com', parentPhone: '+92-300-0123459', email: 'waqas.a@school.edu.pk' },
  { id: 'STU-031', rollNo: 'SP-2026-0031', name: 'Aleena Fatima', class: '10-A', fatherName: 'Shoaib Fatima', motherName: 'Saima Shoaib', parentEmail: 'shoaib.fatima@gmail.com', parentPhone: '+92-300-1234570', email: 'aleena.f@school.edu.pk' },
  { id: 'STU-032', rollNo: 'SP-2026-0032', name: 'Shahmir Khan', class: '10-A', fatherName: 'Shahbaz Khan', motherName: 'Farzana Khan', parentEmail: 'shahbaz.khan@gmail.com', parentPhone: '+92-300-2345681', email: 'shahmir.k@school.edu.pk' },
  { id: 'STU-033', rollNo: 'SP-2026-0033', name: 'Kinza Hashmi', class: '10-A', fatherName: 'Waseem Hashmi', motherName: 'Amber Hashmi', parentEmail: 'waseem.hashmi@gmail.com', parentPhone: '+92-300-3456792', email: 'kinza.h@school.edu.pk' },
  { id: 'STU-034', rollNo: 'SP-2026-0034', name: 'Ayaan Baig', class: '10-A', fatherName: 'Mirza Baig', motherName: 'Asma Baig', parentEmail: 'mirza.baig@gmail.com', parentPhone: '+92-300-4567803', email: 'ayaan.b@school.edu.pk' },
  { id: 'STU-035', rollNo: 'SP-2026-0035', name: 'Rida Siddiqui', class: '10-A', fatherName: 'Faisal Siddiqui', motherName: 'Nida Siddiqui', parentEmail: 'faisal.siddiqui@gmail.com', parentPhone: '+92-300-5678914', email: 'rida.s@school.edu.pk' },
  { id: 'STU-036', rollNo: 'SP-2026-0036', name: 'Rohail Usmani', class: '10-A', fatherName: 'Sarwar Usmani', motherName: 'Lubna Usmani', parentEmail: 'sarwar.usmani@gmail.com', parentPhone: '+92-300-6789025', email: 'rohail.u@school.edu.pk' }
];

export let adminUsers: AdminUser[] = [
  { id: 'ADM-001', name: 'System Admin', role: 'admin', email: 'admin@school.edu.pk', phone: '+92-21-0000000', status: 'active', joinDate: '2015-01-01' },
  { id: 'TCH-001', name: 'Mr. Tariq Mehmood', role: 'teacher', email: 'tariq.m@school.edu.pk', phone: '+92-300-1122334', status: 'active', joinDate: '2018-08-01', subjects: ['Mathematics'], department: 'Science' },
  { id: 'TCH-002', name: 'Mr. Salman Farooq', role: 'teacher', email: 'salman.f@school.edu.pk', phone: '+92-321-2233445', status: 'active', joinDate: '2019-08-15', subjects: ['Physics'], department: 'Science' },
  { id: 'TCH-003', name: 'Ms. Ayesha Siddiqui', role: 'teacher', email: 'ayesha.s@school.edu.pk', phone: '+92-333-3344556', status: 'active', joinDate: '2017-09-01', subjects: ['English'], department: 'Languages' },
  { id: 'TCH-004', name: 'Mr. Kamran Baig', role: 'teacher', email: 'kamran.b@school.edu.pk', phone: '+92-345-4455667', status: 'active', joinDate: '2020-08-01', subjects: ['Urdu'], department: 'Languages' },
  { id: 'TCH-005', name: 'Ms. Sana Mirza', role: 'teacher', email: 'sana.m@school.edu.pk', phone: '+92-311-5566778', status: 'active', joinDate: '2021-08-20', subjects: ['Chemistry'], department: 'Science' },
  { id: 'TCH-006', name: 'Mr. Owais Raza', role: 'teacher', email: 'owais.r@school.edu.pk', phone: '+92-322-6677889', status: 'active', joinDate: '2022-01-10', subjects: ['Computer Science'], department: 'Computer' },
  { id: 'TCH-007', name: 'Ms. Hira Noor', role: 'teacher', email: 'hira.n@school.edu.pk', phone: '+92-334-7788990', status: 'active', joinDate: '2022-09-01', subjects: ['Pakistan Studies'], department: 'Social Studies' },
  { id: 'STU-001', name: 'Ahmed Raza Khan', role: 'student', email: 'ahmed.raza@school.edu.pk', phone: '+92-321-4567890', status: 'active', joinDate: '2022-04-01', class: '8-A' },
  { id: 'STU-002', name: 'Sara Fatima', role: 'student', email: 'sara.fatima@school.edu.pk', phone: '+92-300-2345678', status: 'active', joinDate: '2023-03-15', class: '8-A' },
  { id: 'STU-003', name: 'Muhammad Bilal', role: 'student', email: 'bilal.m@school.edu.pk', phone: '+92-333-3456789', status: 'active', joinDate: '2021-04-01', class: '8-A' },
];

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  month: string;
  year: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Partial' | 'Overdue';
  dueDate: string;
  paidDate?: string;
  paidAmount?: number;
  receiptNo?: string;
}

export let adminFeeRecords: FeeRecord[] = [
  { id: 'FEE-001', studentId: 'STU-001', studentName: 'Ahmed Raza Khan', class: '8-A', month: 'June', year: '2026', amount: 15000, status: 'Unpaid', dueDate: '2026-06-10' },
  { id: 'FEE-002', studentId: 'STU-002', studentName: 'Sara Fatima', class: '8-A', month: 'June', year: '2026', amount: 15000, status: 'Paid', dueDate: '2026-06-10', paidAmount: 15000, paidDate: '2026-06-05', receiptNo: 'R-50001' },
];

export interface ApprovalRequest {
  id: string;
  type: 'notice' | 'leave' | 'homework';
  title: string;
  submittedBy: string;
  submittedDate: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
}

export let approvalRequests: ApprovalRequest[] = [
  { id: 'APR-001', type: 'notice', title: 'Exam Schedule Announcement', submittedBy: 'Mr. Tariq Mehmood', submittedDate: '2026-06-15', content: 'First term exams will commence from July 15, 2026.', status: 'pending', priority: 'high' },
];

export const schoolStats = {
  totalStudents: 15,
  totalTeachers: 7,
  totalClasses: 3,
  todayAttendanceRate: 93.3,
  feeCollectionRate: 80.0,
  monthlyRevenueTarget: 250000,
  monthlyRevenueCollected: 200000,
  attendanceTrend: [
    { day: 'Mon', rate: 93 },
    { day: 'Tue', rate: 87 },
    { day: 'Wed', rate: 93 },
    { day: 'Thu', rate: 100 },
    { day: 'Fri', rate: 87 },
    { day: 'Sat', rate: 93 },
  ],
  feeCollectionByMonth: [
    { month: 'Jan', collected: 240000, target: 250000 },
    { month: 'Feb', collected: 250000, target: 250000 },
    { month: 'Mar', collected: 245000, target: 250000 },
    { month: 'Apr', collected: 230000, target: 250000 },
    { month: 'May', collected: 220000, target: 250000 },
    { month: 'Jun', collected: 200000, target: 250000 },
  ],
};

export const studentProfile = {
  id: 'SP-2026-0001',
  name: 'Ahmed Raza Khan',
  class: '8-A',
  rollNo: 'SP-2026-0001',
  section: 'A',
  campus: 'Gulshan Campus',
  fatherName: 'Muhammad Raza Khan',
  motherName: 'Fatima Khan',
  contactNumber: '+92-321-4567890',
  emergencyContact: '+92-300-1234567',
  address: 'House 14-B, Block 5, Gulshan-e-Iqbal, Karachi',
  bloodGroup: 'B+',
  dateOfBirth: '2012-08-15',
  admissionDate: '2022-04-01',
  profileImage: '/student-avatar.png'
};

export const todayTimetable = [
  { id: '1', period: 1, subject: 'Mathematics', teacher: 'Mr. Tariq', startTime: '8:00 AM', endTime: '8:40 AM', status: 'present', room: 'Room 101' },
  { id: '2', period: 2, subject: 'Physics', teacher: 'Mr. Salman', startTime: '8:40 AM', endTime: '9:20 AM', status: 'present', room: 'Lab 2' },
  { id: '3', period: 3, subject: 'English', teacher: 'Ms. Ayesha', startTime: '9:20 AM', endTime: '10:00 AM', status: 'present', room: 'Room 101' },
  { id: '4', period: 4, subject: 'Urdu', teacher: 'Mr. Kamran', startTime: '10:00 AM', endTime: '10:40 AM', status: 'present', room: 'Room 101' },
  { id: '5', period: 5, subject: 'Chemistry', teacher: 'Ms. Sana', startTime: '11:00 AM', endTime: '11:40 AM', status: 'upcoming', room: 'Lab 1' },
  { id: '6', period: 6, subject: 'Computer Science', teacher: 'Mr. Owais', startTime: '11:40 AM', endTime: '12:20 PM', status: 'upcoming', room: 'Computer Lab' },
  { id: '7', period: 7, subject: 'Pakistan Studies', teacher: 'Ms. Hira', startTime: '12:20 PM', endTime: '1:00 PM', status: 'upcoming', room: 'Room 101' }
];

export const monthlyAttendance = {
  totalDays: 24,
  present: 22,
  absent: 1,
  leaves: 1,
  records: [
    { date: '2026-06-01', status: 'present', remarks: '' },
    { date: '2026-06-02', status: 'present', remarks: '' },
    { date: '2026-06-03', status: 'absent', remarks: 'Fever' },
    { date: '2026-06-04', status: 'present', remarks: '' },
    { date: '2026-06-05', status: 'present', remarks: '' },
  ]
};

export const subjectGrades = [
  {
    id: 's1', name: 'Mathematics', teacher: 'Mr. Tariq', overallPercentage: 88,
    assessments: [
      { id: 'a1', type: 'Class Test', title: 'Algebra Test', marksObtained: 18, totalMarks: 20, date: '2026-05-10', weightage: 10 },
      { id: 'a2', type: 'Monthly Test', title: 'May Test', marksObtained: 42, totalMarks: 50, date: '2026-05-25', weightage: 30 }
    ]
  },
  {
    id: 's2', name: 'Physics', teacher: 'Mr. Salman', overallPercentage: 75,
    assessments: [
      { id: 'a3', type: 'Quiz', title: 'Mechanics', marksObtained: 8, totalMarks: 10, date: '2026-05-15', weightage: 5 },
      { id: 'a4', type: 'Monthly Test', title: 'May Test', marksObtained: 35, totalMarks: 50, date: '2026-05-26', weightage: 30 }
    ]
  },
  {
    id: 's3', name: 'English', teacher: 'Ms. Ayesha', overallPercentage: 92,
    assessments: [
      { id: 'a5', type: 'Assignment', title: 'Essay', marksObtained: 19, totalMarks: 20, date: '2026-05-12', weightage: 10 },
      { id: 'a6', type: 'Class Test', title: 'Grammar', marksObtained: 15, totalMarks: 15, date: '2026-05-20', weightage: 10 }
    ]
  },
  {
    id: 's4', name: 'Urdu', teacher: 'Mr. Kamran', overallPercentage: 85,
    assessments: [
      { id: 'a7', type: 'Monthly Test', title: 'May Test', marksObtained: 43, totalMarks: 50, date: '2026-05-27', weightage: 30 }
    ]
  },
  {
    id: 's5', name: 'Chemistry', teacher: 'Ms. Sana', overallPercentage: 68,
    assessments: [
      { id: 'a9', type: 'Quiz', title: 'Periodic Table', marksObtained: 6, totalMarks: 10, date: '2026-05-18', weightage: 5 }
    ]
  },
  {
    id: 's6', name: 'Computer Science', teacher: 'Mr. Owais', overallPercentage: 89,
    assessments: [
      { id: 'a10', type: 'Assignment', title: 'Programming', marksObtained: 28, totalMarks: 30, date: '2026-05-22', weightage: 15 }
    ]
  },
  {
    id: 's7', name: 'Pakistan Studies', teacher: 'Ms. Hira', overallPercentage: 82,
    assessments: [
      { id: 'a11', type: 'Class Test', title: 'History', marksObtained: 16, totalMarks: 20, date: '2026-05-19', weightage: 10 }
    ]
  }
];

export const performanceData = [
  { subject: 'Mathematics', percentage: 88, fill: '#60a5fa' },
  { subject: 'Physics', percentage: 75, fill: '#f472b6' },
  { subject: 'English', percentage: 92, fill: '#a78bfa' },
  { subject: 'Urdu', percentage: 85, fill: '#34d399' },
  { subject: 'Chemistry', percentage: 68, fill: '#f87171' },
  { subject: 'Computer Sci', percentage: 89, fill: '#38bdf8' },
  { subject: 'Pak Studies', percentage: 82, fill: '#818cf8' }
];

export const syllabusData = [
  {
    id: 'sy1', subject: 'Mathematics', term: 'First Term', completionPercentage: 80, examDate: '2026-07-15',
    chapters: [{ name: 'Algebraic Expressions', completed: true }, { name: 'Linear Equations', completed: true }, { name: 'Geometry', completed: false }]
  },
  {
    id: 'sy2', subject: 'Physics', term: 'First Term', completionPercentage: 60, examDate: '2026-07-17',
    chapters: [{ name: 'Kinematics', completed: true }, { name: 'Dynamics', completed: true }, { name: 'Work and Energy', completed: false }]
  }
];

export let homeworkEntries = [
  { id: 'h1', subject: 'Mathematics', title: 'Solve Ex 4.2', description: 'Complete all questions from exercise 4.2 in your notebook.', assignedDate: '2026-06-14', dueDate: '2026-06-15', isCompleted: false, teacher: 'Mr. Tariq' },
  { id: 'h2', subject: 'English', title: 'Write an Essay', description: 'Write an essay on "My Ambition in Life" (250 words).', assignedDate: '2026-06-12', dueDate: '2026-06-16', isCompleted: true, teacher: 'Ms. Ayesha' },
  { id: 'h3', subject: 'Physics', title: 'Numerical Problems', description: 'Solve problems 1-5 from Chapter 3.', assignedDate: '2026-06-10', dueDate: '2026-06-12', isCompleted: false, teacher: 'Mr. Salman' },
  { id: 'h4', subject: 'Urdu', title: 'Read Chapter 5', description: 'Read and understand the central idea of the poem.', assignedDate: '2026-06-14', dueDate: '2026-06-17', isCompleted: false, teacher: 'Mr. Kamran' }
];

export let notices = [
  { id: 'n1', title: 'Summer Vacation Announcement', content: 'School will remain closed for summer holidays starting June 20th till July 31st.', date: '2026-06-14', category: 'holiday', isRead: false, status: 'approved', author: 'Admin' },
  { id: 'n2', title: 'Parent Teacher Meeting', content: 'The first term PTM is scheduled for coming Saturday. Parents are requested to attend.', date: '2026-06-10', category: 'urgent', isRead: true, status: 'approved', author: 'Admin' },
  { id: 'n3', title: 'Annual Sports Gala', content: 'Inter-class football tournament starts next week. Register with Mr. Tariq.', date: '2026-06-05', category: 'event', isRead: true, status: 'approved', author: 'Mr. Tariq' },
  { id: 'n4', title: 'Uniform Inspection', content: 'Strict uniform inspection will be carried out next week. Proper haircut is mandatory.', date: '2026-06-02', category: 'info', isRead: true, status: 'approved', author: 'Admin' }
];

export let teacherRemarks = [
  { id: 'r1', teacher: 'Mr. Tariq', subject: 'Mathematics', date: '2026-06-10', remark: 'Ahmed has shown great improvement in Algebra.', type: 'positive', isAcknowledged: true },
  { id: 'r2', teacher: 'Mr. Salman', subject: 'Physics', date: '2026-06-12', remark: 'Needs to pay more attention during lab sessions.', type: 'negative', isAcknowledged: false },
  { id: 'r3', teacher: 'Ms. Ayesha', subject: 'English', date: '2026-06-05', remark: 'Good participation in class discussions.', type: 'positive', isAcknowledged: false }
];

export let queryTickets = [
  { id: 't1', ticketNo: 'TKT-2026-001', category: 'Fees', subject: 'Fee Challan Issue', description: 'The arrears amount on the June challan seems incorrect.', status: 'Resolved', createdDate: '2026-06-05', resolvedDate: '2026-06-08', response: 'The issue has been corrected. Please download the updated challan.' },
  { id: 't2', ticketNo: 'TKT-2026-002', category: 'Academic', subject: 'Syllabus Query', description: 'Will Chapter 4 be included in the first term exams?', status: 'Pending', createdDate: '2026-06-14' }
];

export const feeLedger = {
  monthlyFee: 15000,
  arrears: 0,
  transportFee: 3000,
  examFee: 0,
  lateFee: 0,
  discount: 0,
  months: [
    { month: 'June', year: '2026', amount: 15000, dueDate: '2026-06-10', status: 'Unpaid', paidAmount: 0 },
    { month: 'May', year: '2026', amount: 15000, dueDate: '2026-05-10', status: 'Paid', paidAmount: 15000, paidDate: '2026-05-08', receiptNo: 'R-45012' },
    { month: 'April', year: '2026', amount: 15000, dueDate: '2026-04-10', status: 'Paid', paidAmount: 15000, paidDate: '2026-04-08', receiptNo: 'R-42190' },
    { month: 'March', year: '2026', amount: 15000, dueDate: '2026-03-10', status: 'Paid', paidAmount: 15000, paidDate: '2026-03-09', receiptNo: 'R-39822' }
  ]
};

export const challanData = {
  bankName: 'Allied Bank Limited',
  branchCode: '0142',
  schoolName: 'The Educators School System',
  schoolAddress: 'Gulshan-e-Iqbal, Karachi',
  challanNo: 'CH-2026-6-0001',
  dueDate: '2026-06-10',
  fineAfterDueDate: 500,
  tuitionFee: 15000,
  generalFund: 1000,
  examFee: 0,
  computerLabFee: 500,
  totalAmount: 16500
};
