import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import ResumePreview from '../components/ResumePreview.jsx';

const empty = {
  template: 'classic', fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', summary: '', skills: [],
  education: [{ school: '', degree: '', year: '' }],
  experience: [{ company: '', role: '', duration: '', details: '' }],
  projects: [{ name: '', details: '' }],
};

export default function ResumeBuilder() {
  const [r, setR] = useState(empty);
  const [skillText, setSkillText] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/resume').then(({ data }) => {
      if (data) { setR({ ...empty, ...data }); setSkillText((data.skills || []).join(', ')); }
    });
  }, []);

  const set = (k) => (e) => setR({ ...r, [k]: e.target.value });
  const setItem = (sec, i, k) => (e) => {
    const copy = [...r[sec]];
    copy[i] = { ...copy[i], [k]: e.target.value };
    setR({ ...r, [sec]: copy });
  };
  const add = (sec, blank) => setR({ ...r, [sec]: [...r[sec], blank] });
  const remove = (sec, i) => setR({ ...r, [sec]: r[sec].filter((_, x) => x !== i) });
  const onSkills = (e) => {
    setSkillText(e.target.value);
    setR({ ...r, skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) });
  };

  const checks = [
    ['Add your full name', !!r.fullName],
    ['Add email and phone', !!r.email && !!r.phone],
    ['Write a summary (40+ characters)', (r.summary || '').length >= 40],
    ['List at least 3 skills', r.skills.length >= 3],
    ['Add a project or experience', r.projects.some((x) => x.name) || r.experience.some((x) => x.role)],
    ['Add your education', r.education.some((x) => x.degree)],
  ];
  const score = Math.round((checks.filter((c) => c[1]).length / checks.length) * 100);

  const save = async () => {
    try { await api.put('/resume', r); setMsg('Resume saved.'); }
    catch (e) { setMsg(errMsg(e)); }
  };

  return (
    <div className="builder">
      <div className="no-print">
        <h2>Resume builder</h2>
        <div className="card">
          <div className="row">
            <strong>Resume strength: {score}%</strong>
            <select style={{ width: 'auto' }} value={r.template} onChange={set('template')}>
              <option value="classic">Classic template</option>
              <option value="modern">Modern template</option>
              <option value="compact">Compact template</option>
            </select>
          </div>
          <div className="meter"><div style={{ width: `${score}%` }} /></div>
          {checks.filter((c) => !c[1]).map((c) => <p key={c[0]} className="muted small-text">To do: {c[0]}</p>)}
        </div>
        <div className="card">
          <h3>Personal details</h3>
          <label>Full name<input value={r.fullName} onChange={set('fullName')} /></label>
          <label>Email<input value={r.email} onChange={set('email')} /></label>
          <label>Phone<input value={r.phone} onChange={set('phone')} /></label>
          <label>Location<input value={r.location} onChange={set('location')} /></label>
          <label>LinkedIn (optional)<input value={r.linkedin || ''} onChange={set('linkedin')} /></label>
          <label>GitHub (optional)<input value={r.github || ''} onChange={set('github')} /></label>
          <label>Summary<textarea rows="3" value={r.summary} onChange={set('summary')} /></label>
          <label>Skills (comma separated)<input value={skillText} onChange={onSkills} /></label>
        </div>

        <div className="card">
          <h3>Experience</h3>
          {r.experience.map((x, i) => (
            <div key={i} className="group">
              <input placeholder="Role" value={x.role} onChange={setItem('experience', i, 'role')} />
              <input placeholder="Company" value={x.company} onChange={setItem('experience', i, 'company')} />
              <input placeholder="Duration (e.g. Jun 2024 – Aug 2024)" value={x.duration} onChange={setItem('experience', i, 'duration')} />
              <textarea rows="2" placeholder="What did you do?" value={x.details} onChange={setItem('experience', i, 'details')} />
              <button className="link-btn" onClick={() => remove('experience', i)}>Remove</button>
            </div>
          ))}
          <button className="btn small" onClick={() => add('experience', { company: '', role: '', duration: '', details: '' })}>Add experience</button>
        </div>

        <div className="card">
          <h3>Projects</h3>
          {r.projects.map((x, i) => (
            <div key={i} className="group">
              <input placeholder="Project name" value={x.name} onChange={setItem('projects', i, 'name')} />
              <textarea rows="2" placeholder="What did you build?" value={x.details} onChange={setItem('projects', i, 'details')} />
              <button className="link-btn" onClick={() => remove('projects', i)}>Remove</button>
            </div>
          ))}
          <button className="btn small" onClick={() => add('projects', { name: '', details: '' })}>Add project</button>
        </div>

        <div className="card">
          <h3>Education</h3>
          {r.education.map((x, i) => (
            <div key={i} className="group">
              <input placeholder="Degree" value={x.degree} onChange={setItem('education', i, 'degree')} />
              <input placeholder="College / school" value={x.school} onChange={setItem('education', i, 'school')} />
              <input placeholder="Year" value={x.year} onChange={setItem('education', i, 'year')} />
              <button className="link-btn" onClick={() => remove('education', i)}>Remove</button>
            </div>
          ))}
          <button className="btn small" onClick={() => add('education', { school: '', degree: '', year: '' })}>Add education</button>
        </div>

        <div className="actions">
          <button className="btn" onClick={save}>Save resume</button>
          <button className="btn ghost" onClick={() => window.print()}>Download as PDF</button>
        </div>
        {msg && <p className="success">{msg}</p>}
      </div>

      <div className="preview-col">
        <ResumePreview r={r} />
      </div>
    </div>
  );
}
