import { Grade, LetterGrade, GradeWord, GpaSummary, AttendanceRecord, AttendanceSummary, Student, Staff, Class, Term, Subject, Payment, User } from '../types';

// ── Grading helper ────────────────────────────────────────────
export function calcGrade(score: number): { letterGrade: LetterGrade; gradePoints: number; descriptiveWord: GradeWord } {
  if (score >= 90) return { letterGrade: 'A+', gradePoints: 4.0, descriptiveWord: 'Outstanding' };
  if (score >= 80) return { letterGrade: 'A',  gradePoints: 3.7, descriptiveWord: 'Excellent' };
  if (score >= 70) return { letterGrade: 'B',  gradePoints: 3.0, descriptiveWord: 'Good' };
  if (score >= 60) return { letterGrade: 'C',  gradePoints: 2.0, descriptiveWord: 'Average' };
  if (score >= 50) return { letterGrade: 'D',  gradePoints: 1.0, descriptiveWord: 'Poor' };
  if (score >= 30) return { letterGrade: 'F',  gradePoints: 0.0, descriptiveWord: 'Failed' };
  return              { letterGrade: 'F-', gradePoints: 0.0, descriptiveWord: 'Worst' };
}

// ── Demo login accounts ───────────────────────────────────────
export const DEMO_USERS: (User & { password: string })[] = [
  { id: 'u1', email: 'admin@base2media.ac', password: 'admin123',   role: 'admin',   name: 'Dr. Samuel Osei' },
  { id: 'u2', email: 'staff@base2media.ac', password: 'staff123',   role: 'staff',   name: 'Ms. Grace Mensah' },
  { id: 'u3', email: 'student@base2media.ac', password: 'student123', role: 'student', name: 'Kwame Asante' },
  { id: 'u4', email: 'parent@base2media.ac', password: 'parent123',  role: 'parent',  name: 'Mr. Joseph Asante' },
];

// ── Terms ─────────────────────────────────────────────────────
export const TERMS: Term[] = [
  { id: 't1', name: 'Term 1 – 2024', startDate: '2024-01-08', endDate: '2024-04-12', isCurrent: false },
  { id: 't2', name: 'Term 2 – 2024', startDate: '2024-05-06', endDate: '2024-08-09', isCurrent: false },
  { id: 't3', name: 'Term 1 – 2025', startDate: '2025-01-13', endDate: '2025-04-11', isCurrent: true  },
];

// ── Subjects ──────────────────────────────────────────────────
export const SUBJECTS: Subject[] = [
  { id: 's1', code: 'ENG101', name: 'English Language' },
  { id: 's2', code: 'MTH101', name: 'Mathematics' },
  { id: 's3', code: 'SCI101', name: 'Integrated Science' },
  { id: 's4', code: 'ICT101', name: 'Information Technology' },
  { id: 's5', code: 'SOC101', name: 'Social Studies' },
  { id: 's6', code: 'MED101', name: 'Media Studies' },
];

// ── Classes ───────────────────────────────────────────────────
export const CLASSES: Class[] = [
  { id: 'c1', name: 'Grade 10A', termId: 't3', capacity: 40, studentCount: 28 },
  { id: 'c2', name: 'Grade 10B', termId: 't3', capacity: 40, studentCount: 30 },
  { id: 'c3', name: 'Grade 11A', termId: 't3', capacity: 40, studentCount: 25 },
  { id: 'c4', name: 'Grade 12A', termId: 't3', capacity: 40, studentCount: 22 },
];

