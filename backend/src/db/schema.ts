import { mysqlTable, varchar, text, timestamp, boolean, mysqlEnum, int, decimal, date, uniqueIndex } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  role: mysqlEnum('role', ['admin', 'staff', 'student', 'parent']).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const terms = mysqlTable('terms', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  name: varchar('name', { length: 100 }).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  isCurrent: boolean('is_current').default(false),
});

export const classes = mysqlTable('classes', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  name: varchar('name', { length: 100 }).notNull(),
  termId: varchar('term_id', { length: 36 }).references(() => terms.id),
  capacity: int('capacity').default(40),
  createdAt: timestamp('created_at').defaultNow(),
});

export const studentProfiles = mysqlTable('student_profiles', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  userId: varchar('user_id', { length: 36 }).references(() => users.id, { onDelete: 'cascade' }),
  studentId: varchar('student_id', { length: 20 }).unique().notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  dateOfBirth: date('date_of_birth'),
  gender: varchar('gender', { length: 10 }),
  address: text('address'),
  phone: varchar('phone', { length: 20 }),
  enrollmentDate: date('enrollment_date').notNull(),
  status: mysqlEnum('status', ['active', 'inactive', 'graduated', 'withdrawn']).default('active'),
  classId: varchar('class_id', { length: 36 }).references(() => classes.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const staffProfiles = mysqlTable('staff_profiles', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  userId: varchar('user_id', { length: 36 }).references(() => users.id, { onDelete: 'cascade' }),
  staffId: varchar('staff_id', { length: 20 }).unique().notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  department: varchar('department', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  hireDate: date('hire_date'),
});

export const parentProfiles = mysqlTable('parent_profiles', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  userId: varchar('user_id', { length: 36 }).references(() => users.id, { onDelete: 'cascade' }),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  studentId: varchar('student_id', { length: 36 }).references(() => studentProfiles.id),
});

export const subjects = mysqlTable('subjects', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 20 }).unique().notNull(),
});

export const classSubjects = mysqlTable('class_subjects', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  classId: varchar('class_id', { length: 36 }).references(() => classes.id),
  subjectId: varchar('subject_id', { length: 36 }).references(() => subjects.id),
  staffId: varchar('staff_id', { length: 36 }).references(() => staffProfiles.id),
  termId: varchar('term_id', { length: 36 }).references(() => terms.id),
}, (t) => ({
  unq: uniqueIndex('class_subject_term_idx').on(t.classId, t.subjectId, t.termId),
}));

export const grades = mysqlTable('grades', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  studentId: varchar('student_id', { length: 36 }).references(() => studentProfiles.id),
  classSubjectId: varchar('class_subject_id', { length: 36 }).references(() => classSubjects.id),
  score: decimal('score', { precision: 5, scale: 2 }).notNull(),
  remarks: text('remarks'),
  recordedBy: varchar('recorded_by', { length: 36 }).references(() => staffProfiles.id),
  recordedAt: timestamp('recorded_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const attendance = mysqlTable('attendance', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  studentId: varchar('student_id', { length: 36 }).references(() => studentProfiles.id),
  classId: varchar('class_id', { length: 36 }).references(() => classes.id),
  date: date('date').notNull(),
  status: mysqlEnum('status', ['present', 'absent', 'late', 'excused']).notNull(),
  checkedBy: varchar('checked_by', { length: 36 }).references(() => staffProfiles.id),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  unq: uniqueIndex('student_class_date_idx').on(t.studentId, t.classId, t.date),
}));

export const auditLogs = mysqlTable('audit_logs', {
  id:        varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  userId:    varchar('user_id', { length: 36 }).references(() => users.id, { onDelete: 'set null' }),
  action:    varchar('action', { length: 50 }).notNull(),
  module:    varchar('module', { length: 50 }).notNull(),
  details:   text('details'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const refreshTokens = mysqlTable('refresh_tokens', {
  id:        varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  userId:    varchar('user_id', { length: 36 }).references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token:     varchar('token', { length: 512 }).unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

