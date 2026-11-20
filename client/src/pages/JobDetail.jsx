import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext.jsx';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [cover, setCover] = useState('');
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState({ text: '', ok: false });

  useEffect(() => { api.get(`/jobs/${id}`).then((r) => setJob(r.data)).catch(() => setJob(false)); }, [id]);
  useEffect(() => {
    if (user?.role === 'seeker')
      api.get('/saved').then((r) => setSaved(r.data.some((j) => j._id === id)));
  }, [id, user]);

  const apply = async () => {
    try {
      await api.post(`/applications/${id}`, { coverLetter: cover });
      setMsg({ text: 'Application sent. Track it from your dashboard.', ok: true });
    } catch (e) { setMsg({ text: errMsg(e), ok: false }); }
  };
  const toggleSave = async () => {
    const { data } = await api.post(`/saved/${id}`);
    setSaved(data.saved);
  };

  if (job === null) return <p>Loading…</p>;
  if (job === false) return <p className="error">This job no longer exists.</p>;

  return (
    <div className="card">
      <div className="row">
        <span className="pill">{job.type}</span>
        {user?.role === 'seeker' && (
          <button className="btn small ghost" onClick={toggleSave}>{saved ? 'Saved ✓' : 'Save job'}</button>
        )}
      </div>
      <h1>{job.title}</h1>
      <p>{job.company} · {job.location} {job.salary && `· ${job.salary}`}</p>
      <div className="tags">{job.skills.map((s) => <span key={s} className="tag">{s}</span>)}</div>
      <h3>About the role</h3>
      <p style={{ whiteSpace: 'pre-line' }}>{job.description}</p>

      {!user && <p><Link to="/login">Log in</Link> as a job seeker to apply.</p>}
      {user?.role === 'seeker' && (
        <>
          <h3>Apply</h3>
          <textarea rows="4" placeholder="Short cover letter (optional)" value={cover} onChange={(e) => setCover(e.target.value)} />
          <button className="btn" onClick={apply}>Submit application</button>
          <p className="muted">Tip: finish your <Link to="/resume">resume</Link> first so employers can view it.</p>
        </>
      )}
      {msg.text && <p className={msg.ok ? 'success' : 'error'}>{msg.text}</p>}
    </div>
  );
}
