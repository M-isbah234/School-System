// ============================================================
// ADMIN MOCK DATA — 36 Students (12 in 8-A, 12 in 9-A, 12 in 10-A), 3 Classes, 7 Teachers
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
  avatar?: string;
  fatherName?: string;
  motherName?: string;
  parentEmail?: string;
  parentPhone?: string;
}

export let adminUsers: AdminUser[] = [
  // System Admin
  { id: 'ADM-001', name: 'System Admin', role: 'admin', email: 'admin@school.edu.pk', phone: '+92-21-0000000', status: 'active', joinDate: '2015-01-01' },

  // 7 Teachers
  { id: 'TCH-001', name: 'Mr. Tariq Mehmood', role: 'teacher', email: 'tariq.m@school.edu.pk', phone: '+92-300-1122334', status: 'active', joinDate: '2018-08-01', subjects: ['Mathematics'], department: 'Science' },
  { id: 'TCH-002', name: 'Mr. Salman Farooq', role: 'teacher', email: 'salman.f@school.edu.pk', phone: '+92-321-2233445', status: 'active', joinDate: '2019-08-15', subjects: ['Physics'], department: 'Science' },
  { id: 'TCH-003', name: 'Ms. Ayesha Siddiqui', role: 'teacher', email: 'ayesha.s@school.edu.pk', phone: '+92-333-3344556', status: 'active', joinDate: '2017-09-01', subjects: ['English'], department: 'Languages' },
  { id: 'TCH-004', name: 'Mr. Kamran Baig', role: 'teacher', email: 'kamran.b@school.edu.pk', phone: '+92-345-4455667', status: 'active', joinDate: '2020-08-01', subjects: ['Urdu'], department: 'Languages' },
  { id: 'TCH-005', name: 'Ms. Sana Mirza', role: 'teacher', email: 'sana.m@school.edu.pk', phone: '+92-311-5566778', status: 'active', joinDate: '2021-08-20', subjects: ['Chemistry'], department: 'Science' },
  { id: 'TCH-006', name: 'Mr. Owais Raza', role: 'teacher', email: 'owais.r@school.edu.pk', phone: '+92-322-6677889', status: 'active', joinDate: '2022-01-10', subjects: ['Computer Science'], department: 'Computer' },
  { id: 'TCH-007', name: 'Ms. Hira Noor', role: 'teacher', email: 'hira.n@school.edu.pk', phone: '+92-334-7788990', status: 'active', joinDate: '2022-09-01', subjects: ['Pakistan Studies'], department: 'Social Studies' },

  // ── Class 8-A (12 Students) ──
  { id: 'STU-001', name: 'Ahmed Raza Khan', role: 'student', email: 'ahmed.raza@school.edu.pk', phone: '+92-321-4567890', status: 'active', joinDate: '2022-04-01', class: '8-A', fatherName: 'Muhammad Raza Khan', motherName: 'Fatima Khan', parentEmail: 'raza.khan@gmail.com', parentPhone: '+92-300-1234567', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { id: 'STU-002', name: 'Sara Fatima', role: 'student', email: 'sara.fatima@school.edu.pk', phone: '+92-300-2345678', status: 'active', joinDate: '2023-03-15', class: '8-A', fatherName: 'Ali Fatima', motherName: 'Sana Ali', parentEmail: 'ali.fatima@gmail.com', parentPhone: '+92-300-2345679', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
  { id: 'STU-003', name: 'Muhammad Bilal', role: 'student', email: 'bilal.m@school.edu.pk', phone: '+92-333-3456789', status: 'active', joinDate: '2021-04-01', class: '8-A', fatherName: 'Naeem Hassan', motherName: 'Rubina Hassan', parentEmail: 'naeem.hassan@gmail.com', parentPhone: '+92-300-3456780', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
  { id: 'STU-004', name: 'Zainab Abid', role: 'student', email: 'zainab.a@school.edu.pk', phone: '+92-345-1122334', status: 'active', joinDate: '2023-04-01', class: '8-A', fatherName: 'Abid Ali', motherName: 'Shagufta Abid', parentEmail: 'abid.ali@gmail.com', parentPhone: '+92-300-4567891', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150' },
  { id: 'STU-005', name: 'Usman Ghani', role: 'student', email: 'usman.g@school.edu.pk', phone: '+92-312-2233445', status: 'active', joinDate: '2022-04-01', class: '8-A', fatherName: 'Ghani Ur Rehman', motherName: 'Zubaida Ghani', parentEmail: 'ghani.rehman@gmail.com', parentPhone: '+92-300-5678902', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 'STU-006', name: 'Rayyan Ahmed', role: 'student', email: 'rayyan.a@school.edu.pk', phone: '+92-300-6789013', status: 'active', joinDate: '2023-04-01', class: '8-A', fatherName: 'Ahmed Faraz', motherName: 'Nida Ahmed', parentEmail: 'faraz.ahmed@gmail.com', parentPhone: '+92-300-6789013', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { id: 'STU-007', name: 'Maryam Nawaz', role: 'student', email: 'maryam.n@school.edu.pk', phone: '+92-300-7890124', status: 'active', joinDate: '2022-04-01', class: '8-A', fatherName: 'Nawaz Sharif', motherName: 'Kalsoom Nawaz', parentEmail: 'nawaz.sharif@gmail.com', parentPhone: '+92-300-7890124', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: 'STU-008', name: 'Bilal Shah', role: 'student', email: 'bilal.shah@school.edu.pk', phone: '+92-300-8901235', status: 'active', joinDate: '2021-04-01', class: '8-A', fatherName: 'Syed Ali Shah', motherName: 'Syeda Amna', parentEmail: 'ali.shah@gmail.com', parentPhone: '+92-300-8901235', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
  { id: 'STU-009', name: 'Alisha Imran', role: 'student', email: 'alisha.i@school.edu.pk', phone: '+92-300-9012346', status: 'active', joinDate: '2023-04-01', class: '8-A', fatherName: 'Imran Abbas', motherName: 'Saba Imran', parentEmail: 'imran.abbas@gmail.com', parentPhone: '+92-300-9012346', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
  { id: 'STU-010', name: 'Zayan Malik', role: 'student', email: 'zayan.m@school.edu.pk', phone: '+92-300-0123457', status: 'active', joinDate: '2022-04-01', class: '8-A', fatherName: 'Tariq Malik', motherName: 'Saima Malik', parentEmail: 'tariq.malik@gmail.com', parentPhone: '+92-300-0123457', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
  { id: 'STU-011', name: 'Hiba Noor', role: 'student', email: 'hiba.n@school.edu.pk', phone: '+92-300-1234569', status: 'active', joinDate: '2023-04-01', class: '8-A', fatherName: 'Noor Mohammad', motherName: 'Aisha Noor', parentEmail: 'noor.mohammad@gmail.com', parentPhone: '+92-300-1234569', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
  { id: 'STU-012', name: 'Hamza Tanveer', role: 'student', email: 'hamza.t@school.edu.pk', phone: '+92-300-2345671', status: 'active', joinDate: '2022-04-01', class: '8-A', fatherName: 'Tanveer Ahmed', motherName: 'Shazia Tanveer', parentEmail: 'tanveer.ahmed@gmail.com', parentPhone: '+92-300-2345671', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },

  // ── Class 9-A (12 Students) ──
  { id: 'STU-013', name: 'Zara Malik', role: 'student', email: 'zara.malik@school.edu.pk', phone: '+92-345-4567891', status: 'active', joinDate: '2023-04-10', class: '9-A', fatherName: 'Asif Malik', motherName: 'Nadia Malik', parentEmail: 'asif.malik@gmail.com', parentPhone: '+92-300-6789013', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { id: 'STU-014', name: 'Hamza Sheikh', role: 'student', email: 'hamza.sheikh@school.edu.pk', phone: '+92-311-5678902', status: 'active', joinDate: '2020-04-01', class: '9-A', fatherName: 'Tariq Sheikh', motherName: 'Amina Sheikh', parentEmail: 'tariq.sheikh@gmail.com', parentPhone: '+92-300-7890124', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 'STU-015', name: 'Ayesha Omer', role: 'student', email: 'ayesha.o@school.edu.pk', phone: '+92-323-3344556', status: 'active', joinDate: '2022-04-01', class: '9-A', fatherName: 'Omer Farooq', motherName: 'Samina Omer', parentEmail: 'omer.farooq@gmail.com', parentPhone: '+92-300-8901235', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
  { id: 'STU-016', name: 'Danyal Hassan', role: 'student', email: 'danyal.h@school.edu.pk', phone: '+92-301-4455667', status: 'active', joinDate: '2021-04-01', class: '9-A', fatherName: 'Hassan Mahmood', motherName: 'Fareeda Hassan', parentEmail: 'hassan.mahmood@gmail.com', parentPhone: '+92-300-9012346', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { id: 'STU-017', name: 'Emaan Mustafa', role: 'student', email: 'emaan.m@school.edu.pk', phone: '+92-335-5566778', status: 'active', joinDate: '2023-04-01', class: '9-A', fatherName: 'Mustafa Kamal', motherName: 'Sadia Mustafa', parentEmail: 'mustafa.kamal@gmail.com', parentPhone: '+92-300-0123457', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150' },
  { id: 'STU-018', name: 'Arham Khan', role: 'student', email: 'arham.k@school.edu.pk', phone: '+92-300-3456782', status: 'active', joinDate: '2022-04-01', class: '9-A', fatherName: 'Jahangir Khan', motherName: 'Bina Khan', parentEmail: 'jahangir.khan@gmail.com', parentPhone: '+92-300-3456782', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
  { id: 'STU-019', name: 'Maham Tariq', role: 'student', email: 'maham.t@school.edu.pk', phone: '+92-300-4567893', status: 'active', joinDate: '2023-04-01', class: '9-A', fatherName: 'Tariq Aziz', motherName: 'Mehwish Tariq', parentEmail: 'tariq.aziz@gmail.com', parentPhone: '+92-300-4567893', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: 'STU-020', name: 'Saad Ali', role: 'student', email: 'saad.ali@school.edu.pk', phone: '+92-300-5678904', status: 'active', joinDate: '2021-04-01', class: '9-A', fatherName: 'Amjad Ali', motherName: 'Farhat Ali', parentEmail: 'amjad.ali@gmail.com', parentPhone: '+92-300-5678904', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
  { id: 'STU-021', name: 'Laiba Riaz', role: 'student', email: 'laiba.r@school.edu.pk', phone: '+92-300-6789015', status: 'active', joinDate: '2022-04-01', class: '9-A', fatherName: 'Riaz Ahmed', motherName: 'Khadija Riaz', parentEmail: 'riaz.ahmed@gmail.com', parentPhone: '+92-300-6789015', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
  { id: 'STU-022', name: 'Shahzaib Usman', role: 'student', email: 'shahzaib.u@school.edu.pk', phone: '+92-300-7890126', status: 'active', joinDate: '2020-04-01', class: '9-A', fatherName: 'Usman Ghani Sr.', motherName: 'Tahira Usman', parentEmail: 'usman.sr@gmail.com', parentPhone: '+92-300-7890126', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
  { id: 'STU-023', name: 'Anaya Kashif', role: 'student', email: 'anaya.k@school.edu.pk', phone: '+92-300-8901237', status: 'active', joinDate: '2023-04-01', class: '9-A', fatherName: 'Kashif Raza', motherName: 'Sobia Kashif', parentEmail: 'kashif.raza@gmail.com', parentPhone: '+92-300-8901237', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
  { id: 'STU-024', name: 'Rohail Siddiqui', role: 'student', email: 'rohail.s@school.edu.pk', phone: '+92-300-9012348', status: 'active', joinDate: '2022-04-01', class: '9-A', fatherName: 'Zubair Siddiqui', motherName: 'Amber Siddiqui', parentEmail: 'zubair.siddiqui@gmail.com', parentPhone: '+92-300-9012348', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },

  // ── Class 10-A (12 Students) ──
  { id: 'STU-025', name: 'Faisal Qureshi', role: 'student', email: 'faisal.q@school.edu.pk', phone: '+92-302-6677889', status: 'active', joinDate: '2020-04-01', class: '10-A', fatherName: 'Kamran Qureshi', motherName: 'Nargis Qureshi', parentEmail: 'kamran.qureshi@gmail.com', parentPhone: '+92-300-1234568', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { id: 'STU-026', name: 'Hania Aamir', role: 'student', email: 'hania.a@school.edu.pk', phone: '+92-346-7788990', status: 'active', joinDate: '2021-04-01', class: '10-A', fatherName: 'Aamir Hussain', motherName: 'Bushra Aamir', parentEmail: 'aamir.hussain@gmail.com', parentPhone: '+92-300-2345670', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { id: 'STU-027', name: 'Ibrahim Khalid', role: 'student', email: 'ibrahim.k@school.edu.pk', phone: '+92-313-8899001', status: 'active', joinDate: '2020-04-01', class: '10-A', fatherName: 'Khalid Masood', motherName: 'Tahira Khalid', parentEmail: 'khalid.masood@gmail.com', parentPhone: '+92-300-3456781', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
  { id: 'STU-028', name: 'Mahnoor Tariq', role: 'student', email: 'mahnoor.t@school.edu.pk', phone: '+92-324-9900112', status: 'active', joinDate: '2022-04-01', class: '10-A', fatherName: 'Tariq Jameel', motherName: 'Shaheen Tariq', parentEmail: 'tariq.jameel@gmail.com', parentPhone: '+92-300-4567892', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
  { id: 'STU-029', name: 'Saad Rizvi', role: 'student', email: 'saad.r@school.edu.pk', phone: '+92-303-1011121', status: 'active', joinDate: '2021-04-01', class: '10-A', fatherName: 'Asad Rizvi', motherName: 'Huma Rizvi', parentEmail: 'asad.rizvi@gmail.com', parentPhone: '+92-300-5678903', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 'STU-030', name: 'Aayan Bilal', role: 'student', email: 'aayan.b@school.edu.pk', phone: '+92-300-6789016', status: 'active', joinDate: '2021-04-01', class: '10-A', fatherName: 'Bilal Arshad', motherName: 'Farah Bilal', parentEmail: 'bilal.arshad@gmail.com', parentPhone: '+92-300-6789016', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
  { id: 'STU-031', name: 'Fatima Zahra', role: 'student', email: 'fatima.z@school.edu.pk', phone: '+92-300-7890127', status: 'active', joinDate: '2020-04-01', class: '10-A', fatherName: 'Zahid Hussain', motherName: 'Uzma Zahid', parentEmail: 'zahid.hussain@gmail.com', parentPhone: '+92-300-7890127', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150' },
  { id: 'STU-032', name: 'Mustafa Hashmi', role: 'student', email: 'mustafa.h@school.edu.pk', phone: '+92-300-8901238', status: 'active', joinDate: '2022-04-01', class: '10-A', fatherName: 'Waseem Hashmi', motherName: 'Sobia Waseem', parentEmail: 'waseem.hashmi@gmail.com', parentPhone: '+92-300-8901238', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
  { id: 'STU-033', name: 'Sara Sohail', role: 'student', email: 'sara.sohail@school.edu.pk', phone: '+92-300-9012349', status: 'active', joinDate: '2021-04-01', class: '10-A', fatherName: 'Sohail Anwar', motherName: 'Robina Sohail', parentEmail: 'sohail.anwar@gmail.com', parentPhone: '+92-300-9012349', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: 'STU-034', name: 'Zohaib Younus', role: 'student', email: 'zohaib.y@school.edu.pk', phone: '+92-300-0123450', status: 'active', joinDate: '2020-04-01', class: '10-A', fatherName: 'Younus Khan', motherName: 'Sadia Younus', parentEmail: 'younus.khan@gmail.com', parentPhone: '+92-300-0123450', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
  { id: 'STU-035', name: 'Minahil Farhan', role: 'student', email: 'minahil.f@school.edu.pk', phone: '+92-300-1234571', status: 'active', joinDate: '2022-04-01', class: '10-A', fatherName: 'Farhan Zaidi', motherName: 'Shazmeen Farhan', parentEmail: 'farhan.zaidi@gmail.com', parentPhone: '+92-300-1234571', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
  { id: 'STU-036', name: 'Waleed Aslam', role: 'student', email: 'waleed.a@school.edu.pk', phone: '+92-300-2345672', status: 'active', joinDate: '2021-04-01', class: '10-A', fatherName: 'Aslam Parvez', motherName: 'Noreen Aslam', parentEmail: 'aslam.parvez@gmail.com', parentPhone: '+92-300-2345672', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
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
  { id: 'FEE-003', studentId: 'STU-003', studentName: 'Muhammad Bilal', class: '8-A', month: 'June', year: '2026', amount: 15000, status: 'Paid', dueDate: '2026-06-10', paidAmount: 15000, paidDate: '2026-06-02', receiptNo: 'R-50002' },
  { id: 'FEE-004', studentId: 'STU-013', studentName: 'Zara Malik', class: '9-A', month: 'June', year: '2026', amount: 16000, status: 'Paid', dueDate: '2026-06-10', paidAmount: 16000, paidDate: '2026-06-04', receiptNo: 'R-50003' },
  { id: 'FEE-005', studentId: 'STU-014', studentName: 'Hamza Sheikh', class: '9-A', month: 'June', year: '2026', amount: 16000, status: 'Unpaid', dueDate: '2026-06-10' },
  { id: 'FEE-006', studentId: 'STU-025', studentName: 'Faisal Qureshi', class: '10-A', month: 'June', year: '2026', amount: 18000, status: 'Overdue', dueDate: '2026-06-10' },
  { id: 'FEE-007', studentId: 'STU-026', studentName: 'Hania Aamir', class: '10-A', month: 'June', year: '2026', amount: 18000, status: 'Paid', dueDate: '2026-06-10', paidAmount: 18000, paidDate: '2026-06-01', receiptNo: 'R-50004' }
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
  { id: 'APR-001', type: 'notice', title: 'Exam Schedule Announcement', submittedBy: 'Mr. Tariq Mehmood', submittedDate: '2026-06-15', content: 'First term exams will commence from July 15, 2026. The detailed schedule is attached.', status: 'pending', priority: 'high' },
  { id: 'APR-002', type: 'notice', title: 'Science Fair Participation', submittedBy: 'Ms. Sana Mirza', submittedDate: '2026-06-14', content: 'Students of class 8-10 are invited to participate in the annual science fair on July 5, 2026.', status: 'pending', priority: 'medium' },
  { id: 'APR-003', type: 'leave', title: 'Medical Leave — Mr. Kamran Baig', submittedBy: 'Mr. Kamran Baig', submittedDate: '2026-06-12', content: 'Requesting 3-day medical leave from June 17-19 due to scheduled surgery.', status: 'approved', priority: 'medium' },
  { id: 'APR-004', type: 'notice', title: 'Field Trip to National Museum', submittedBy: 'Ms. Ayesha Siddiqui', submittedDate: '2026-06-10', content: 'Class 9-A students are invited for an educational field trip on June 25, 2026.', status: 'rejected', priority: 'low' },
];

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'holiday' | 'urgent' | 'event' | 'info';
  status: 'approved' | 'draft';
  author: string;
  isRead?: boolean;
}

export let notices: Notice[] = [
  { id: 'N-001', title: 'Summer Vacation Announcement', content: 'School will remain closed for summer holidays starting June 20th till July 31st.', date: '2026-06-14', category: 'holiday', status: 'approved', author: 'Admin' },
  { id: 'N-002', title: 'Parent Teacher Meeting', content: 'The first term PTM is scheduled for coming Saturday. Parents are requested to attend at 9 AM.', date: '2026-06-10', category: 'urgent', status: 'approved', author: 'Admin' },
  { id: 'N-003', title: 'Annual Sports Gala', content: 'Inter-class football and cricket tournament starts next week. Register with Mr. Tariq.', date: '2026-06-05', category: 'event', status: 'approved', author: 'Mr. Tariq' },
  { id: 'N-004', title: 'Uniform & Discipline Inspection', content: 'Strict uniform inspection will be carried out next week by administration.', date: '2026-06-02', category: 'info', status: 'approved', author: 'Admin' },
];

export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  todayAttendanceRate: number;
  feeCollectionRate: number;
  monthlyRevenueTarget: number;
  monthlyRevenueCollected: number;
  attendanceTrend: { day: string; rate: number }[];
  feeCollectionByMonth: { month: string; collected: number; target: number }[];
}

export const schoolStats: SchoolStats = {
  totalStudents: 36,
  totalTeachers: 7,
  totalClasses: 3,
  todayAttendanceRate: 94.4,
  feeCollectionRate: 83.3,
  monthlyRevenueTarget: 576000,
  monthlyRevenueCollected: 480000,
  attendanceTrend: [
    { day: 'Mon', rate: 94 },
    { day: 'Tue', rate: 91 },
    { day: 'Wed', rate: 97 },
    { day: 'Thu', rate: 100 },
    { day: 'Fri', rate: 89 },
    { day: 'Sat', rate: 94 },
  ],
  feeCollectionByMonth: [
    { month: 'Jan', collected: 550000, target: 576000 },
    { month: 'Feb', collected: 576000, target: 576000 },
    { month: 'Mar', collected: 560000, target: 576000 },
    { month: 'Apr', collected: 520000, target: 576000 },
    { month: 'May', collected: 500000, target: 576000 },
    { month: 'Jun', collected: 480000, target: 576000 },
  ],
};