// ── Students ──────────────────────────────────────────────────
export const STUDENTS: Student[] = [
  { id: 'st1', studentId: 'B2MA-2025-001', firstName: 'Kwame',   lastName: 'Asante',   fullName: 'Kwame Asante',   dateOfBirth: '2008-03-14', gender: 'Male',   classId: 'c1', className: 'Grade 10A', enrollmentDate: '2025-01-13', status: 'active', email: 'student@base2media.ac', phone: '0241234567', address: 'Accra, Ghana' },
  { id: 'st2', studentId: 'B2MA-2025-002', firstName: 'Abena',   lastName: 'Boateng',  fullName: 'Abena Boateng',  dateOfBirth: '2008-07-22', gender: 'Female', classId: 'c1', className: 'Grade 10A', enrollmentDate: '2025-01-13', status: 'active', email: 'abena@student.b2ma.ac', phone: '0249876543', address: 'Kumasi, Ghana' },
  { id: 'st3', studentId: 'B2MA-2025-003', firstName: 'Kofi',    lastName: 'Mensah',   fullName: 'Kofi Mensah',    dateOfBirth: '2008-11-05', gender: 'Male',   classId: 'c1', className: 'Grade 10A', enrollmentDate: '2025-01-13', status: 'active', email: 'kofi@student.b2ma.ac',  phone: '0271122334', address: 'Tema, Ghana' },
  { id: 'st4', studentId: 'B2MA-2025-004', firstName: 'Ama',     lastName: 'Owusu',    fullName: 'Ama Owusu',      dateOfBirth: '2008-05-18', gender: 'Female', classId: 'c1', className: 'Grade 10A', enrollmentDate: '2025-01-13', status: 'active', email: 'ama@student.b2ma.ac',   phone: '0261234000', address: 'Takoradi, Ghana' },
  { id: 'st5', studentId: 'B2MA-2025-005', firstName: 'Yaw',     lastName: 'Darko',    fullName: 'Yaw Darko',      dateOfBirth: '2007-09-30', gender: 'Male',   classId: 'c2', className: 'Grade 10B', enrollmentDate: '2025-01-13', status: 'active', email: 'yaw@student.b2ma.ac',   phone: '0551234567', address: 'Cape Coast, Ghana' },
  { id: 'st6', studentId: 'B2MA-2025-006', firstName: 'Akosua',  lastName: 'Frimpong', fullName: 'Akosua Frimpong',dateOfBirth: '2007-12-01', gender: 'Female', classId: 'c2', className: 'Grade 10B', enrollmentDate: '2025-01-13', status: 'active', email: 'akosua@student.b2ma.ac',phone: '0231122000', address: 'Accra, Ghana' },
  { id: 'st7', studentId: 'B2MA-2024-010', firstName: 'Nana',    lastName: 'Adu',      fullName: 'Nana Adu',       dateOfBirth: '2006-04-11', gender: 'Male',   classId: 'c3', className: 'Grade 11A', enrollmentDate: '2024-01-08', status: 'active', email: 'nana@student.b2ma.ac',  phone: '0241234000', address: 'Kumasi, Ghana' },
  { id: 'st8', studentId: 'B2MA-2024-011', firstName: 'Efua',    lastName: 'Sarpong',  fullName: 'Efua Sarpong',   dateOfBirth: '2006-08-20', gender: 'Female', classId: 'c3', className: 'Grade 11A', enrollmentDate: '2024-01-08', status: 'active', email: 'efua@student.b2ma.ac',  phone: '0241230001', address: 'Accra, Ghana' },
];

// ── Staff ─────────────────────────────────────────────────────
export const STAFF_LIST: Staff[] = [
  { id: 'sf1', staffId: 'B2MA-STF-001', firstName: 'Grace',  lastName: 'Mensah',  fullName: 'Ms. Grace Mensah',  email: 'staff@base2media.ac',    department: 'Media & ICT',   phone: '0244001122', hireDate: '2022-08-01', subjects: ['ICT101', 'MED101'], classes: ['c1', 'c2'] },
  { id: 'sf2', staffId: 'B2MA-STF-002', firstName: 'Isaac',  lastName: 'Boateng', fullName: 'Mr. Isaac Boateng', email: 'isaac@staff.b2ma.ac',     department: 'Sciences',      phone: '0244003344', hireDate: '2021-01-15', subjects: ['SCI101', 'MTH101'], classes: ['c1', 'c3'] },
  { id: 'sf3', staffId: 'B2MA-STF-003', firstName: 'Comfort',lastName: 'Asare',   fullName: 'Mrs. Comfort Asare',email: 'comfort@staff.b2ma.ac',   department: 'Humanities',    phone: '0244005566', hireDate: '2020-09-01', subjects: ['ENG101', 'SOC101'], classes: ['c2', 'c4'] },
];

// ── Raw scores helper ─────────────────────────────────────────
function makeGrade(id: string, studentId: string, studentName: string, subjectId: string, subjectName: string, classId: string, termId: string, score: number, staffName: string): Grade {
  const g = calcGrade(score);
  return { id, studentId, studentName, subjectId, subjectName, classId, termId, score, ...g, recordedBy: staffName, recordedAt: '2025-03-15' };
}

