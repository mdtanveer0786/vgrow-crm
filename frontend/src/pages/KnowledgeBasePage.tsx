import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Search, HelpCircle, FileText, ChevronRight, BookOpen, Star, Sparkles, MessageCircle, Trash2, X } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

export default function KnowledgeBasePage() {
  const { activeTab, articles, handleAddArticle, handleDeleteArticle } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showCreator, setShowCreator] = useState(false);
  const [newArticle, setNewArticle] = useState({ title: '', category: 'General', body: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.body) return;
    const created = await handleAddArticle(newArticle);
    if (created) {
      setSelectedArticle(created);
    }
    setNewArticle({ title: '', category: 'General', body: '' });
    setShowCreator(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this article?')) {
      await handleDeleteArticle(id);
      if (selectedArticle?.id === id) {
        setSelectedArticle(null);
      }
    }
  };

  const filteredArticles = articles.filter(art =>
    art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {activeTab === 'knowledge-base' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen className="w-5 h-5" style={{ color: 'var(--accent-indigo)' }} />
                Developer Guides & Knowledge Base
              </h2>
              <p className="page-desc">Search API specs, setup tutorials, and learn to optimize VGrow CRM for sales acceleration.</p>
            </div>
            <Button onClick={() => setShowCreator(true)} variant="primary">
              + New Article
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            
            {/* Sidebar list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Card padding="0 12px" style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                <Search className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  style={{ background: 'none', border: 'none', color: 'var(--text-primary)', width: '100%', padding: '10px 8px', outline: 'none', fontSize: '12px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Card>

              <Card padding="16px" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '8px' }}>Documentation Directory</h3>
                {filteredArticles.map(art => (
                  <div 
                    key={art.id} 
                    onClick={() => setSelectedArticle(art)}
                    style={{ 
                      padding: '12px 10px', 
                      background: selectedArticle?.id === art.id ? 'rgba(21, 107, 244, 0.08)' : 'none', 
                      borderRadius: '6px', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: selectedArticle?.id === art.id ? '1px solid var(--accent-indigo)' : '1px solid transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>{art.title}</h4>
                      <span style={{ fontSize: '9px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>{art.category}</span>
                    </div>
                    <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  </div>
                ))}
              </Card>
            </div>

            {/* Read pane */}
            <Card padding="24px" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {selectedArticle ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Badge variant="indigo">{selectedArticle.category}</Badge>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Standard System Doc
                      </span>
                      <button onClick={() => handleDelete(selectedArticle.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <Trash2 className="w-4 h-4 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>{selectedArticle.title}</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-wrap', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    {selectedArticle.body}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', textAlign: 'center', gap: '12px', minHeight: '320px', padding: '40px 0' }}>
                  <HelpCircle className="w-12 h-12" style={{ color: 'var(--border-color)' }} />
                  <p style={{ fontSize: '12px' }}>Select a guide article from the sidebar directory to view detailed setup steps.</p>
                </div>
              )}
            </Card>
          </div>

          {/* Create Article Modal */}
          <Modal
            isOpen={showCreator}
            onClose={() => setShowCreator(false)}
            title="Create Knowledge Base Article"
            footer={
              <>
                <Button type="button" variant="secondary" onClick={() => setShowCreator(false)}>Cancel</Button>
                <Button type="submit" variant="primary" form="create-article-form">Publish Article</Button>
              </>
            }
          >
            <form id="create-article-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-field">
                <label className="form-label">Article Title</label>
                <input type="text" className="form-input" required value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} placeholder="e.g. Sales Playbook Q3" />
              </div>
              <div className="form-field">
                <label className="form-label">Category</label>
                <select className="form-select" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value})}>
                  <option value="General">General</option>
                  <option value="Sales & Playbooks">Sales & Playbooks</option>
                  <option value="API & Integrations">API & Integrations</option>
                  <option value="Billing & Finance">Billing & Finance</option>
                  <option value="AI Automations">AI Automations</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Content Body</label>
                <textarea className="form-input" required value={newArticle.body} onChange={e => setNewArticle({...newArticle, body: e.target.value})} placeholder="Write your markdown or text here..." style={{ height: '150px', resize: 'vertical' }} />
              </div>
            </form>
          </Modal>

        </div>
      )}
    </>
  );
}
