import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListTodo, 
  Users, 
  Settings, 
  LogOut, 
  Search, 
  ShieldCheck,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './lib/supabase';

// Pages (defined below for simplicity in this artifact)
const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, users: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: total } = await supabase.from('listings').select('*', { count: 'exact', head: true });
      const { count: pending } = await supabase.from('listings').select('*', { count: 'exact', head: true }).eq('approval_status', 'pending');
      const { count: users } = await supabase.from('user_profiles').select('*', { count: 'exact', head: true });
      setStats({ total: total || 0, pending: pending || 0, users: users || 0 });
    };
    fetchStats();
  }, []);

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px' }}>Dashboard <span className="text-gradient">Overview</span></h1>
        <p style={{ color: 'var(--text-muted)' }}>System snapshot and key performance indicators.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        <motion.div whileHover={{ y: -5 }} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>TOTAL_LISTINGS</span>
            <LayoutDashboard size={16} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.total}</div>
          <div style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '8px' }}>+12% from last week</div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>PENDING_REVIEW</span>
            <Clock size={16} color="var(--accent)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.pending}</div>
          <div style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '8px' }}>Action required</div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>ACTIVE_USERS</span>
            <Users size={16} color="var(--secondary)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.users}</div>
          <div style={{ fontSize: '12px', color: 'var(--secondary)', marginTop: '8px' }}>Live community</div>
        </motion.div>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="mono" style={{ fontSize: '14px' }}>RECENT_ACTIVITY</h3>
          <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '11px' }}>VIEW ALL</button>
        </div>
        <div style={{ padding: '24px' }}>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Stream monitoring initialized...</p>
        </div>
      </div>
    </div>
  );
};

