import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Jobs() {
  const [data, setData] = useState({ jobs: [], total: 0, page: 1, pages: 1 });
  const [filters, setFilters] = useState({ q: '', location: '', type: '' });
  const [loading, setLoading] = useState(true);

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get('/jobs', { params: { ...filters, page } });
      setData(res.data);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(1); }, []);

  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });

  return (
    <>
      <section className="hero">
        <h1>Thousands of Trusted Jobs &amp; Internships</h1>
        <p className="hero-sub">Find verified openings, build your resume and apply in one place.</p>
        <form className="search-card" onSubmit={(e) => { e.preventDefault(); load(1); }}>
          <label>Looking for ▾
            <select value={filters.type} onChange={set('type')}>
              <option value="">All job types</option>
              <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Remote</option>
            </select>
          </label>
          <label>Skill, title or company ▾
            <input placeholder="e.g. React, Data Analyst" value={filters.q} onChange={set('q')} />
          </label>
          <label>Location ▾
            <input placeholder="e.g. Pune, Remote" value={filters.location} onChange={set('location')} />
          </label>
          <button className="btn big">Find jobs</button>
        </form>
      </section>

      <p className="muted">{loading ? 'Loading jobs…' : `${data.total} job${data.total === 1 ? '' : 's'} found`}</p>

      {!loading && data.jobs.length === 0 && (
        <p className="muted">No jobs match your search. Try a broader keyword.</p>
      )}
      <div className="list">
        {data.jobs.map((j) => (
          <Link to={`/jobs/${j._id}`} key={j._id} className="card job">
            <div>
              <h3>{j.title}</h3>
              <p>{j.company} · {j.location}</p>
              <div className="tags">{j.skills.map((s) => <span key={s} className="tag">{s}</span>)}</div>
            </div>
            <div className="right-col">
              <span className="pill">{j.type}</span>
              {j.salary && <span className="muted">{j.salary}</span>}
              <span className="muted small-text">{new Date(j.createdAt).toLocaleDateString()}</span>
            </div>
          </Link>
        ))}
      </div>

      {data.pages > 1 && (
        <div className="pager">
          <button className="btn small ghost" disabled={data.page <= 1} onClick={() => load(data.page - 1)}>Previous</button>
          <span>Page {data.page} of {data.pages}</span>
          <button className="btn small ghost" disabled={data.page >= data.pages} onClick={() => load(data.page + 1)}>Next</button>
        </div>
      )}
    </>
  );
}
