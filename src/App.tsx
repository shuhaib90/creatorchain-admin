import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListTodo, 
  Users, 
  Settings, 
  ShieldCheck,
  Clock,
  Radio,
  Search,
  LogOut
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
              description: project.title,
              id: project.id // Add ID for deep-linking
            }
          })
        });
        
        if (!response.ok) {
          throw new Error(await response.text());
        }
        
        const data = await response.json();
        console.log('Telegram Broadcast Result:', data);
        alert(`🚀 Broadcast sent! (Recipients: ${tgRecipients.length})`);
      } else {
        console.log('No Telegram recipients found.');
      }
    } catch (err: any) {
      console.error('Telegram Broadcast Error:', err);
      alert('Telegram Broadcast Failed: ' + err.message);
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
  const [updating, setUpdating] = useState<string | null>(null);

  const notifyUserBadge = async (user: any, type: 'verification' | 'badge', status: any) => {
    if (!user.telegram_id) {
      console.log('No telegram_id found for user:', user.username);
      return;
    }

    let message = '';
    if (type === 'verification') {
      if (status) {
        message = `🎊 <b>HAPPY NEWS!</b>\n\nHey @${user.username}, your builder profile has been <b>VERIFIED</b> by the CreatorChain Team! ✅\n\nYour trust badge is now live. High-performance projects can now see your verified status!`;
      } else {
        return; // Don't notify on removal unless needed
      }
    } else {
      if (status) {
        const level = status.toUpperCase();
        message = `🎊 <b>BIG NEWS!</b>\n\nCongratulations @${user.username}! Admin has officially granted you the <b>${level} BADGE</b>! 🏆\n\nYour reputation within the ecosystem has increased. Stand tall, builder!`;
      } else {
        return;
      }
    }

    try {
      await fetch('https://creatorchain-web3-jobs.vercel.app/api/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'custom',
          payload: {
            chat_ids: [user.telegram_id],
            message: message
          }
        })
      });
      console.log('Notification sent to:', user.username);
    } catch (err) {
      console.error('Telegram notification failed:', err);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase.from('user_profiles').select('*').order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleVerification = async (userId: string, currentStatus: boolean) => {
    setUpdating(userId);
    const { error } = await supabase
      .from('user_profiles')
      .update({ is_verified: !currentStatus })
      .eq('user_id', userId);
    
    if (!error) {
      const updatedStatus = !currentStatus;
      setUsers(users.map(u => u.user_id === userId ? { ...u, is_verified: updatedStatus } : u));
      
      // Notify User
      const user = users.find(u => u.user_id === userId);
      if (user) notifyUserBadge(user, 'verification', updatedStatus);
    } else {
      console.error('VERIFICATION_UPDATE_ERROR:', error);
      alert(`FAILED_TO_UPDATE_VERIFICATION: ${error.message} (${error.code})`);
    }
    setUpdating(null);
  };

  const updateBadgeLevel = async (userId: string, level: string) => {
    setUpdating(userId);
    const { error } = await supabase
      .from('user_profiles')
      .update({ badge_level: level })
      .eq('user_id', userId);
    
    if (!error) {
      setUsers(users.map(u => u.user_id === userId ? { ...u, badge_level: level } : u));
      
      // Notify User
      const user = users.find(u => u.user_id === userId);
      if (user) notifyUserBadge(user, 'badge', level);
    } else {
      console.error('BADGE_UPDATE_ERROR:', error);
      alert(`FAILED_TO_UPDATE_BADGE: ${error.message} (${error.code})`);
    }
    setUpdating(null);
  };

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px' }}>Community <span className="text-gradient">Registry</span></h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage builder profiles and grant administrative badges.</p>
      </header>

      {loading ? (
        <div className="card mono" style={{ textAlign: 'center', padding: '60px' }}>SCANNING_USER_DATABASE...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {users.map(user => (
            <motion.div key={user.user_id} className="card" style={{ border: user.is_verified ? '1px solid var(--primary)' : '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'var(--border)', overflow: 'hidden', border: user.badge_level === 'pro' ? '2px solid var(--secondary)' : '1px solid var(--border)', flexShrink: 0 }}>
                  <img src={user.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.username}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {user.name || user.username}
                    {user.is_verified && <ShieldCheck size={16} color="var(--primary)" />}
                    {user.badge_level === 'pro' && <span style={{ fontSize: '10px', background: 'var(--secondary)', color: 'black', padding: '2px 4px', borderRadius: '4px', fontWeight: '900' }}>PRO</span>}
                  </div>
                  <div className="mono" style={{ fontSize: '12px', color: 'var(--primary)' }}>@{user.username}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{user.email}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>LVL: {user.experience_level || 'Builder'} • SCORE: {user.score || 0}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <button 
                  className={`btn ${user.is_verified ? 'btn-primary' : 'btn-outline'}`} 
                  style={{ flex: 1, fontSize: '10px', padding: '8px' }}
                  onClick={() => toggleVerification(user.user_id, user.is_verified)}
                  disabled={updating === user.user_id}
                >
                  {user.is_verified ? 'VERIFIED' : 'GRANT_VERIFIED'}
                </button>
                <select 
                  className="btn btn-outline" 
                  style={{ flex: 1, fontSize: '10px', padding: '8px', textAlign: 'center' }}
                  value={user.badge_level || ''}
                  onChange={(e) => updateBadgeLevel(user.user_id, e.target.value)}
                  disabled={updating === user.user_id}
                >
                  <option value="">NO_BADGE</option>
                  <option value="pro">PRO_BADGE</option>
                  <option value="vip">VIP_BADGE</option>
                </select>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const EditOpportunityModal = ({ opportunity, onClose, onSave }: { opportunity: any, onClose: () => void, onSave: (updated: any) => void }) => {
  const [formData, setFormData] = useState({ ...opportunity });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('opportunities').update(formData).eq('id', opportunity.id);
    if (!error) {
      onSave(formData);
      onClose();
    } else {
      alert('Error updating opportunity');
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
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="mono" style={{ fontSize: '18px', color: 'var(--primary)' }}>EDIT_OPPORTUNITY</h2>
            <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ID: {opportunity.id}</div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--border)', border: 'none', color: 'white', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%' }}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label>PROJECT_NAME</label>
              <input className="form-input" value={formData.project_name} onChange={e => setFormData({...formData, project_name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>TYPE</label>
              <select className="form-input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="ambassador">Ambassador</option>
                <option value="discord">Discord</option>
                <option value="bounty">Bounty</option>
                <option value="developer">Developer</option>
                <option value="campaign">Campaign</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>TITLE</label>
            <input className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>

          <div className="form-group">
            <label>DESCRIPTION (REWARD SUMMARY)</label>
            <input className="form-input" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="form-group">
            <label>MISSION</label>
            <textarea className="form-input" rows={2} value={formData.mission || ''} onChange={e => setFormData({...formData, mission: e.target.value})} style={{ resize: 'vertical' }} />
          </div>

          <div className="form-group">
            <label>ABOUT_PROJECT</label>
            <textarea className="form-input" rows={3} value={formData.about_project || ''} onChange={e => setFormData({...formData, about_project: e.target.value})} style={{ resize: 'vertical' }} />
          </div>

          <div className="form-group">
            <label>SCOPE_&_REQUIREMENTS (BULLET POINTS)</label>
            <textarea className="form-input" rows={4} value={formData.scope_requirements || ''} onChange={e => setFormData({...formData, scope_requirements: e.target.value})} style={{ resize: 'vertical' }} />
          </div>

          <div className="form-group">
            <label>PRIZE_BREAKDOWN</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '9px' }}>1ST_PLACE</label>
                <input className="form-input" value={formData.prize_breakdown?.first || ''} onChange={e => setFormData({...formData, prize_breakdown: {...formData.prize_breakdown, first: e.target.value}})} />
              </div>
              <div>
                <label style={{ fontSize: '9px' }}>2ND_PLACE</label>
                <input className="form-input" value={formData.prize_breakdown?.second || ''} onChange={e => setFormData({...formData, prize_breakdown: {...formData.prize_breakdown, second: e.target.value}})} />
              </div>
              <div>
                <label style={{ fontSize: '9px' }}>3RD_PLACE</label>
                <input className="form-input" value={formData.prize_breakdown?.third || ''} onChange={e => setFormData({...formData, prize_breakdown: {...formData.prize_breakdown, third: e.target.value}})} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label>LOGO_URL</label>
              <input className="form-input" value={formData.logo || ''} onChange={e => setFormData({...formData, logo: e.target.value})} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label>BANNER_URL (SHARE_IMAGE)</label>
              <input className="form-input" value={formData.share_image || ''} onChange={e => setFormData({...formData, share_image: e.target.value})} placeholder="https://..." />
            </div>
          </div>

          <div className="form-group">
            <label>TEAM_CONTACT</label>
            <input className="form-input" value={formData.team_contact || ''} onChange={e => setFormData({...formData, team_contact: e.target.value})} placeholder="@username or email" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label>TWITTER_URL</label>
              <input className="form-input" value={formData.twitter_url || ''} onChange={e => setFormData({...formData, twitter_url: e.target.value})} placeholder="https://x.com/..." />
            </div>
            <div className="form-group">
              <label>POST_LINK (OPTIONAL)</label>
              <input className="form-input" value={formData.post_link || ''} onChange={e => setFormData({...formData, post_link: e.target.value})} placeholder="https://x.com/.../status/..." />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>ABORT</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={saving}>
              {saving ? 'UPDATING...' : 'SAVE_CHANGES'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ApplicantsModal = ({ opportunity, applicants, onClose }: { opportunity: any, applicants: any[], onClose: () => void }) => {
  const downloadCSV = () => {
    if (applicants.length === 0) return;
    
    const headers = ['Submit Link', 'Wallet Address', 'Telegram Username'];
    const rows = applicants.map(app => {
      let telegram = 'N/A';
      try {
        const msgObj = JSON.parse(app.message);
        telegram = msgObj.telegram || 'N/A';
      } catch (e) {
        // Fallback if message is not JSON
        telegram = app.message.substring(0, 50);
      }

      return [
        app.portfolio_links || 'N/A',
        app.user_id,
        telegram
      ];
    });

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `applicants_${opportunity.project_name.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="modal-content" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '900px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
          <div>
            <h2 className="mono" style={{ fontSize: '18px', color: 'var(--primary)' }}>APPLICANTS_FOR: {opportunity.project_name}</h2>
            <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{opportunity.title} • {applicants.length} SUBMISSIONS</div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {applicants.length > 0 && (
              <button 
                onClick={downloadCSV}
                className="btn btn-primary" 
                style={{ padding: '6px 16px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                DOWNLOAD_DATA (.CSV)
              </button>
            )}
            <button onClick={onClose} style={{ background: 'var(--border)', border: 'none', color: 'white', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
        </div>
        
        <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
          {applicants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }} className="mono">NO_APPLICANTS_YET_FOR_THIS_OPPORTUNITY</div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {applicants.map(app => (
                <div key={app.id} className="card" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                    <div className="mono" style={{ fontSize: '11px', color: 'var(--primary)' }}>ID: {app.id.substring(0,8)}...</div>
                    <div className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(app.created_at).toLocaleString()}</div>
                  </div>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px' }}>PITCH_MESSAGE</div>
                    <p style={{ fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{app.message}</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', background: 'rgba(0,0,0,0.2)', padding: '15px', border: '1px solid var(--border)' }}>
                    <div>
                      <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>WALLET_ADDRESS</div>
                      <div className="mono" style={{ fontSize: '11px', wordBreak: 'break-all' }}>{app.user_id}</div>
                    </div>
                    <div>
                      <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PORTFOLIO_LINKS</div>
                      <div style={{ fontSize: '11px', color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => window.open(app.portfolio_links, '_blank')}>
                        {app.portfolio_links || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                    <a href={`mailto:?subject=Regarding your application for ${opportunity.title}`} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '11px' }}>EMAIL_APPLICANT</a>
                    <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', fontSize: '11px' }}>CONTACT_VIA_X</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const Opportunities = () => {
  const [opps, setOpps] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<any | null>(null);
  const [editingOpp, setEditingOpp] = useState<any | null>(null);

  const fetchData = async () => {
    const [{ data: oData }, { data: aData }] = await Promise.all([
      supabase.from('opportunities').select('*').order('created_at', { ascending: false }),
      supabase.from('applications').select('*, opportunities(project_name, title)').order('created_at', { ascending: false })
    ]);
    setOpps(oData || []);
    setApps(aData || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const broadcastExclusive = async (id: string) => {
    const { data: item } = await supabase.from('opportunities').select('*').eq('id', id).single();
    if (!item) return;

    try {
      const [{ data: profiles }, { data: subscribers }] = await Promise.all([
        supabase.from('user_profiles').select('telegram_id, telegram_notifications'),
        supabase.from('telegram_subscribers').select('chat_id')
      ]);

      const profileTgIds = (profiles || []).filter(p => p.telegram_notifications && p.telegram_id).map(p => p.telegram_id);
      const globalTgIds = (subscribers || []).map(s => s.chat_id);
      
      // Include admin chat ID by default
      const adminChatId = '2127320399';
      const tgRecipients = Array.from(new Set([...profileTgIds, ...globalTgIds, adminChatId]));

      if (tgRecipients.length === 0) {
        alert('No Telegram subscribers found.');
        return;
      }

      await fetch('https://creatorchain-web3-jobs.vercel.app/api/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'exclusive_opportunity',
          payload: {
            chat_ids: tgRecipients,
            id: item.id,
            project_name: item.project_name,
            category: item.type,
            reward: item.reward || 'TBA',
            description: item.title
          }
        })
      });

      alert(`🚀 Exclusive Broadcast sent to ${tgRecipients.length} users!`);
    } catch (err: any) {
      console.error('Exclusive Broadcast Error:', err);
      alert('Broadcast failed: ' + err.message);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('opportunities').update({ status }).eq('id', id);
    if (!error) {
      setOpps(opps.map(o => o.id === id ? { ...o, status } : o));
      if (status === 'live') {
        broadcastExclusive(id);
      }
    } else {
      alert('Status update failed');
    }
  };

  const handleDeleteOpportunity = async (id: string) => {
    if (confirm('⚠️ NUCLEAR_DELETE: This will erase the project AND all associated submissions. This cannot be undone. Proceed?')) {
      // 1. Delete associated applications
      const { error: appError } = await supabase.from('applications').delete().eq('opportunity_id', id);
      if (appError) {
        alert('Failed to delete associated applications: ' + appError.message);
        return;
      }

      // 2. Delete the opportunity itself
      const { error: oppError } = await supabase.from('opportunities').delete().eq('id', id);
      if (!oppError) {
        setOpps(opps.filter(o => o.id !== id));
        setApps(apps.filter(a => a.opportunity_id !== id));
        alert('Project and all submissions erased successfully.');
      } else {
        alert('Failed to delete opportunity: ' + oppError.message);
      }
    }
  };

  const pendingCount = opps.filter(o => o.status === 'pending').length;

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '36px' }}>Opportunity <span className="text-gradient">Manager</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Review project submissions and applicant data.</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '40px' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
          <div className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>PENDING_REQUESTS</div>
          <div style={{ fontSize: '28px', fontWeight: '800' }}>{pendingCount}</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>LIVE_OPPORTUNITIES</div>
          <div style={{ fontSize: '28px', fontWeight: '800' }}>{opps.filter(o => o.status === 'live').length}</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <div className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>TOTAL_APPLICANTS</div>
          <div style={{ fontSize: '28px', fontWeight: '800' }}>{apps.length}</div>
        </div>
      </div>

      <div className="card" style={{ padding: '0', marginBottom: '48px' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
          <h3 className="mono" style={{ fontSize: '12px' }}>SUBMISSION_QUEUE</h3>
        </div>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th className="mono">PROJECT</th>
              <th className="mono">TITLE</th>
              <th className="mono">TYPE</th>
              <th className="mono">APPLICANTS</th>
              <th className="mono">STATUS</th>
              <th className="mono" style={{ textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {opps.map(opp => (
              <tr key={opp.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {opp.logo ? (
                    <img src={opp.logo} style={{ width: '32px', height: '32px', objectFit: 'contain', border: '1px solid var(--border)', padding: '2px', background: 'white' }} />
                  ) : (
                    <div className="mono" style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifySelf: 'center', fontSize: '10px', justifyContent: 'center' }}>N/A</div>
                  )}
                  <span>{opp.project_name}</span>
                </td>
                <td><div style={{ fontWeight: '700' }}>{opp.title}</div><div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{opp.team_contact}</div></td>
                <td><span className="mono" style={{ fontSize: '10px' }}>{opp.type.toUpperCase()}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="mono" style={{ fontSize: '12px', fontWeight: '700' }}>
                      {apps.filter(a => a.opportunity_id === opp.id).length}
                    </span>
                    <button 
                       className="btn btn-outline" 
                       style={{ padding: '4px 8px', fontSize: '9px' }}
                       onClick={() => setSelectedOpp(opp)}
                     >
                       VIEW
                     </button>
                  </div>
                </td>
                <td><span className={`status-badge status-${opp.status}`}>{opp.status}</span></td>
                <td style={{ textAlign: 'right' }}>
                  {opp.status === 'pending' && (
                    <>
                      <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '10px' }} onClick={() => updateStatus(opp.id, 'live')}>APPROVE</button>
                      <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '10px', marginLeft: '8px' }} onClick={() => updateStatus(opp.id, 'rejected')}>REJECT</button>
                    </>
                  )}
                  {opp.status === 'live' && (
                    <>
                      <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '10px' }} onClick={() => updateStatus(opp.id, 'closed')}>CLOSE</button>
                      <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '10px', marginLeft: '8px' }} onClick={() => updateStatus(opp.id, 'pending')}>PAUSE</button>
                    </>
                  )}
                  {opp.status === 'closed' && (
                    <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '10px' }} onClick={() => updateStatus(opp.id, 'live')}>RE-OPEN</button>
                  )}
                  <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '10px', marginLeft: '8px' }} onClick={() => broadcastExclusive(opp.id)} title="Broadcast update"><Radio size={12} /></button>
                  <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '10px', marginLeft: '8px' }} onClick={() => setEditingOpp(opp)}>EDIT</button>
                  <button 
                    className="btn btn-outline" 
                    style={{ padding: '6px 12px', fontSize: '10px', marginLeft: '8px', color: 'var(--accent)', borderColor: 'rgba(255,62,0,0.3)' }} 
                    onClick={() => handleDeleteOpportunity(opp.id)}
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <header style={{ marginBottom: '24px' }}>
        <h2 className="mono" style={{ fontSize: '18px' }}>APPLICANT_DATABASE</h2>
      </header>

      <div style={{ display: 'grid', gap: '20px' }}>
        {apps.map(app => (
          <motion.div key={app.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <div>
                <div className="mono" style={{ fontSize: '10px', color: 'var(--primary)' }}>APPLYING_FOR</div>
                <div style={{ fontWeight: '800', fontSize: '18px' }}>{app.opportunities.project_name} // {app.opportunities.title}</div>
              </div>
              <div className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(app.created_at).toLocaleDateString()}</div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px' }}>PITCH_MESSAGE</div>
              <p style={{ fontSize: '14px', lineHeight: '1.5' }}>{app.message}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', background: 'rgba(0,0,0,0.2)', padding: '20px', border: '1px solid var(--border)' }}>
              <div>
                <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>WALLET_ADDRESS</div>
                <div className="mono" style={{ fontSize: '12px', wordBreak: 'break-all' }}>{app.user_id}</div>
              </div>
              <div>
                <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PORTFOLIO_LINKS</div>
                <div style={{ fontSize: '12px' }}>{app.portfolio_links || 'N/A'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <a href={`mailto:?subject=CreatorChain Opportunity: ${app.opportunities.title}`} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>EMAIL_APPLICANT</a>
              <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>CONTACT_VIA_X</button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedOpp && (
          <ApplicantsModal 
            opportunity={selectedOpp}
            applicants={apps.filter(a => a.opportunity_id === selectedOpp.id)}
            onClose={() => setSelectedOpp(null)}
          />
        )}
        {editingOpp && (
          <EditOpportunityModal 
            opportunity={editingOpp}
            onClose={() => setEditingOpp(null)}
            onSave={(updated) => setOpps(opps.map(o => o.id === updated.id ? updated : o))}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const Broadcast = () => {
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('FILE_TOO_LARGE: Please upload an image under 5MB.');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `public/bc_${fileName}`; // Simplified path

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('logos').getPublicUrl(filePath);
      console.log('UPLOAD_SUCCESS: Image public URL ->', data.publicUrl);
      setImageUrl(data.publicUrl);
    } catch (err: any) {
      alert('Upload Failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (!confirm('GLOBAL_BROADCAST: Are you sure you want to send this to ALL bot subscribers?')) return;

    setSending(true);
    try {
      const [{ data: profiles }, { data: subscribers }] = await Promise.all([
        supabase.from('user_profiles').select('telegram_id, telegram_notifications'),
        supabase.from('telegram_subscribers').select('chat_id')
      ]);

      const profileTgIds = (profiles || []).filter(p => p.telegram_notifications && p.telegram_id).map(p => p.telegram_id);
      const globalTgIds = (subscribers || []).map(s => s.chat_id);
      const tgRecipients = Array.from(new Set([...profileTgIds, ...globalTgIds]));

      if (tgRecipients.length > 0) {
        const response = await fetch('https://creatorchain-web3-jobs.vercel.app/api/send-telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'custom',
            payload: {
              chat_ids: tgRecipients,
              message: message,
              image_url: imageUrl.trim() || null
            }
          })
        });

        if (!response.ok) throw new Error(await response.text());
        alert(`🚀 Broadcast sent to ${tgRecipients.length} users!`);
        setMessage('');
        setImageUrl('');
      } else {
        alert('No subscribers found.');
      }
    } catch (err: any) {
      alert('Broadcast Failed: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px' }}>Global <span className="text-gradient">Broadcast</span></h1>
        <p style={{ color: 'var(--text-muted)' }}>Send a priority message or image to all Telegram bot subscribers.</p>
      </header>

      <div className="card" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleBroadcast}>
          <div className="form-group">
            <label>BROADCAST_MEDIA</label>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
              <input 
                type="url" 
                className="form-input" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste Image URL or Upload below..."
                style={{ flex: 1 }}
              />
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => document.getElementById('broadcast-image-upload')?.click()}
                disabled={uploading}
              >
                {uploading ? 'UPLOADING...' : '📁 UPLOAD_IMAGE'}
              </button>
              <input 
                id="broadcast-image-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                style={{ display: 'none' }} 
              />
            </div>
            {imageUrl && (
              <div style={{ padding: '10px', background: 'var(--black)', border: '1px solid var(--primary)', marginBottom: '20px' }}>
                <img src={imageUrl} alt="Preview" style={{ maxHeight: '150px', display: 'block', margin: '0 auto' }} />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>MESSAGE_CONTENT (HTML Supported)</label>
            <textarea 
              className="form-input" 
              rows={8} 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="📢 Enter your update or announcement here..."
              style={{ width: '100%', resize: 'vertical' }}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button type="submit" className="btn btn-primary" disabled={sending} style={{ flex: 1, padding: '20px', fontSize: '16px' }}>
              {sending ? 'COMMUNICATING...' : '🚀 DISPATCH BROADCAST'}
            </button>
            <div className="mono" style={{ fontSize: '11px', color: 'var(--accent)', maxWidth: '200px' }}>
              ⚠️ WARNING: This will immediately notify all subscribers.
            </div>
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: '30px', maxWidth: '800px', background: 'rgba(0,245,160,0.02)' }}>
        <h4 className="mono" style={{ fontSize: '12px', color: 'var(--primary)', marginBottom: '15px' }}>TIPS_FOR_BROADCASTS</h4>
        <ul className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '20px' }}>
          <li>Use HTML tags like &lt;b&gt;bold&lt;/b&gt; or &lt;i&gt;italic&lt;/i&gt;.</li>
          <li>Include links using &lt;a href="..."&gt;text&lt;/a&gt;.</li>
          <li>Keep messages concise to ensure readability on mobile.</li>
        </ul>
      </div>
    </div>
  );
};

// Main Layout Wrapper
const Layout = ({ children, onLogout }: { children: React.ReactNode, onLogout: () => void }) => {
  const location = useLocation();
  const [listings, setListings] = useState<any[]>([]);
  const [opps, setOpps] = useState<any[]>([]);

  const fetchData = async () => {
    const [{ data: lData }, { data: oData }] = await Promise.all([
      supabase.from('listings').select('approval_status'),
      supabase.from('opportunities').select('status')
    ]);
    setListings(lData || []);
    setOpps(oData || []);
  };

  useEffect(() => {
    fetchData();

    const lChannel = supabase.channel('layout_listings').on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, fetchData).subscribe();
    const oChannel = supabase.channel('layout_opps').on('postgres_changes', { event: '*', schema: 'public', table: 'opportunities' }, fetchData).subscribe();

    return () => { 
      supabase.removeChannel(lChannel);
      supabase.removeChannel(oChannel);
    };
  }, []);

  const pendingListings = listings.filter(l => l.approval_status === 'pending').length;
  const pendingOpps = opps.filter(o => o.status === 'pending').length;
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
            {pendingListings > 0 && <span style={{ marginLeft: 'auto', background: 'var(--accent)', color: 'white', padding: '2px 6px', fontSize: '10px', border: '1px solid var(--black)' }}>{pendingListings}</span>}
          </Link>
          <Link to="/users" className={`nav-item ${isActive('/users') ? 'active' : ''}`}>
            <Users size={18} /> COMMUNITY
          </Link>
          <Link to="/broadcast" className={`nav-item ${isActive('/broadcast') ? 'active' : ''}`}>
            <Radio size={18} /> BROADCAST
          </Link>
          <Link to="/opportunities" className={`nav-item ${isActive('/opportunities') ? 'active' : ''}`}>
            <ListTodo size={18} /> OPPORTUNITIES
            {pendingOpps > 0 && <span style={{ marginLeft: 'auto', background: 'var(--secondary)', color: 'black', padding: '2px 6px', fontSize: '10px', border: '1px solid var(--black)', fontWeight: '900' }}>{pendingOpps}</span>}
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
          <Route path="/broadcast" element={<Broadcast />} />
          <Route path="/opportunities" element={<Opportunities />} />
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