const EditListingModal = ({ listing, onClose, onSave }: { listing: any, onClose: () => void, onSave: (updated: any) => void }) => {
  const [formData, setFormData] = useState({ ...listing });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('listings').update(formData).eq('id', listing.id);
    if (!error) {
      onSave(formData);
      onClose();
    } else {
      alert('Error updating listing');
    }
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="modal-content" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '800px' }}
      >
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
          <div>
            <h2 className="mono" style={{ fontSize: '18px', color: 'var(--primary)' }}>EDIT_SYSTEM_ENTRY</h2>
            <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>UUID: {listing.id}</div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--border)', border: 'none', color: 'white', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label>PROJECT_NAME</label>
              <input className="form-input" value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>CATEGORY</label>
              <select className="form-input" value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})}>
                <option value="ambassador">Ambassador</option>
                <option value="discord">Discord</option>
                <option value="bounty">Bounty</option>
                <option value="developer">Developer</option>
                <option value="campaign">Campaign</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>ROLE_TITLE</label>
            <input className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label>REWARD_VALUE</label>
              <input className="form-input" value={formData.reward || ''} onChange={e => setFormData({...formData, reward: e.target.value})} placeholder="e.g. $500 USDC" />
            </div>
            <div className="form-group">
              <label>DEADLINE</label>
              <input className="form-input" value={formData.deadline || ''} onChange={e => setFormData({...formData, deadline: e.target.value})} placeholder="YYYY-MM-DD or OPEN" />
            </div>
          </div>

          <div className="form-group">
            <label>DESCRIPTION_LOG</label>
            <textarea className="form-input" style={{ minHeight: '120px' }} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label>APPLY_URL</label>
              <input className="form-input" value={formData.apply_url || ''} onChange={e => setFormData({...formData, apply_url: e.target.value})} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label>TWITTER_X_URL</label>
              <input className="form-input" value={formData.twitter_url || ''} onChange={e => setFormData({...formData, twitter_url: e.target.value})} placeholder="https://x.com/..." />
            </div>
          </div>

          <div className="form-group">
            <label>LOGO_CDN_URL</label>
            <input className="form-input" value={formData.logo || ''} onChange={e => setFormData({...formData, logo: e.target.value})} placeholder="https://..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', alignItems: 'center' }}>
            <div className="form-group">
              <label>URGENCY_LEVEL</label>
              <select className="form-input" value={formData.urgency || 'MEDIUM'} onChange={e => setFormData({...formData, urgency: e.target.value})}>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
              <input 
                type="checkbox" 
                id="featured"
                checked={formData.featured} 
                onChange={e => setFormData({...formData, featured: e.target.checked})}
                style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
              />
              <label htmlFor="featured" style={{ margin: 0, cursor: 'pointer' }}>FEATURE_OPPORTUNITY</label>
            </div>
            <div className="form-group">
              <label>APPROVAL_STATUS</label>
              <select className="form-input" value={formData.approval_status} onChange={e => setFormData({...formData, approval_status: e.target.value})}>
                <option value="pending">PENDING</option>
                <option value="approved">APPROVED</option>
                <option value="rejected">REJECTED</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label>SUBMITTED_BY (X_HANDLE)</label>
              <input className="form-input" value={formData.submitted_by || ''} onChange={e => setFormData({...formData, submitted_by: e.target.value})} placeholder="@username" />
            </div>
            <div className="form-group">
              <label>SUBMITTER_EMAIL</label>
              <input className="form-input" value={formData.submitter_email || ''} onChange={e => setFormData({...formData, submitter_email: e.target.value})} placeholder="email@example.com" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>ABORT_CHANGES</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '16px' }} disabled={saving}>
              {saving ? 'SYNCING_WITH_CORE...' : 'EXECUTE_UPDATE'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Listings = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingListing, setEditingListing] = useState<any>(null);

  useEffect(() => {
    const fetchListings = async () => {
      const { data } = await supabase.from('listings').select('*').order('created_at', { ascending: false });
      setListings(data || []);
      setLoading(false);
    };
    fetchListings();

    // REALTIME_SUBSCRIPTION: Listen for live updates
    const channel = supabase
      .channel('admin_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setListings(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setListings(prev => prev.map(l => l.id === payload.new.id ? payload.new : l));
        } else if (payload.eventType === 'DELETE') {
          setListings(prev => prev.filter(l => l.id === payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const notifyMatchingBuilders = async (id: string) => {
    const { data: project } = await supabase.from('listings').select('*').eq('id', id).single();
    if (!project) return;

    try {
      const [{ data: profiles }, { data: subscribers }] = await Promise.all([
        supabase.from('user_profiles').select('email, email_notifications, telegram_id, telegram_notifications'),
        supabase.from('telegram_subscribers').select('chat_id')
      ]);

      const profileTgIds = (profiles || []).filter(p => p.telegram_notifications && p.telegram_id).map(p => p.telegram_id);
      const globalTgIds = (subscribers || []).map(s => s.chat_id);
      
      // Include admin chat ID by default for testing/monitoring
      const adminChatId = '2127320399';
      const tgRecipients = Array.from(new Set([...profileTgIds, ...globalTgIds, adminChatId]));

      if (tgRecipients.length > 0) {
        const response = await fetch('https://creatorchain-web3-jobs.vercel.app/api/send-telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'new_opportunity',
            payload: {
              chat_ids: tgRecipients,
              project_name: project.project,
              category: project.section,
              budget: project.reward || 'TBA', // API expects 'budget'
              description: project.title
            }
          })
        });
        
        if (!response.ok) {
          console.error('Telegram API response error:', await response.text());
        }
      }
    } catch (err) {
      console.error('Telegram Broadcast Error:', err);
    }
  };

  const handleApprove = async (id: string) => {
    await supabase.from('listings').update({ approval_status: 'approved', reviewed_at: new Date().toISOString() }).eq('id', id);
    setListings(listings.map(l => l.id === id ? { ...l, approval_status: 'approved' } : l));
    notifyMatchingBuilders(id);
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Rejection reason:');
    if (reason === null) return;
    await supabase.from('listings').update({ approval_status: 'rejected', rejection_reason: reason, reviewed_at: new Date().toISOString() }).eq('id', id);
    setListings(listings.map(l => l.id === id ? { ...l, approval_status: 'rejected', rejection_reason: reason } : l));
  };

  const handleDelete = async (id: string) => {
    if (confirm('PERMANENT_DELETE: Are you sure you want to remove this listing?')) {
      const { error } = await supabase.from('listings').delete().eq('id', id);
      if (!error) {
        setListings(listings.filter(l => l.id !== id));
      } else {
        alert('Error deleting listing');
      }
    }
  };

  const handleSaveEdit = (updated: any) => {
    setListings(listings.map(l => l.id === updated.id ? updated : l));
    if (updated.approval_status === 'approved') {
      notifyMatchingBuilders(updated.id);
    }
  };

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '36px' }}>Manage <span className="text-gradient">Listings</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Review, approve, or reject submissions.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
            <input 
              type="text" 
              placeholder="Filter listings..." 
              style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px 10px 40px', color: 'white', width: '280px', outline: 'none' }}
            />
          </div>
        </div>
      </header>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
              <th className="mono" style={{ textAlign: 'left', padding: '16px 24px', fontSize: '11px', color: 'var(--text-muted)' }}>PROJECT / SUBMITTER</th>
              <th className="mono" style={{ textAlign: 'left', padding: '16px 24px', fontSize: '11px', color: 'var(--text-muted)' }}>CATEGORY</th>
              <th className="mono" style={{ textAlign: 'left', padding: '16px 24px', fontSize: '11px', color: 'var(--text-muted)' }}>REWARD</th>
              <th className="mono" style={{ textAlign: 'left', padding: '16px 24px', fontSize: '11px', color: 'var(--text-muted)' }}>STATUS</th>
              <th className="mono" style={{ textAlign: 'right', padding: '16px 24px', fontSize: '11px', color: 'var(--text-muted)' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {listings.map(l => (
              <tr key={l.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ fontWeight: '600' }}>{l.project}</div>
                  <div style={{ fontSize: '12px', color: 'var(--primary)', marginBottom: '4px' }}>{l.title}</div>
                  {l.submitted_by && (
                    <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={10} /> {l.submitted_by} {l.submitter_email ? `(${l.submitter_email})` : ''}
                    </div>
                  )}
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <span className="mono" style={{ fontSize: '12px' }}>{l.section.toUpperCase()}</span>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ color: 'var(--primary)', fontWeight: '600' }}>{l.reward || 'TBA'}</div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <span className={`status-badge status-${l.approval_status}`}>
                    {l.approval_status}
                  </span>
                </td>
                <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    {l.approval_status === 'pending' && (
                      <>
                        <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => handleApprove(l.id)}>APPROVE</button>
                        <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '11px', color: 'var(--accent)', borderColor: 'rgba(255,62,0,0.3)' }} onClick={() => handleReject(l.id)}>REJECT</button>
                      </>
                    )}
                    <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setEditingListing(l)}>EDIT</button>
                    <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '11px', color: 'var(--accent)', borderColor: 'rgba(255,62,0,0.2)' }} onClick={() => handleDelete(l.id)}>DELETE</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Initializing data stream...</div>}
      </div>

      <AnimatePresence>
        {editingListing && (
          <EditListingModal 
            listing={editingListing} 
            onClose={() => setEditingListing(null)} 
            onSave={handleSaveEdit} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};


// Main Layout Wrapper
const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('user_profiles').select('*').order('created_at', { ascending: false });
      setUsers(data || []);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px' }}>Community <span className="text-gradient">Registry</span></h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage builder profiles and community members.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {users.map(user => (
          <motion.div key={user.id} whileHover={{ scale: 1.02 }} className="card" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'var(--border)', overflow: 'hidden', border: '1px solid var(--primary)' }}>
              <img src={user.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.username}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700', fontSize: '18px' }}>{user.name || user.username}</div>
              <div className="mono" style={{ fontSize: '12px', color: 'var(--primary)' }}>@{user.username}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{user.experience_level || 'Builder'}</div>
            </div>
            <button className="btn btn-outline" style={{ padding: '8px' }}>
              <Settings size={14} />
            </button>
          </motion.div>
        ))}
      </div>
      {loading && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Synchronizing community database...</div>}
    </div>
  );
};

