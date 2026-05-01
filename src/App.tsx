import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListTodo, 
  Users, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  ShieldCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle
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

const Listings = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      const { data } = await supabase.from('listings').select('*').order('created_at', { ascending: false });
      setListings(data || []);
      setLoading(false);
    };
    fetchListings();
  }, []);

  const handleApprove = async (id: string) => {
    await supabase.from('listings').update({ approval_status: 'approved' }).eq('id', id);
    setListings(listings.map(l => l.id === id ? { ...l, approval_status: 'approved' } : l));
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Rejection reason:');
    if (reason === null) return;
    await supabase.from('listings').update({ approval_status: 'rejected', rejection_reason: reason }).eq('id', id);
    setListings(listings.map(l => l.id === id ? { ...l, approval_status: 'rejected', rejection_reason: reason } : l));
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
              <th className="mono" style={{ textAlign: 'left', padding: '16px 24px', fontSize: '11px', color: 'var(--text-muted)' }}>PROJECT</th>
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
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{l.title}</div>
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
                    <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '11px' }}>EDIT</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Initializing data stream...</div>}
      </div>
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
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header" style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)' }}>
            <ShieldCheck size={32} />
            <div>
              <div style={{ fontWeight: '900', fontSize: '18px', lineHeight: '1', color: 'white' }}>CREATOR<span style={{ color: 'var(--primary)' }}>OPS</span></div>
              <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ADMIN_TERMINAL_v2.0</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link to="/" className={`btn ${isActive('/') ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', justifyContent: 'flex-start' }}>
            <LayoutDashboard size={18} /> DASHBOARD
          </Link>
          <Link to="/listings" className={`btn ${isActive('/listings') ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', justifyContent: 'flex-start' }}>
            <ListTodo size={18} /> LISTINGS
          </Link>
          <Link to="/users" className={`btn ${isActive('/users') ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', justifyContent: 'flex-start' }}>
            <Users size={18} /> USERS
          </Link>
          <Link to="/settings" className={`btn ${isActive('/settings') ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', justifyContent: 'flex-start' }}>
            <Settings size={18} /> SETTINGS
          </Link>
        </nav>

        <div className="sidebar-footer" style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg)', fontWeight: '700' }}>A</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600' }}>Admin Ops</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>System Level 4</div>
            </div>
          </div>
          <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', color: 'var(--accent)' }} onClick={() => supabase.auth.signOut()}>
            <LogOut size={16} /> LOGOUT
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
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkAdmin(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkAdmin(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdmin = (session: any) => {
    if (!session) {
      setIsAdmin(false);
      return;
    }
    const handle = (session.user.user_metadata.user_name || '').toLowerCase();
    // In production, you would fetch the admin list from Supabase
    // For now, we use the specified admin handle
    if (handle === 'zenvicalpha' || handle === 'shuhaib90') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  if (isAdmin === null) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--primary)' }} className="mono">
        INITIALIZING_SYSTEM_RESOURCES...
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', border: '1px solid var(--accent)' }}>
          <ShieldCheck size={48} color="var(--accent)" style={{ margin: '0 auto 24px' }} />
          <h2 style={{ marginBottom: '8px' }}>Security Breach</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>
            {!session ? 'Authentication required.' : 'Unauthorized access. Your credentials do not have administrator privileges.'}
          </p>
          {!session ? (
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => supabase.auth.signInWithOAuth({ provider: 'x' })}>
              AUTHENTICATE VIA X
            </button>
          ) : (
            <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => supabase.auth.signOut()}>
              RETURN TO SAFETY
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
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
