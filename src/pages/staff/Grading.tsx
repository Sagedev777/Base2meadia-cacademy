import { useState, useRef } from 'react';
import { Save, Upload, Download, CheckCircle, AlertTriangle } from 'lucide-react';
import { GRADES, STUDENTS, SUBJECTS, CLASSES, TERMS, calcGrade } from '../../data/mockData';
import { Grade } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { STAFF_LIST } from '../../data/mockData';

function gradeBadgeColor(score: number) {
  if (score >= 90) return '#a855f7';
  if (score >= 80) return '#22c55e';
  if (score >= 70) return '#3b82f6';
  if (score >= 60) return '#f59e0b';
  if (score >= 50) return '#f97316';
  if (score >= 30) return '#ef4444';
  return '#7f1d1d';
}

interface CSVRow { studentId: string; score: number; error?: string; }

function parseCSV(text: string): CSVRow[] {
  const lines = text.trim().split('\n').filter(l => l.trim());
  const rows: CSVRow[] = [];
  for (const line of lines) {
    if (line.toLowerCase().startsWith('studentid') || line.toLowerCase().startsWith('student_id')) continue;
    const [sid, scoreStr] = line.split(',').map(s => s.trim().replace(/"/g, ''));
    const score = parseFloat(scoreStr);
    if (!sid) continue;
    if (isNaN(score) || score < 0 || score > 100) {
      rows.push({ studentId: sid, score: 0, error: `Invalid score: ${scoreStr}` });
    } else {
      rows.push({ studentId: sid, score });
    }
  }
  return rows;
}

function downloadTemplate(students: typeof STUDENTS, subjectName: string) {
  const header = 'StudentID,Score';
  const rows = students.map(s => `${s.studentId},`);
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: `${subjectName.replace(/\s/g,'_')}_grades_template.csv` });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function Grading() {
  const user = useAuthStore(s => s.user)!;
  const staffProfile = STAFF_LIST.find(sf => sf.email === user.email) ?? STAFF_LIST[0];
  const currentTerm = TERMS.find(t => t.isCurrent)!;

  const [grades, setGrades] = useState<Grade[]>(GRADES);
  const [selClass, setSelClass] = useState(staffProfile.classes[0] ?? 'c1');
  const [selSubject, setSelSubject] = useState(SUBJECTS[0].id);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<'manual' | 'csv'>('manual');
  const [csvRows, setCsvRows] = useState<CSVRow[]>([]);
  const [csvApplied, setCsvApplied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const myClasses = CLASSES.filter(c => staffProfile.classes.includes(c.id));
  const studentsInClass = STUDENTS.filter(s => s.classId === selClass);

  const scoreMap: Record<string, number> = {};
  grades.filter(g => g.classId === selClass && g.subjectId === selSubject && g.termId === currentTerm.id)
    .forEach(g => { scoreMap[g.studentId] = g.score; });

  const [scoreEdits, setScoreEdits] = useState<Record<string, string>>({});

  const handleScoreChange = (studentId: string, val: string) => {
    setScoreEdits(prev => ({ ...prev, [studentId]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    const subjectData = SUBJECTS.find(s => s.id === selSubject)!;
    const updates: Grade[] = [];
    studentsInClass.forEach(st => {
      const rawVal = scoreEdits[st.id];
      if (rawVal === undefined) return;
      const score = Math.min(100, Math.max(0, parseFloat(rawVal) || 0));
      const calc = calcGrade(score);
      const existing = grades.find(g => g.studentId === st.id && g.subjectId === selSubject && g.classId === selClass && g.termId === currentTerm.id);
      if (existing) {
        updates.push({ ...existing, score, ...calc });
      } else {
        updates.push({ id: `g${Date.now()}-${st.id}`, studentId: st.id, studentName: st.fullName, subjectId: selSubject, subjectName: subjectData.name, classId: selClass, termId: currentTerm.id, score, ...calc, recordedBy: staffProfile.fullName, recordedAt: new Date().toISOString().slice(0,10) });
      }
    });
    setGrades(prev => [...prev.filter(g => !updates.find(u => u.id === g.id)), ...updates]);
    setScoreEdits({}); setSaved(true); setTimeout(() => setSaved(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const rows = parseCSV(ev.target?.result as string);
      setCsvRows(rows); setCsvApplied(false);
    };
    reader.readAsText(file);
  };

  const applyCSV = () => {
    const subjectData = SUBJECTS.find(s => s.id === selSubject)!;
    const validRows = csvRows.filter(r => !r.error);
    const updates: Grade[] = [];
    validRows.forEach(row => {
      const st = studentsInClass.find(s => s.studentId === row.studentId);
      if (!st) return;
      const calc = calcGrade(row.score);
      const existing = grades.find(g => g.studentId === st.id && g.subjectId === selSubject && g.classId === selClass && g.termId === currentTerm.id);
      if (existing) {
        updates.push({ ...existing, score: row.score, ...calc });
      } else {
        updates.push({ id: `g${Date.now()}-${st.id}`, studentId: st.id, studentName: st.fullName, subjectId: selSubject, subjectName: subjectData.name, classId: selClass, termId: currentTerm.id, score: row.score, ...calc, recordedBy: staffProfile.fullName, recordedAt: new Date().toISOString().slice(0,10) });
      }
    });
    setGrades(prev => [...prev.filter(g => !updates.find(u => u.id === g.id)), ...updates]);
    setCsvApplied(true);
  };

  const getDisplayScore = (studentId: string): number | '' => {
    if (scoreEdits[studentId] !== undefined) return scoreEdits[studentId] as unknown as number;
    return scoreMap[studentId] ?? '';
  };

  const getGradeForDisplay = (studentId: string) => {
    const score = scoreMap[studentId];
    if (score === undefined) return null;
    return calcGrade(score);
  };

  return (
    <div>
      <div className="page-header">
        <div><h2>Grade Entry</h2><p>Enter scores — letter grade & descriptor calculate automatically</p></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost btn-sm" id="btn-download-template" onClick={() => downloadTemplate(studentsInClass, SUBJECTS.find(s=>s.id===selSubject)?.name ?? 'grades')}><Download size={14}/> CSV Template</button>
          <button id="btn-save-grades" className="btn btn-staff" onClick={handleSave}><Save size={14}/> Save Grades</button>
        </div>
      </div>

      {saved && <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, padding: '12px 18px', marginBottom: 18, color: '#4ade80', fontSize: 13, fontWeight: 600 }}>✓ Grades saved successfully!</div>}

      {/* Selectors */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="form-row">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Class</label>
            <select id="sel-class" className="form-select" value={selClass} onChange={e => { setSelClass(e.target.value); setScoreEdits({}); }}>
              {myClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Subject</label>
            <select id="sel-subject" className="form-select" value={selSubject} onChange={e => { setSelSubject(e.target.value); setScoreEdits({}); }}>
              {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${tab === 'manual' ? 'active' : ''}`} onClick={() => setTab('manual')}>✏️ Manual Entry</button>
        <button className={`tab ${tab === 'csv' ? 'active' : ''}`} id="tab-csv-upload" onClick={() => setTab('csv')}><Upload size={13}/> Bulk CSV Upload</button>
      </div>

      {/* CSV Upload Tab */}
      {tab === 'csv' && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header"><div><h3>Bulk Grade Upload</h3><p>Upload a CSV file with StudentID and Score columns</p></div></div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
            <input ref={fileRef} type="file" accept=".csv" id="input-csv-file" style={{ display: 'none' }} onChange={handleFileUpload}/>
            <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}><Upload size={14}/> Choose CSV File</button>
            <span style={{ fontSize: 12, color: '#64748b' }}>Format: StudentID, Score (0-100)</span>
          </div>
          {csvRows.length > 0 && (
            <>
              <div className="table-wrap" style={{ marginBottom: 14 }}>
                <table>
                  <thead><tr><th>Student ID</th><th>Name</th><th>Score</th><th>Grade</th><th>Status</th></tr></thead>
                  <tbody>
                    {csvRows.map((row, i) => {
                      const st = studentsInClass.find(s => s.studentId === row.studentId);
                      const g = !row.error ? calcGrade(row.score) : null;
                      return (
                        <tr key={i} style={{ background: row.error ? 'rgba(239,68,68,0.05)' : 'transparent' }}>
                          <td><code style={{ fontSize: 12 }}>{row.studentId}</code></td>
                          <td style={{ fontWeight: 600 }}>{st?.fullName ?? <span style={{ color: '#ef4444' }}>Not found</span>}</td>
                          <td style={{ fontWeight: 700 }}>{row.error ? '—' : `${row.score}%`}</td>
                          <td>{g && <span style={{ fontWeight: 800, color: gradeBadgeColor(row.score) }}>{g.letterGrade}</span>}</td>
                          <td>{row.error ? <span style={{ color: '#ef4444', fontSize: 11 }}>⚠ {row.error}</span> : <span style={{ color: '#22c55e', fontSize: 11 }}>✓ Valid</span>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {csvApplied
                ? <div style={{ color: '#4ade80', fontWeight: 600, fontSize: 13 }}><CheckCircle size={14} style={{ display: 'inline', marginRight: 6 }}/>Grades applied! Switch to Manual Entry to review.</div>
                : <button id="btn-apply-csv" className="btn btn-staff" onClick={applyCSV}><CheckCircle size={14}/> Apply {csvRows.filter(r=>!r.error).length} Valid Grades</button>
              }
            </>
          )}
        </div>
      )}

      {/* Manual Grade Table */}
      {tab === 'manual' && (
        <div className="card" style={{ padding: 0 }}>
          <div className="card-header" style={{ padding: '16px 24px' }}>
            <div><h3>{CLASSES.find(c => c.id === selClass)?.name} — {SUBJECTS.find(s => s.id === selSubject)?.name}</h3><p>{studentsInClass.length} students · {currentTerm.name}</p></div>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Student</th><th>Score (0–100)</th><th>Letter Grade</th><th>Grade Points</th><th>Descriptor</th></tr></thead>
              <tbody>
                {studentsInClass.map((st, idx) => {
                  const displayScore = getDisplayScore(st.id);
                  const gradeInfo = scoreEdits[st.id] !== undefined
                    ? calcGrade(Math.min(100, Math.max(0, parseFloat(scoreEdits[st.id]) || 0)))
                    : getGradeForDisplay(st.id);
                  const color = gradeInfo ? gradeBadgeColor(typeof displayScore === 'number' ? displayScore : scoreMap[st.id] ?? 0) : '#64748b';
                  return (
                    <tr key={st.id}>
                      <td style={{ color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="avatar" style={{ background: '#3b82f618', color: '#3b82f6' }}>{st.firstName[0]}{st.lastName[0]}</div>
                          <div><div style={{ fontWeight: 600 }}>{st.fullName}</div><div className="td-muted">{st.studentId}</div></div>
                        </div>
                      </td>
                      <td><input id={`score-${st.id}`} className="score-input" type="number" min={0} max={100} placeholder="—" value={displayScore} onChange={e => handleScoreChange(st.id, e.target.value)}/></td>
                      <td>{gradeInfo ? <span style={{ fontWeight: 800, fontSize: 18, color }}>{gradeInfo.letterGrade}</span> : <span style={{ color: '#4b6080' }}>—</span>}</td>
                      <td>{gradeInfo ? <span style={{ fontWeight: 700, color }}>{gradeInfo.gradePoints.toFixed(1)}</span> : <span style={{ color: '#4b6080' }}>—</span>}</td>
                      <td>{gradeInfo ? <span className="badge" style={{ background: `${color}18`, color }}>{gradeInfo.descriptiveWord}</span> : <span style={{ color: '#4b6080' }}>—</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grading Scale */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header"><h3>Grading Scale Reference</h3></div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {[{range:'90–100',letter:'A+',word:'Outstanding',color:'#a855f7'},{range:'80–89',letter:'A',word:'Excellent',color:'#22c55e'},{range:'70–79',letter:'B',word:'Good',color:'#3b82f6'},{range:'60–69',letter:'C',word:'Average',color:'#f59e0b'},{range:'50–59',letter:'D',word:'Poor',color:'#f97316'},{range:'30–49',letter:'F',word:'Failed',color:'#ef4444'},{range:'0–29',letter:'F-',word:'Worst',color:'#7f1d1d'}].map(g => (
            <div key={g.letter} style={{ padding: '10px 16px', borderRadius: 10, background: `${g.color}12`, border: `1px solid ${g.color}30`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontWeight: 800, fontSize: 18, color: g.color }}>{g.letter}</span>
              <div><div style={{ fontSize: 11, fontWeight: 600, color: g.color }}>{g.word}</div><div style={{ fontSize: 10, color: '#64748b' }}>{g.range}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
