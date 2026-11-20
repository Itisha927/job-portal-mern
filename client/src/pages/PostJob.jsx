import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { errMsg } from '../api';

export default function PostJob() {
  const { id } = useParams();            // present when editing
  const [f, setF] = useState({ title: '', company: '', location: '', type: 'Full-time', salary: '', skills: '', description: '' });
  const [err, setErr] = useState('');
  const nav = useNavigate();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    if (id) api.get(`/jobs/${id}`).then(({ data }) => setF({ ...data, skills: data.skills.join(', ') }));
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      id ? await api.put(`/jobs/${id}`, f) : await api.post('/jobs', f);
      nav('/dashboard');
    } catch (e) { setErr(errMsg(e)); }
  };

  return (
    <form className="card narrow" onSubmit={submit}>
      <h2>{id ? 'Edit job' : 'Post a job'}</h2>
      {err && <p className="error">{err}</p>}
      <label>Job title<input required value={f.title} onChange={set('title')} /></label>
      <label>Company<input required value={f.company} onChange={set('company')} /></label>
      <label>Location<input required value={f.location} onChange={set('location')} /></label>
      <label>Type
        <select value={f.type} onChange={set('type')}>
          <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Remote</option>
        </select>
      </label>
      <label>Salary (optional)<input placeholder="e.g. ₹6–8 LPA" value={f.salary || ''} onChange={set('salary')} /></label>
      <label>Skills (comma separated)<input placeholder="React, Node.js, MongoDB" value={f.skills} onChange={set('skills')} /></label>
      <label>Description<textarea rows="6" required value={f.description} onChange={set('description')} /></label>
      <button className="btn">{id ? 'Save changes' : 'Publish job'}</button>
    </form>
  );
}
