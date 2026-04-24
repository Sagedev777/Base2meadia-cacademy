// All shared TypeScript types for Base 2 Media Academy SMS

export type Role = 'admin' | 'staff' | 'student' | 'parent';

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
  avatar?: string;
}

export interface Student {
  id: string;
  studentId: string; // e.g. B2MA-2024-001
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  classId: string;
  className: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated' | 'withdrawn';
  email: string;
  phone: string;
  address: string;
  photoUrl?: string;
  parentId?: string;
}

export interface Staff {
  id: string;
  staffId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  department: string;
  phone: string;
  hireDate: string;
  photoUrl?: string;
  subjects: string[];
  classes: string[];
}

export interface Subject {
  id: string;
  code: string;
  name: string;
}

export interface Class {
  id: string;
  name: string;
  termId: string;
  capacity: number;
  studentCount: number;
}

export interface Term {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export type LetterGrade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' | 'F-';
export type GradeWord = 'Outstanding' | 'Excellent' | 'Good' | 'Average' | 'Poor' | 'Failed' | 'Worst';

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  termId: string;
  score: number;
  letterGrade: LetterGrade;
  gradePoints: number;
  descriptiveWord: GradeWord;
  recordedBy: string;
  recordedAt: string;
}

export interface GpaSummary {
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  termId: string;
  gpa: number;
  subjectsGraded: number;
  classRank: number;
  totalStudents: number;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  checkedBy: string;
  notes?: string;
}

export interface AttendanceSummary {
  studentId: string;
  studentName: string;
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  description: string;
  totalFee: number;
  amountPaid: number;
  balance: number;
  paymentDate: string;
  method: 'cash' | 'bank_transfer' | 'mobile_money' | 'card';
  reference: string;
  status: 'paid' | 'partial' | 'unpaid';
}
