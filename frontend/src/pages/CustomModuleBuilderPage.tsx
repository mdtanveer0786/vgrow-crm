import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Layers, Plus, Trash2, Save, X, Type, Calendar, Hash, List } from 'lucide-react';
import { Card, Button } from '../components/ui';

export default function CustomModuleBuilderPage() {
  const { customModules, setCustomModules, API_BASE, authFetch } = useAppContext();
  
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    singularName: '',
    pluralName: '',
    icon: 'Box'
  });
  
  const [fields, setFields] = useState([
    { name: 'title', label: 'Title', type: 'text', required: true }
  ]);

  const addField = () => {
    setFields([...fields, { name: '', label: '', type: 'text', required: false }]);
  };

  const updateField = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    // auto-generate internal name from label if name is empty
    if (key === 'label' && !newFields[index].name) {
      newFields[index].name = value.toLowerCase().replace(/[^a-z0-9]/g, '_');
    }
    setFields(newFields);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.singularName || !formData.pluralName || fields.length === 0) return;
    
    try {
      const res = await authFetch(`${API_BASE}/custom-modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, schema: fields })
      });
      const created = await res.json();
      setCustomModules(prev => [created, ...prev]);
      setShowModal(false);
      
      // Reset
      setFormData({ name: '', singularName: '', pluralName: '', icon: 'Box' });
      setFields([{ name: 'title', label: 'Title', type: 'text', required: true }]);
    } catch (err) {
      console.error('Failed to create custom module', err);
    }
  };

  const handleDeleteModule = async (id) => {
    if (!confirm('Are you sure you want to delete this module and ALL its records? This cannot be undone.')) return;
    try {
      await authFetch(`${API_BASE}/custom-modules/${id}`, { method: 'DELETE' });
      setCustomModules(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Failed to delete module', err);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers className="w-5 h-5" style={{ color: 'var(--accent-indigo)' }} />
            Custom Module Builder
          </h2>
          <p className="page-desc">Create completely custom data entities without writing SQL.</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>+ New Module</Button>
      </div>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {customModules.map(mod => (
          <Card key={mod.id} style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{mod.pluralName}</h3>
              <button onClick={() => handleDeleteModule(mod.id)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <Trash2 className="w-4 h-4 hover:text-red-500" />
              </button>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Internal ID: {mod.name}</p>
            <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>Schema Fields:</p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {mod.schema.map((f, idx) => (
                  <li key={idx} style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{f.label} {f.required && <span style={{ color: 'var(--accent-red)' }}>*</span>}</span>
                    <span className="badge badge-gray">{f.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
        {customModules.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            No custom modules built yet.
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-scale-in" style={{ maxWidth: '700px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3 className="modal-title">Create Custom Module</h3>
              <button className="icon-btn" onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateModule} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Basic Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="form-label">Internal Name (API Key)</label>
                    <input type="text" className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. vehicles" />
                  </div>
                  <div>
                    <label className="form-label">Icon</label>
                    <select className="form-select" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})}>
                      <option value="Box">Box</option>
                      <option value="Car">Car</option>
                      <option value="Home">Home</option>
                      <option value="Briefcase">Briefcase</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Singular Label</label>
                    <input type="text" className="form-input" required value={formData.singularName} onChange={e => setFormData({...formData, singularName: e.target.value})} placeholder="e.g. Vehicle" />
                  </div>
                  <div>
                    <label className="form-label">Plural Label</label>
                    <input type="text" className="form-input" required value={formData.pluralName} onChange={e => setFormData({...formData, pluralName: e.target.value})} placeholder="e.g. Vehicles" />
                  </div>
                </div>

                {/* Field Builder */}
                <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ fontWeight: 'bold' }}>Fields Schema</h4>
                    <button type="button" onClick={addField} className="btn-secondary" style={{ padding: '4px 12px', fontSize: '12px' }}>+ Add Field</button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {fields.map((field, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ flex: 1 }}>
                          <input type="text" className="form-input" placeholder="Field Label (e.g. Make)" required value={field.label} onChange={e => updateField(idx, 'label', e.target.value)} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <input type="text" className="form-input" placeholder="API Key (e.g. make)" required value={field.name} onChange={e => updateField(idx, 'name', e.target.value)} />
                        </div>
                        <div style={{ width: '120px' }}>
                          <select className="form-select" value={field.type} onChange={e => updateField(idx, 'type', e.target.value)}>
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="date">Date</option>
                            <option value="select">Dropdown</option>
                          </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px' }}>
                          <input type="checkbox" checked={field.required} onChange={e => updateField(idx, 'required', e.target.checked)} />
                          <span style={{ fontSize: '11px' }}>Req</span>
                        </div>
                        <button type="button" onClick={() => removeField(idx)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginTop: '10px' }}>
                          <Trash2 className="w-4 h-4 hover:text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <Button variant="primary" type="submit">Save Module</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
