import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext.jsx';

const Stat = ({ n, label }) => (
  <div className="stat"><strong>{n}</strong><span>{label}</span></div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [saved, setSaved] = useState([]);
  const employer = user.role === 'employer';

  const load = () => {
    api.get(employer ? '/jobs/mine' : '/applications/mine').then((r) => setItems(r.data));
    if (!employer) api.get('/saved').then((r) => setSaved(r.data));
  };
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Delete this job and all its applications? This cannot be undone.')) return;
    await api.delete(`/jobs/${id}`);
    load();
  };
  const count = (s) => items.filter((a) => a.status === s).length;

  return (
    <>
      <h2>Welcome, {user.name}</h2>
      {employer ? (
        <>
          <div className="stats">
            <Stat n={items.length} label="Jobs posted" />
            <Stat n={items.reduce((t, j) => t + (j.applicantCount || 0), 0)} label="Total applicants" />
          </div>
          <h3>Your job posts</h3>
          {items.length === 0 && <p className="muted">No jobs yet. <Link to="/post-job">Post your first job.</Link></p>}
          {items.map((j) => (
            <div key={j._id} className="card row">
              <div>
                <strong>{j.title}</strong>
                <p className="muted">{j.company} · {j.location} · {j.applicantCount} applicant{j.applicantCount === 1 ? '' : 's'}</p>
              </div>
              <div className="actions">
                <Link className="btn small" to={`/applicants/${j._id}`}>View applicants</Link>
                <Link className="btn small ghost" to={`/edit-job/${j._id}`}>Edit</Link>
                <button className="btn small danger" onClick={() => remove(j._id)}>Delete</button>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <div className="stats">
            <Stat n={items.length} label="Applied" />
            <Stat n={count('Shortlisted')} label="Shortlisted" />
            <Stat n={count('Rejected')} label="Rejected" />
            <Stat n={saved.length} label="Saved jobs" />
          </div>
          <h3>Your applications</h3>
          {items.length === 0 && <p className="muted">You haven't applied anywhere yet. <Link to="/">Browse jobs.</Link></p>}
          {items.map((a) => (
            <div key={a._id} className="card row">
              <div>
                <strong>{a.job?.title || 'Job removed'}</strong>
                <p className="muted">{a.job?.company} · applied {new Date(a.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`status ${a.status}`}>{a.status}</span>
            </div>
          ))}
          <h3>Saved jobs</h3>
          {saved.length === 0 && <p className="muted">Nothing saved yet. Use "Save job" on any job page.</p>}
          {saved.map((j) => (
            <Link key={j._id} to={`/jobs/${j._id}`} className="card row" style={{ textDecoration: 'none' }}>
              <div><strong>{j.title}</strong><p className="muted">{j.company} · {j.location}</p></div>
              <span className="pill">{j.type}</span>
            </Link>
          ))}
        </>
      )}
    </>
  );
}
