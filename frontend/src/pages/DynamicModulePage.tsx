import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Sparkles, Plus, Search, Trash2, Edit3, X } from 'lucide-react';
import { Card, Button } from '../components/ui';

export default function DynamicModulePage() {
  const { moduleId } = useParams();
  const { customModules, API_BASE, authFetch } = useAppContext();
  const navigate = useNavigate();

  const [moduleDef, setModuleDef] = useState(null);
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (customModules.length > 0) {
      const mod = customModules.find(m => m.id === moduleId);
      if (mod) {
        setModuleDef(mod);
        fetchRecords(mod.id);
      } else {
        navigate('/dashboard');
      }
    }
  }, [moduleId, customModules, navigate]);

  const fetchRecords = async (id) => {
    try {
      const res = await authFetch(`${API_BASE}/custom-modules/${id}/records`);
      setRecords(await res.json());
    } catch (err) {
      console.error('Failed to fetch custom records', err);
    }
  };

  const openAddModal = () => {
    if (!moduleDef) return;
    setIsEditing(false);
    setCurrentRecordId(null);
    
    const initialData = {};
    moduleDef.schema.forEach(f => {
      initialData[f.name] = f.type === 'number' ? 0 : '';
    });
    setFormData(initialData);
    setShowModal(true);
  };

  const openEditModal = (record) => {
    setIsEditing(true);
    setCurrentRecordId(record.id);
    setFormData(record.data || {});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await authFetch(`${API_BASE}/custom-modules/${moduleId}/records/${currentRecordId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: formData })
        });
        const updated = await res.json();
        setRecords(records.map(r => r.id === currentRecordId ? updated : r));
      } else {
        const res = await authFetch(`${API_BASE}/custom-modules/${moduleId}/records`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: formData })
        });
        const created = await res.json();
        setRecords([created, ...records]);
      }
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save record', err);
    }
  };

  const handleDelete = async (recordId) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await authFetch(`${API_BASE}/custom-modules/${moduleId}/records/${recordId}`, { method: 'DELETE' });
      setRecords(records.filter(r => r.id !== recordId));
    } catch (err) {
      console.error('Failed to delete record', err);
    }
  };

  if (!moduleDef) return <div>Loading Module...</div>;

  // determine title field for search
  const titleField = moduleDef.schema[0]?.name || 'id';

  const filteredRecords = records.filter(r => {
    const titleVal = String(r.data[titleField] || '');
    return titleVal.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-indigo)' }} />
            {moduleDef.pluralName}
          </h2>
          <p className="page-desc">Manage your custom {moduleDef.pluralName.toLowerCase()} records.</p>
        </div>
        <Button variant="primary" onClick={openAddModal}>+ New {moduleDef.singularName}</Button>
      </div>

      <Card style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative', width: '240px' }}>
            <Search style={{ position: 'absolute', left: '8px', top: '8px', width: '12px', height: '12px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder={`Search ${moduleDef.pluralName}...`}
              style={{ paddingLeft: '26px', fontSize: '12px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', minWidth: '800px' }}>
            <thead>
              <tr>
                {moduleDef.schema.slice(0, 5).map(f => (
                  <th key={f.name}>{f.label}</th>
                ))}
                <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(r => (
                <tr key={r.id}>
                  {moduleDef.schema.slice(0, 5).map((f, idx) => (
                    <td key={f.name} style={idx === 0 ? { fontWeight: '700', color: 'var(--text-primary)' } : {}}>
                      {r.data[f.name] !== undefined ? String(r.data[f.name]) : '-'}
                    </td>
                  ))}
                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => openEditModal(r)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginRight: '8px' }}>
                      <Edit3 className="w-4 h-4 hover:text-indigo-500" />
                    </button>
                    <button onClick={() => handleDelete(r.id)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <Trash2 className="w-4 h-4 hover:text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={moduleDef.schema.slice(0,5).length + 1} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    No {moduleDef.pluralName.toLowerCase()} found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-scale-in" style={{ maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3 className="modal-title">{isEditing ? `Edit ${moduleDef.singularName}` : `New ${moduleDef.singularName}`}</h3>
              <button className="icon-btn" onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {moduleDef.schema.map(f => (
                  <div key={f.name}>
                    <label className="form-label">{f.label} {f.required && '*'}</label>
                    {f.type === 'text' && (
                      <input type="text" className="form-input" required={f.required} value={formData[f.name] || ''} onChange={e => setFormData({...formData, [f.name]: e.target.value})} />
                    )}
                    {f.type === 'number' && (
                      <input type="number" step="any" className="form-input" required={f.required} value={formData[f.name] || ''} onChange={e => setFormData({...formData, [f.name]: parseFloat(e.target.value) || 0})} />
                    )}
                    {f.type === 'date' && (
                      <input type="date" className="form-input" required={f.required} value={formData[f.name] || ''} onChange={e => setFormData({...formData, [f.name]: e.target.value})} />
                    )}
                    {f.type === 'select' && (
                      <input type="text" className="form-input" placeholder="Type value..." required={f.required} value={formData[f.name] || ''} onChange={e => setFormData({...formData, [f.name]: e.target.value})} />
                    )}
                  </div>
                ))}

                <div className="modal-footer" style={{ marginTop: '8px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <Button variant="primary" type="submit">Save {moduleDef.singularName}</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
