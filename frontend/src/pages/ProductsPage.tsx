import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Package, Search, Landmark, Edit3, Trash2, Plus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';

export default function ProductsPage() {
  const context = useAppContext();
  const { activeTab, products, handleAddProduct, handleUpdateProduct, handleDeleteProduct } = context;
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Software License',
    unitPrice: '',
    status: 'Active',
    description: ''
  });

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ name: '', sku: '', category: 'Software License', unitPrice: '', status: 'Active', description: '' });
    setShowModal(true);
  };

  const openEditModal = (p: any) => {
    setIsEditing(true);
    setCurrentId(p.id);
    setFormData({
      name: p.name,
      sku: p.sku,
      category: p.category,
      unitPrice: p.unitPrice,
      status: p.status,
      description: p.description || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await handleUpdateProduct(currentId, formData);
    } else {
      await handleAddProduct(formData);
    }
    setShowModal(false);
  };

  const handleDelete = async (id: any) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await handleDeleteProduct(id);
    }
  };

  return (
    <>
      {activeTab === 'products' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Header */}
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package className="w-5 h-5" style={{ color: 'var(--accent-indigo)' }} />
                Product Catalog & Price Book
              </h2>
              <p className="page-desc">Manage standard SaaS subscriptions, custom support add-ons, and pricing rules.</p>
            </div>
            <Button variant="primary" onClick={openAddModal} leftIcon={<Plus className="w-4 h-4" />}>
              Add Product
            </Button>
          </div>

          {/* Quick Metrics */}
          <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', flexShrink: 0 }}>
            <Card padding="16px" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Catalog Items</p>
                <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px' }}>{products.length} Products</h4>
              </div>
              <Package className="w-8 h-8 text-indigo-400 opacity-80" />
            </Card>
            <Card padding="16px" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Default Currency</p>
                <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px', color: 'var(--accent-emerald)' }}>INR (₹)</h4>
              </div>
              <Landmark className="w-8 h-8 text-emerald-400 opacity-80" />
            </Card>
          </div>

          {/* Catalog Table */}
          <Card padding="20px" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Standard Catalog Directory</h3>
              <div style={{ width: '240px' }}>
                <Input 
                  leftIcon={<Search className="w-3 h-3" />}
                  placeholder="Search products by SKU or Name..." 
                  style={{ fontSize: '12px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Table>
              <TableHead>
                <TableHeader>Product Name</TableHeader>
                <TableHeader>SKU Identifier</TableHeader>
                <TableHeader>Catalog Category</TableHeader>
                <TableHeader>Standard Unit Price</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader style={{ width: '80px', textAlign: 'center' }}>Actions</TableHeader>
              </TableHead>
              <TableBody>
                {products.filter((p: any) => 
                  p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.sku.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{p.name}</TableCell>
                    <TableCell style={{ fontFamily: 'monospace', fontSize: '11px' }}>{p.sku}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell style={{ fontWeight: '800' }}>
                      ₹{p.unitPrice ? parseFloat(p.unitPrice).toLocaleString('en-IN') : '0.00'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.status === 'Active' ? 'emerald' : 'amber'}>{p.status}</Badge>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <button onClick={() => openEditModal(p)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginRight: '12px' }}>
                        <Edit3 className="w-4 h-4 hover:text-indigo-500" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <Trash2 className="w-4 h-4 hover:text-red-500" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No products found. Add one to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          {/* Product Modal */}
          <Modal 
            isOpen={showModal} 
            onClose={() => setShowModal(false)} 
            title={isEditing ? 'Edit Product' : 'Add New Product'}
            maxWidth="500px"
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input 
                label="Product Name" 
                required 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="e.g. VGrow CRM Premium" 
              />
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <Input 
                    label="SKU" 
                    required 
                    value={formData.sku} 
                    onChange={e => setFormData({...formData, sku: e.target.value})} 
                    placeholder="e.g. VG-PRM-1" 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Input 
                    label="Unit Price (₹)" 
                    type="number" 
                    step="0.01" 
                    required 
                    value={formData.unitPrice} 
                    onChange={e => setFormData({...formData, unitPrice: e.target.value})} 
                    placeholder="499.00" 
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }} className="form-field">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option>Software License</option>
                    <option>Add-on Product</option>
                    <option>Professional Services</option>
                    <option>Hardware</option>
                  </select>
                </div>
                <div style={{ flex: 1 }} className="form-field">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">Description (Optional)</label>
                <textarea className="form-textarea" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} placeholder="Product description..."></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">{isEditing ? 'Update Product' : 'Save Product'}</Button>
              </div>
            </form>
          </Modal>

        </div>
      )}
    </>
  );
}
