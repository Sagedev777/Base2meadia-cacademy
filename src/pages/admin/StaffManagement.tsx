import { useState } from 'react';
import { STAFF_LIST } from '../../data/mockData';
import { UserCog, Mail, Phone, Plus, UserX, UserCheck, Edit2, X, Save } from 'lucide-react';

type StaffMember = typeof STAFF_LIST[number] & { isActive?: boolean };

export default function StaffManagement() {
  const [staff, setStaff] = useState<StaffMember[]>(STAFF_LIST.map(s => ({ ...s, isActive: true })));
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [deactivateReason, setDeactivateReason] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ firstName: '', lastName: '', email: '', phone: '', department: '' });
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const filtered = staff.filter(s => filterStatus === 'all' || (filterStatus === 'active' ? s.isActive : !s.isActive));

  const handleDeactivate = () => {
    if (!deactivateId) return;
    setStaff(prev => prev.map(s => s.id === deactivateId ? { ...s, isActive: false } : s));
    setDeactivateId(null); setDeactivateReason('');
  };
  const handleReactivate = (id: string) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, isActive: true } : s));
  };
  const handleAdd = () => {
    if (!newStaff.firstName || !newStaff.email) return;
    const id = `staff-${Date.now()}`;
    setStaff(prev => [...prev, {
      id, staffId: `B2MA-STAFF-${String(prev.length + 1).padStart(3,'0')}`,
      firstName: newStaff.firstName, lastName: newStaff.lastName,
      fullName: `${newStaff.firstName} ${newStaff.lastName}`,
      email: newStaff.email, phone: newStaff.phone,
      department: newStaff.department, subjects: [], classes: [],
      hireDate: new Date().toISOString().slice(0,10), isActive: true,
    }]);
    setShowAddModal(false); setNewStaff({ firstName: '', lastName: '', email: '', phone: '', department: '' });
  };

  return (
    <div>
      <div className="page-header">
        <div><h2>Staff Management</h2><p>All teaching and administrative staff</p></div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4, background: 'var(--bg-surface)', borderRadius: 8, padding: 4 }}>
            {(['all','active','inactive'] as const).map(f => (
              <button key={f} className={`tab ${filterStatus === f ? 'active' : ''}`} style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => setFilterStatus(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button id="btn-add-staff" className="btn btn-primary" onClick={() => setShowAddModal(true)}><Plus size={15}/> Add Staff</button>
        </div>
      </div>

      {/* Staff Grid Cards */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {filtered.map(sf => (
          <div className="card" key={sf.id} style={{ opacity: sf.isActive ? 1 : 0.6 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div className="avatar avatar-lg" style={{ background: sf.isActive ? '#3b82f618' : '#ef444418', color: sf.isActive ? '#3b82f6' : '#ef4444' }}>
                {sf.firstName[0]}{sf.lastName[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{sf.fullName}</div>
                  <span className={`badge ${sf.isActive ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: 10 }}>
                    {sf.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>{sf.department}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>ID: {sf.staffId}</div>
              </div>
            </div>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94a3b8' }}><Mail size={13}/> {sf.email}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94a3b8' }}><Phone size={13}/> {sf.phone}</div>
            </div>
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subjects</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {sf.subjects.map(s => <span key={s} className="badge badge-info">{s}</span>)}
              </div>
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              {sf.isActive
                ? <button id={`deactivate-${sf.id}`} className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => setDeactivateId(sf.id)}>
                    <UserX size={13}/> Deactivate
                  </button>
                : <button id={`reactivate-${sf.id}`} className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => handleReactivate(sf.id)}>
                    <UserCheck size={13}/> Reactivate
                  </button>
              }
            </div>
          </div>
        ))}
      </div>

      {/* Full Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="card-header" style={{ padding: '18px 24px' }}>
          <div><h3>Staff Directory</h3><p>Full list with contact details</p></div>
          <UserCog size={16} color="#94a3b8"/>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Staff Member</th><th>Staff ID</th><th>Department</th><th>Phone</th><th>Hired</th><th>Subjects</th><th>Status</th><th>Action</th>
            </tr></thead>
            <tbody>
              {filtered.map(sf => (
                <tr key={sf.id} style={{ opacity: sf.isActive ? 1 : 0.6 }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ background: '#3b82f618', color: '#3b82f6' }}>{sf.firstName[0]}{sf.lastName[0]}</div>
                      <div><div style={{ fontWeight: 600 }}>{sf.fullName}</div><div className="td-muted">{sf.email}</div></div>
                    </div>
                  </td>
                  <td><code style={{ fontSize: 12, background: '#1e2d45', padding: '2px 8px', borderRadius: 4 }}>{sf.staffId}</code></td>
                  <td className="td-muted">{sf.department}</td>
                  <td className="td-muted">{sf.phone}</td>
                  <td className="td-muted">{sf.hireDate}</td>
                  <td><div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{sf.subjects.map(s => <span key={s} className="badge badge-info" style={{ fontSize: 10 }}>{s}</span>)}</div></td>
                  <td><span className={`badge ${sf.isActive ? 'badge-success' : 'badge-danger'}`}>{sf.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    {sf.isActive
                      ? <button className="btn btn-danger btn-sm" id={`tbl-deactivate-${sf.id}`} onClick={() => setDeactivateId(sf.id)}><UserX size={12}/></button>
                      : <button className="btn btn-ghost btn-sm" id={`tbl-reactivate-${sf.id}`} onClick={() => handleReactivate(sf.id)}><UserCheck size={12}/></button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deactivate Modal */}
      {deactivateId && (
        <div className="modal-overlay" onClick={() => setDeactivateId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-header"><h3>Deactivate Staff</h3><button className="modal-close" onClick={() => setDeactivateId(null)}>✕</button></div>
            <div className="modal-body">
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#f87171' }}>
                ⚠ This will prevent {staff.find(s=>s.id===deactivateId)?.fullName} from logging in. Their records will be preserved.
              </div>
              <div className="form-group">
                <label className="form-label">Reason (optional)</label>
                <textarea className="form-input" style={{ resize: 'vertical', minHeight: 80 }} placeholder="e.g. Contract ended, on leave…" value={deactivateReason} onChange={e => setDeactivateReason(e.target.value)}/>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setDeactivateId(null)}>Cancel</button>
              <button id="btn-confirm-deactivate" className="btn btn-danger" onClick={handleDeactivate}><UserX size={14}/> Confirm Deactivate</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Add New Staff</h3><button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group"><label className="form-label">First Name</label><input className="form-input" value={newStaff.firstName} onChange={e => setNewStaff(p => ({...p, firstName: e.target.value}))}/></div>
                <div className="form-group"><label className="form-label">Last Name</label><input className="form-input" value={newStaff.lastName} onChange={e => setNewStaff(p => ({...p, lastName: e.target.value}))}/></div>
              </div>
              <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" value={newStaff.email} onChange={e => setNewStaff(p => ({...p, email: e.target.value}))}/></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={newStaff.phone} onChange={e => setNewStaff(p => ({...p, phone: e.target.value}))}/></div>
                <div className="form-group"><label className="form-label">Department</label><input className="form-input" value={newStaff.department} onChange={e => setNewStaff(p => ({...p, department: e.target.value}))}/></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button id="btn-save-staff" className="btn btn-primary" onClick={handleAdd}><Save size={14}/> Create Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