// ── Grades ────────────────────────────────────────────────────
export const GRADES: Grade[] = [
  makeGrade('g1',  'st1','Kwame Asante',   's1','English Language',  'c1','t3', 88, 'Ms. Grace Mensah'),
  makeGrade('g2',  'st1','Kwame Asante',   's2','Mathematics',        'c1','t3', 76, 'Mr. Isaac Boateng'),
  makeGrade('g3',  'st1','Kwame Asante',   's3','Integrated Science', 'c1','t3', 91, 'Mr. Isaac Boateng'),
  makeGrade('g4',  'st1','Kwame Asante',   's4','Information Technology','c1','t3', 95, 'Ms. Grace Mensah'),
  makeGrade('g5',  'st1','Kwame Asante',   's5','Social Studies',     'c1','t3', 82, 'Mrs. Comfort Asare'),
  makeGrade('g6',  'st1','Kwame Asante',   's6','Media Studies',      'c1','t3', 89, 'Ms. Grace Mensah'),
  makeGrade('g7',  'st2','Abena Boateng',  's1','English Language',  'c1','t3', 94, 'Ms. Grace Mensah'),
  makeGrade('g8',  'st2','Abena Boateng',  's2','Mathematics',        'c1','t3', 85, 'Mr. Isaac Boateng'),
  makeGrade('g9',  'st2','Abena Boateng',  's3','Integrated Science', 'c1','t3', 79, 'Mr. Isaac Boateng'),
  makeGrade('g10', 'st2','Abena Boateng',  's4','Information Technology','c1','t3', 88, 'Ms. Grace Mensah'),
  makeGrade('g11', 'st2','Abena Boateng',  's5','Social Studies',     'c1','t3', 91, 'Mrs. Comfort Asare'),
  makeGrade('g12', 'st2','Abena Boateng',  's6','Media Studies',      'c1','t3', 87, 'Ms. Grace Mensah'),
  makeGrade('g13', 'st3','Kofi Mensah',    's1','English Language',  'c1','t3', 65, 'Ms. Grace Mensah'),
  makeGrade('g14', 'st3','Kofi Mensah',    's2','Mathematics',        'c1','t3', 58, 'Mr. Isaac Boateng'),
  makeGrade('g15', 'st3','Kofi Mensah',    's3','Integrated Science', 'c1','t3', 70, 'Mr. Isaac Boateng'),
  makeGrade('g16', 'st3','Kofi Mensah',    's4','Information Technology','c1','t3', 72, 'Ms. Grace Mensah'),
  makeGrade('g17', 'st3','Kofi Mensah',    's5','Social Studies',     'c1','t3', 61, 'Mrs. Comfort Asare'),
  makeGrade('g18', 'st3','Kofi Mensah',    's6','Media Studies',      'c1','t3', 66, 'Ms. Grace Mensah'),
  makeGrade('g19', 'st4','Ama Owusu',      's1','English Language',  'c1','t3', 78, 'Ms. Grace Mensah'),
  makeGrade('g20', 'st4','Ama Owusu',      's2','Mathematics',        'c1','t3', 82, 'Mr. Isaac Boateng'),
  makeGrade('g21', 'st4','Ama Owusu',      's3','Integrated Science', 'c1','t3', 74, 'Mr. Isaac Boateng'),
  makeGrade('g22', 'st4','Ama Owusu',      's4','Information Technology','c1','t3', 80, 'Ms. Grace Mensah'),
  makeGrade('g23', 'st4','Ama Owusu',      's5','Social Studies',     'c1','t3', 76, 'Mrs. Comfort Asare'),
  makeGrade('g24', 'st4','Ama Owusu',      's6','Media Studies',      'c1','t3', 83, 'Ms. Grace Mensah'),
];

// ── GPA Summary (leaderboard) ─────────────────────────────────
export function computeGpaSummary(classId: string, termId: string): GpaSummary[] {
  const studentsInClass = STUDENTS.filter(s => s.classId === classId);
  const summaries = studentsInClass.map(st => {
    const gs = GRADES.filter(g => g.studentId === st.id && g.termId === termId);
    const gpa = gs.length ? parseFloat((gs.reduce((a, g) => a + g.gradePoints, 0) / gs.length).toFixed(2)) : 0;
    return { studentId: st.id, studentName: st.fullName, classId, className: st.className, termId, gpa, subjectsGraded: gs.length, classRank: 0, totalStudents: studentsInClass.length };
  });
  summaries.sort((a, b) => b.gpa - a.gpa);
  summaries.forEach((s, i) => { s.classRank = i + 1; s.totalStudents = summaries.length; });
  return summaries;
}