// Main Layout Wrapper
const Layout = ({ children, onLogout }: { children: React.ReactNode, onLogout: () => void }) => {
  const location = useLocation();
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      const { data } = await supabase.from('listings').select('approval_status');
      setListings(data || []);
    };
    fetchListings();

    const channel = supabase.channel('layout_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, () => {
      fetchListings();
    }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const pendingCount = listings.filter(l => l.approval_status === 'pending').length;
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div style={{ padding: '0 32px', marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)' }}>
            <ShieldCheck size={32} />
            <div>
              <div style={{ fontWeight: '900', fontSize: '18px', lineHeight: '1', color: 'white' }}>CREATOR<span style={{ color: 'var(--primary)' }}>OPS</span></div>
              <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>TERMINAL_v2.0</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> DASHBOARD
          </Link>
          <Link to="/listings" className={`nav-item ${isActive('/listings') ? 'active' : ''}`}>
            <ListTodo size={18} /> LISTINGS 
            {pendingCount > 0 && <span style={{ marginLeft: 'auto', background: 'var(--accent)', color: 'white', padding: '2px 6px', fontSize: '10px', border: '1px solid var(--black)' }}>{pendingCount}</span>}
          </Link>
          <Link to="/users" className={`nav-item ${isActive('/users') ? 'active' : ''}`}>
            <Users size={18} /> USERS
          </Link>
          <Link to="/settings" className={`nav-item ${isActive('/settings') ? 'active' : ''}`}>
            <Settings size={18} /> SETTINGS
          </Link>
        </nav>

        <div style={{ padding: '32px', borderTop: '4px solid var(--black)' }}>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={onLogout}>
            <LogOut size={16} /> TERMINATE_SESSION
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('admin_auth') === 'true';
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '6282') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      setError('');
    } else {
      setError('INVALID_ACCESS_KEY');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  if (!isAuthenticated) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card" 
          style={{ maxWidth: '400px', width: '100%', textAlign: 'center', border: '1px solid var(--border)' }}
        >
          <div style={{ marginBottom: '32px' }}>
            <ShieldCheck size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Terminal <span className="text-gradient">Access</span></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>ENTER_ADMIN_CREDENTIALS_TO_PROCEED</p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label className="mono" style={{ fontSize: '11px', color: 'var(--primary)', display: 'block', marginBottom: '8px' }}>ACCESS_KEY</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                style={{ 
                  width: '100%', 
                  background: 'rgba(255,255,255,0.03)', 
                  border: `1px solid ${error ? 'var(--accent)' : 'var(--border)'}`, 
                  padding: '14px', 
                  color: 'white', 
                  borderRadius: '8px',
                  fontSize: '18px',
                  letterSpacing: '4px',
                  textAlign: 'center',
                  outline: 'none',
                  fontFamily: 'var(--font-mono)'
                }}
                autoFocus
              />
              {error && <p className="mono" style={{ color: 'var(--accent)', fontSize: '10px', marginTop: '8px', textAlign: 'center' }}>{error}</p>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>
              DECRYPT & ENTER
            </button>
          </form>
          
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '10px' }} className="mono">AUTHORIZED_PERSONNEL_ONLY</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/settings" element={
            <div className="fade-in">
              <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '36px' }}>System <span className="text-gradient">Settings</span></h1>
                <p style={{ color: 'var(--text-muted)' }}>Configure terminal behavior and platform parameters.</p>
              </header>
              <div className="card">
                <p style={{ color: 'var(--text-muted)' }}>Configuration modules encrypted. Decryption key required.</p>
              </div>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

