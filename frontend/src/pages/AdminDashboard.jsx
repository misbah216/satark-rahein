import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAdminStats,
  getAdminUsers,
  sendCampusBroadcast,
  createNewQuestion,
} from '../api.js';

const THEME = {
  accent: '#f59e0b',
  glow: 'rgba(245, 158, 11, 0.45)',
  bgGlass: 'rgba(13, 20, 38, 0.9)',
  border: 'rgba(245, 158, 11, 0.35)',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [hazardsConfig, setHazardsConfig] = useState({});
  const [selectedLocation, setSelectedLocation] = useState('uttarakhand');
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);

  // Broadcast form state
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    severity: 'warning',
  });
  const [broadcastStatus, setBroadcastStatus] = useState('');

  // Question form state
  const [qForm, setQForm] = useState({
    category: 'Earthquake Safety',
    questionText: '',
    optA: '',
    optB: '',
    optC: '',
    optD: '',
    correctAnswerIndex: 0,
    explanation: '',
    difficulty: 'Medium',
  });
  const [qStatus, setQStatus] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const statsRes = await getAdminStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
        setHazardsConfig(statsRes.hazardsConfig || {});
      }
      const usersRes = await getAdminUsers();
      if (usersRes.success) {
        setUsers(usersRes.users || []);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  };

  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.message) return;
    try {
      await sendCampusBroadcast(broadcastForm);
      setBroadcastStatus('Broadcast alert dispatched across campus!');
      setTimeout(() => setBroadcastStatus(''), 4000);
      setBroadcastForm({ title: '', message: '', severity: 'warning' });
    } catch (err) {
      setBroadcastStatus('Failed to send broadcast');
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!qForm.questionText || !qForm.optA || !qForm.optB) return;
    try {
      const payload = {
        category: qForm.category,
        questionText: qForm.questionText,
        options: [qForm.optA, qForm.optB, qForm.optC, qForm.optD].filter(Boolean),
        correctAnswerIndex: parseInt(qForm.correctAnswerIndex),
        explanation: qForm.explanation,
        difficulty: qForm.difficulty,
      };
      await createNewQuestion(payload);
      setQStatus('Question added to live drills successfully!');
      setTimeout(() => setQStatus(''), 4000);
      setQForm({
        category: 'Earthquake Safety',
        questionText: '',
        optA: '',
        optB: '',
        optC: '',
        optD: '',
        correctAnswerIndex: 0,
        explanation: '',
        difficulty: 'Medium',
      });
    } catch (err) {
      setQStatus('Failed to create question');
    }
  };

  // CSV Report Generator
  const exportToCSV = () => {
    if (!users || users.length === 0) return;
    const headers = ['Full Name', 'Email', 'Role', 'ID / Section', 'Drills Finished', 'Readiness Score', 'Status'];
    const rows = users.map((u) => [
      `"${u.fullName}"`,
      `"${u.email}"`,
      `"${u.role}"`,
      `"${u.roleField || 'N/A'}"`,
      u.quizzesCompleted || 0,
      u.totalScore || 0,
      (u.totalScore || 0) >= 30 ? 'Certified' : 'Pending',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Campus_Safety_Report_${selectedLocation}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.roleField && u.roleField.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const currentLocationData = hazardsConfig[selectedLocation] || {
    name: 'Custom Location',
    primaryHazards: ['Earthquake Safety', 'Fire Safety'],
    riskLevel: 'HIGH',
    advisory: 'Select your institute geographic zone to tailor disaster priorities.',
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '30px auto', padding: '0 24px 80px 24px', fontFamily: 'inherit', color: '#f8fafc' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: `1.5px solid ${THEME.border}`,
              color: THEME.accent,
              padding: '8px 16px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '700',
              marginBottom: '14px',
              boxShadow: `0 0 12px -2px ${THEME.glow}`,
            }}
          >
            ← Back to Student View
          </button>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: 0 }}>Campus Safety Control & Admin Portal</h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', margin: '6px 0 0 0' }}>
            Monitor institute preparedness, manage student/teacher rosters, and configure location-targeted drills.
          </p>
        </div>

        {/* Location Dropdown */}
        <div style={{
          backgroundColor: THEME.bgGlass,
          border: `1.5px solid ${THEME.border}`,
          borderRadius: '16px',
          padding: '16px 20px',
          minWidth: '280px',
          boxShadow: `0 0 20px -5px ${THEME.glow}`,
        }}>
          <label style={{ fontSize: '11px', fontWeight: '800', color: THEME.accent, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
            📍 Institute Location Preset
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              color: '#ffffff',
              padding: '8px 12px',
              fontSize: '13.5px',
              fontWeight: '600',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="uttarakhand" style={{ background: '#0a0f1d' }}>Uttarakhand / Hilly (Zone V)</option>
            <option value="delhi-ncr" style={{ background: '#0a0f1d' }}>Delhi-NCR / Western UP (Zone IV)</option>
            <option value="mumbai-coastal" style={{ background: '#0a0f1d' }}>Mumbai / Coastal (Floods/Cyclones)</option>
            <option value="odisha-bengal" style={{ background: '#0a0f1d' }}>Odisha & Bengal Coast (Super Cyclones)</option>
          </select>
        </div>
      </div>

      {/* Location Hazard Banner */}
      <div style={{
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        border: `1.5px solid ${THEME.border}`,
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <span style={{
            backgroundColor: '#ef4444',
            color: '#fff',
            fontSize: '11px',
            fontWeight: '800',
            padding: '4px 10px',
            borderRadius: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginRight: '12px',
          }}>
            Vulnerability: {currentLocationData.riskLevel}
          </span>
          <strong style={{ fontSize: '16px', color: '#fff' }}>{currentLocationData.name}</strong>
          <p style={{ color: '#94a3b8', fontSize: '13.5px', margin: '6px 0 0 0' }}>
            {currentLocationData.advisory}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {currentLocationData.primaryHazards.map((h, i) => (
            <span key={i} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12.5px',
              fontWeight: '700',
              color: THEME.accent,
            }}>
              🚨 Priority: {h}
            </span>
          ))}
        </div>
      </div>

      {/* Core KPI Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '36px' }}>
        <div style={{ backgroundColor: THEME.bgGlass, border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Enrolled Students</span>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#38bdf8', marginTop: '8px' }}>{stats?.totalStudents || 0}</div>
        </div>

        <div style={{ backgroundColor: THEME.bgGlass, border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Active Safety Teachers</span>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#a78bfa', marginTop: '8px' }}>{stats?.totalTeachers || 0}</div>
        </div>

        <div style={{ backgroundColor: THEME.bgGlass, border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Campus Readiness Score</span>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#34d399', marginTop: '8px' }}>{stats?.avgCampusReadiness || 0} <span style={{ fontSize: '14px', color: '#64748b' }}>avg pts</span></div>
        </div>

        <div style={{ backgroundColor: THEME.bgGlass, border: '1.5px solid rgba(239, 68, 68, 0.4)', borderRadius: '16px', padding: '20px', boxShadow: '0 0 15px rgba(239, 68, 68, 0.15)' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#f87171', textTransform: 'uppercase' }}>⚠️ Deficit Area Identified</span>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', marginTop: '8px' }}>{stats?.weakestModule || 'Fire Safety'}</div>
          <span style={{ fontSize: '12px', color: '#f87171' }}>Avg response accuracy: {stats?.weakestAvg || 45}%</span>
        </div>
      </div>

      {/* Action Center: Broadcast & Question CRUD Forms */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
        
        {/* Broadcast Form */}
        <div style={{ backgroundColor: THEME.bgGlass, border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '26px' }}>
          <h2 style={{ fontSize: '19px', fontWeight: '800', margin: '0 0 8px 0' }}>🚨 Dispatch Campus Emergency Alert</h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 18px 0' }}>Push an instant alert banner to all student dashboards.</p>

          <form onSubmit={handleBroadcastSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              type="text"
              placeholder="Alert Title (e.g., Unannounced Earthquake Mock Drill)"
              value={broadcastForm.title}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
            />
            <textarea
              rows="3"
              placeholder="Instructions (e.g., Alarm will sound at 11:30 AM. Evacuate via North Stairwell to Football Ground)."
              value={broadcastForm.message}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <select
                value={broadcastForm.severity}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, severity: e.target.value })}
                style={{ backgroundColor: '#0a0f1d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
              >
                <option value="warning">Warning / Routine Drill</option>
                <option value="emergency">High Emergency Alert</option>
              </select>

              <button
                type="submit"
                style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '13px' }}
              >
                Broadcast Notice 📢
              </button>
            </div>
            {broadcastStatus && <div style={{ color: '#34d399', fontSize: '13px', fontWeight: '700' }}>{broadcastStatus}</div>}
          </form>
        </div>

        {/* Question Creator */}
        <div style={{ backgroundColor: THEME.bgGlass, border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '26px' }}>
          <h2 style={{ fontSize: '19px', fontWeight: '800', margin: '0 0 8px 0' }}>🛡️ Add Location Drill Question</h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 18px 0' }}>Add new scenario questions into students' live practice pools.</p>

          <form onSubmit={handleQuestionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select
                value={qForm.category}
                onChange={(e) => setQForm({ ...qForm, category: e.target.value })}
                style={{ flex: 1, backgroundColor: '#0a0f1d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
              >
                <option value="Earthquake Safety">Earthquake Safety</option>
                <option value="Fire Safety">Fire Safety</option>
                <option value="Flood Preparedness">Flood Preparedness</option>
                <option value="Cyclone & Storms">Cyclone & Storms</option>
              </select>

              <select
                value={qForm.difficulty}
                onChange={(e) => setQForm({ ...qForm, difficulty: e.target.value })}
                style={{ backgroundColor: '#0a0f1d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Question Scenario text..."
              value={qForm.questionText}
              onChange={(e) => setQForm({ ...qForm, questionText: e.target.value })}
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input type="text" placeholder="Option A" value={qForm.optA} onChange={(e) => setQForm({ ...qForm, optA: e.target.value })} style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 10px', borderRadius: '6px', color: '#fff', fontSize: '12px' }} />
              <input type="text" placeholder="Option B" value={qForm.optB} onChange={(e) => setQForm({ ...qForm, optB: e.target.value })} style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 10px', borderRadius: '6px', color: '#fff', fontSize: '12px' }} />
              <input type="text" placeholder="Option C" value={qForm.optC} onChange={(e) => setQForm({ ...qForm, optC: e.target.value })} style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 10px', borderRadius: '6px', color: '#fff', fontSize: '12px' }} />
              <input type="text" placeholder="Option D" value={qForm.optD} onChange={(e) => setQForm({ ...qForm, optD: e.target.value })} style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 10px', borderRadius: '6px', color: '#fff', fontSize: '12px' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Correct Option:</span>
              <select
                value={qForm.correctAnswerIndex}
                onChange={(e) => setQForm({ ...qForm, correctAnswerIndex: e.target.value })}
                style={{ backgroundColor: '#0a0f1d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '12px' }}
              >
                <option value={0}>Option A</option>
                <option value={1}>Option B</option>
                <option value={2}>Option C</option>
                <option value={3}>Option D</option>
              </select>

              <button
                type="submit"
                style={{ marginLeft: 'auto', backgroundColor: THEME.accent, color: '#070c18', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '13px' }}
              >
                Add Question +
              </button>
            </div>
            {qStatus && <div style={{ color: '#34d399', fontSize: '13px', fontWeight: '700' }}>{qStatus}</div>}
          </form>
        </div>
      </div>

      {/* User Directory: Students & Teachers Table */}
      <div style={{ backgroundColor: THEME.bgGlass, border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Campus Safety Compliance Roster</h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0 0' }}>Manage student drill scores and teacher supervisors.</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={exportToCSV}
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1.5px solid #10b981',
                color: '#34d399',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              📥 Export CSV Report
            </button>

            <input
              type="text"
              placeholder="Search by name, roll, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '8px 14px', color: '#fff', fontSize: '13px' }}
            />

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={{ backgroundColor: '#0a0f1d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
            >
              <option value="all">All Roles</option>
              <option value="student">Students Only</option>
              <option value="teacher">Teachers Only</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '13.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th style={{ padding: '12px 16px' }}>Name & Email</th>
                <th style={{ padding: '12px 16px' }}>Role</th>
                <th style={{ padding: '12px 16px' }}>ID / Section</th>
                <th style={{ padding: '12px 16px' }}>Drills Finished</th>
                <th style={{ padding: '12px 16px' }}>Readiness Score</th>
                <th style={{ padding: '12px 16px' }}>Compliance Status</th>
                <th style={{ padding: '12px 16px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const isCompliant = (u.totalScore || 0) >= 30;
                return (
                  <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '16px' }}>
                      <strong style={{ color: '#ffffff', display: 'block' }}>{u.fullName}</strong>
                      <span style={{ color: '#64748b', fontSize: '12px' }}>{u.email}</span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        backgroundColor: u.role === 'teacher' ? 'rgba(167, 139, 250, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                        color: u.role === 'teacher' ? '#c084fc' : '#38bdf8',
                        border: `1px solid ${u.role === 'teacher' ? 'rgba(167, 139, 250, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#cbd5e1' }}>{u.roleField || 'N/A'}</td>
                    <td style={{ padding: '16px', color: '#cbd5e1' }}>{u.quizzesCompleted || 0} Drills</td>
                    <td style={{ padding: '16px', fontWeight: '800', color: '#fff' }}>{u.totalScore || 0} pts</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: isCompliant ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: isCompliant ? '#34d399' : '#f87171',
                        border: `1px solid ${isCompliant ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      }}>
                        {isCompliant ? 'Ready / Certified' : 'Pending Training'}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <button
                        onClick={() => setSelectedStudentForModal(u)}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Inspect 🔍
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Student Modal */}
      {selectedStudentForModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#0a0f1d',
            border: '2px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '580px',
            width: '100%',
            boxShadow: '0 0 30px rgba(0,0,0,0.8)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>{selectedStudentForModal.fullName}</h3>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>{selectedStudentForModal.email} • {selectedStudentForModal.roleField || 'N/A'}</span>
              </div>
              <span style={{
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: THEME.accent,
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '800',
              }}>
                {selectedStudentForModal.totalScore || 0} pts
              </span>
            </div>

            <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', margin: '0 0 12px 0' }}>
              Attempt History ({selectedStudentForModal.quizHistory?.length || 0})
            </h4>

            <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {selectedStudentForModal.quizHistory && selectedStudentForModal.quizHistory.length > 0 ? (
                selectedStudentForModal.quizHistory.map((h, i) => (
                  <div key={i} style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#fff', fontWeight: '600' }}>{h.category}</span>
                    <span style={{ color: h.percentage >= 60 ? '#34d399' : '#f87171', fontWeight: '700' }}>{h.percentage}% ({h.score}/{h.totalQuestions})</span>
                  </div>
                ))
              ) : (
                <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>No drill attempts recorded yet.</div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedStudentForModal(null)}
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#374151',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}