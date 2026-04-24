import { useState } from 'react';
import { Plus, Edit2, Calendar, BookOpen, Users, CheckCircle } from 'lucide-react';
import { TERMS, CLASSES, SUBJECTS } from '../../data/mockData';
import { Term, Class, Subject } from '../../types';

type ActiveTab = 'terms' | 'classes' | 'subjects';

export default function AcademicSetup() {
  const [tab, setTab] = useState<ActiveTab>('terms');
  const [terms, setTerms]       = useState<Term[]>(TERMS);
  const [classes, setClasses]   = useState<Class[]>(CLASSES);
  const [subjects, setSubjects] = useState<Subject[]>(SUBJECTS);
  const [showModal, setShowModal] = useState(false);

  // ── Term form ───────────────────────────────────────────────
  const [tName, setTName]         = useState('');
  const [tStart, setTStart]       = useState('');
  const [tEnd, setTEnd]           = useState('');

  // ── Class form ──────────────────────────────────────────────
  const [cName, setCName]         = useState('');
  const [cCapacity, setCCapacity] = useState(40);
  const [cTermId, setCTermId]     = useState(TERMS[0]?.id ?? '');

  // ── Subject form ────────────────────────────────────────────
  const [sName, setSName]         = useState('');
  const [sCode, setSCode]         = useState('');
  const [sDesc, setSDesc]         = useState('');

  const currentTerm = terms.find(t => t.isCurrent);

  const setCurrentTerm = (id: string) => {
    setTerms(prev => prev.map(t => ({ ...t, isCurrent: t.id === id })));
  };

  const addTerm = () => {
    if (!tName || !tStart || !tEnd) return;
    const newTerm: Term = {
      id: `term-${Date.now()}`,
      name: tName,
      startDate: tStart,
      endDate: tEnd,
      isCurrent: terms.length === 0,
    };
    setTerms(prev => [...prev, newTerm]);
    setTName(''); setTStart(''); setTEnd('');
    setShowModal(false);
  };

  const addClass = () => {
    if (!cName) return;
    const newClass: Class = {
      id: `cls-${Date.now()}`,
      name: cName,
      termId: cTermId,
      capacity: cCapacity,
      studentCount: 0,
    };
    setClasses(prev => [...prev, newClass]);
    setCName(''); setCCapacity(40);
    setShowModal(false);
  };

  const addSubject = () => {
    if (!sName || !sCode) return;
    const newSubject: Subject = {
      id: `sub-${Date.now()}`,
      name: sName,
      code: sCode,
    };
    setSubjects(prev => [...prev, newSubject]);
    setSName(''); setSCode(''); setSDesc('');
    setShowModal(false);
  };

  return (
    <div>
      <div className="page-header">
        <div><h2>Academic Setup</h2><p>Manage terms, classes and subjects</p></div>
        <button id="btn-add-new" className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={14}/> Add New
        </button>
      </div>

      {/* Current Term Banner */}
      {currentTerm && (
        <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(59,130,246,0.08))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: '#a855f722', borderRadius: 12, padding: 12 }}>
              <Calendar size={24} color="#a855f7"/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#a855f7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Current Active Term</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 2 }}>{currentTerm.name}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{currentTerm.startDate} → {currentTerm.endDate}</div>
            </div>
            <span className="badge badge-success">Active</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${tab === 'terms' ? 'active' : ''}`} id="tab-terms" onClick={() => setTab('terms')}><Calendar size={14}/> Terms ({terms.length})</button>
        <button className={`tab ${tab === 'classes' ? 'active' : ''}`} id="tab-classes" onClick={() => setTab('classes')}><Users size={14}/> Classes ({classes.length})</button>
        <button className={`tab ${tab === 'subjects' ? 'active' : ''}`} id="tab-subjects" onClick={() => setTab('subjects')}><BookOpen size={14}/> Subjects ({subjects.length})</button>
      </div>

      {/* Terms Table */}
      {tab === 'terms' && (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Term Name</th><th>Start Date</th><th>End Date</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {terms.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 700 }}>{t.name}</td>
                    <td className="td-muted">{t.startDate}</td>
                    <td className="td-muted">{t.endDate}</td>
                    <td>
                      <span className={`badge ${t.isCurrent ? 'badge-success' : 'badge-muted'}`}>
                        {t.isCurrent ? '✓ Current' : 'Past'}
                      </span>
                    </td>
                    <td>
                      {!t.isCurrent && (
                        <button className="btn btn-ghost btn-sm" id={`set-current-${t.id}`} onClick={() => setCurrentTerm(t.id)}>
                          <CheckCircle size={12}/> Set Current
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Classes Table */}
      {tab === 'classes' && (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Class Name</th><th>Students</th><th>Capacity</th><th>Occupancy</th></tr></thead>
              <tbody>
                {classes.map(c => {
                  const pct = Math.round((c.studentCount / c.capacity) * 100);
                  return (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 700 }}>{c.name}</td>
                      <td style={{ fontWeight: 600, color: '#3b82f6' }}>{c.studentCount}</td>
                      <td className="td-muted">{c.capacity}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="progress-bar-wrap" style={{ width: 100 }}>
                            <div className="progress-bar-fill" style={{ width: `${pct}%`, background: pct > 85 ? '#ef4444' : '#3b82f6' }}/>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: pct > 85 ? '#ef4444' : '#64748b' }}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subjects Table */}
      {tab === 'subjects' && (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Subject Name</th><th>Code</th><th>Description</th></tr></thead>
              <tbody>
                {subjects.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 700 }}>{s.name}</td>
                    <td><span className="badge badge-info">{s.code}</span></td>
                    <td className="td-muted">—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <h3>Add {tab === 'terms' ? 'Term' : tab === 'classes' ? 'Class' : 'Subject'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {tab === 'terms' && (
                <>
                  <div className="form-group"><label className="form-label">Term Name</label><input className="form-input" value={tName} onChange={e => setTName(e.target.value)} placeholder="e.g. Term 1 – 2025"/></div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Start Date</label><input type="date" className="form-input" value={tStart} onChange={e => setTStart(e.target.value)}/></div>
                    <div className="form-group"><label className="form-label">End Date</label><input type="date" className="form-input" value={tEnd} onChange={e => setTEnd(e.target.value)}/></div>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={addTerm}>Create Term</button>
                </>
              )}
              {tab === 'classes' && (
                <>
                  <div className="form-group"><label className="form-label">Class Name</label><input className="form-input" value={cName} onChange={e => setCName(e.target.value)} placeholder="e.g. Diploma Media Yr 1"/></div>
                  <div className="form-group"><label className="form-label">Capacity</label><input type="number" className="form-input" value={cCapacity} onChange={e => setCCapacity(Number(e.target.value))}/></div>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={addClass}>Create Class</button>
                </>
              )}
              {tab === 'subjects' && (
                <>
                  <div className="form-group"><label className="form-label">Subject Name</label><input className="form-input" value={sName} onChange={e => setSName(e.target.value)} placeholder="e.g. Digital Photography"/></div>
                  <div className="form-group"><label className="form-label">Subject Code</label><input className="form-input" value={sCode} onChange={e => setSCode(e.target.value)} placeholder="e.g. DPH102"/></div>
                  <div className="form-group"><label className="form-label">Description</label><input className="form-input" value={sDesc} onChange={e => setSDesc(e.target.value)} placeholder="Optional"/></div>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={addSubject}>Create Subject</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