// ── Attendance ────────────────────────────────────────────────
export const ATTENDANCE: AttendanceRecord[] = [
  { id: 'a1',  studentId: 'st1', studentName: 'Kwame Asante',   classId: 'c1', date: '2025-04-14', status: 'present', checkedBy: 'Ms. Grace Mensah' },
  { id: 'a2',  studentId: 'st2', studentName: 'Abena Boateng',  classId: 'c1', date: '2025-04-14', status: 'present', checkedBy: 'Ms. Grace Mensah' },
  { id: 'a3',  studentId: 'st3', studentName: 'Kofi Mensah',    classId: 'c1', date: '2025-04-14', status: 'absent',  checkedBy: 'Ms. Grace Mensah' },
  { id: 'a4',  studentId: 'st4', studentName: 'Ama Owusu',      classId: 'c1', date: '2025-04-14', status: 'late',    checkedBy: 'Ms. Grace Mensah' },
  { id: 'a5',  studentId: 'st1', studentName: 'Kwame Asante',   classId: 'c1', date: '2025-04-15', status: 'present', checkedBy: 'Ms. Grace Mensah' },
  { id: 'a6',  studentId: 'st2', studentName: 'Abena Boateng',  classId: 'c1', date: '2025-04-15', status: 'present', checkedBy: 'Ms. Grace Mensah' },
  { id: 'a7',  studentId: 'st3', studentName: 'Kofi Mensah',    classId: 'c1', date: '2025-04-15', status: 'present', checkedBy: 'Ms. Grace Mensah' },
  { id: 'a8',  studentId: 'st4', studentName: 'Ama Owusu',      classId: 'c1', date: '2025-04-15', status: 'present', checkedBy: 'Ms. Grace Mensah' },
  { id: 'a9',  studentId: 'st1', studentName: 'Kwame Asante',   classId: 'c1', date: '2025-04-16', status: 'present', checkedBy: 'Ms. Grace Mensah' },
  { id: 'a10', studentId: 'st2', studentName: 'Abena Boateng',  classId: 'c1', date: '2025-04-16', status: 'excused', checkedBy: 'Ms. Grace Mensah' },
  { id: 'a11', studentId: 'st3', studentName: 'Kofi Mensah',    classId: 'c1', date: '2025-04-16', status: 'absent',  checkedBy: 'Ms. Grace Mensah' },
  { id: 'a12', studentId: 'st4', studentName: 'Ama Owusu',      classId: 'c1', date: '2025-04-16', status: 'present', checkedBy: 'Ms. Grace Mensah' },
];

export function computeAttendanceSummary(studentId: string): AttendanceSummary {
  const records = ATTENDANCE.filter(a => a.studentId === studentId);
  const present = records.filter(a => a.status === 'present').length;
  const absent  = records.filter(a => a.status === 'absent').length;
  const late    = records.filter(a => a.status === 'late').length;
  const excused = records.filter(a => a.status === 'excused').length;
  const total   = records.length;
  const student = STUDENTS.find(s => s.id === studentId);
  return { studentId, studentName: student?.fullName ?? '', totalDays: total, present, absent, late, excused, percentage: total ? Math.round(((present + late) / total) * 100) : 0 };
}

// ── Payments ──────────────────────────────────────────────────
export const PAYMENTS: Payment[] = [
  { id: 'p1', studentId: 'st1', studentName: 'Kwame Asante',  description: 'Term 1 2025 School Fees', totalFee: 1200, amountPaid: 1200, balance: 0,   paymentDate: '2025-01-10', method: 'mobile_money', reference: 'MM-001234', status: 'paid' },
  { id: 'p2', studentId: 'st2', studentName: 'Abena Boateng', description: 'Term 1 2025 School Fees', totalFee: 1200, amountPaid: 800,  balance: 400, paymentDate: '2025-01-12', method: 'cash',         reference: 'CASH-0045', status: 'partial' },
  { id: 'p3', studentId: 'st3', studentName: 'Kofi Mensah',   description: 'Term 1 2025 School Fees', totalFee: 1200, amountPaid: 0,    balance: 1200,paymentDate: '',           method: 'cash',         reference: '',          status: 'unpaid' },
  { id: 'p4', studentId: 'st4', studentName: 'Ama Owusu',     description: 'Term 1 2025 School Fees', totalFee: 1200, amountPaid: 1200, balance: 0,   paymentDate: '2025-01-09', method: 'bank_transfer', reference: 'BNK-990011',status: 'paid' },
  { id: 'p5', studentId: 'st5', studentName: 'Yaw Darko',     description: 'Term 1 2025 School Fees', totalFee: 1200, amountPaid: 600,  balance: 600, paymentDate: '2025-01-14', method: 'mobile_money', reference: 'MM-001299', status: 'partial' },
  { id: 'p6', studentId: 'st6', studentName: 'Akosua Frimpong',description:'Term 1 2025 School Fees', totalFee: 1200, amountPaid: 1200, balance: 0,   paymentDate: '2025-01-08', method: 'card',         reference: 'CRD-00782', status: 'paid' },
];
