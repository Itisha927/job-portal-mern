import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import ResumePreview from '../components/ResumePreview.jsx';

export default function Applicants() {
  const { jobId } = useParams();
  const [apps, setApps] = useState([]);
  const [resume, setResume] = useState(undefined);

  const load = () => api.get(`/applications/job/${jobId}`).then((r) => setApps(r.data));
  useEffect(() => { load(); }, [jobId]);

  const setStatus = async (id, status) => { await api.patch(`/applications/${id}/status`, { status }); load(); };
  const viewResume = async (userId) => {
    const { data } = await api.get(`/resume/user/${userId}`);
    setResume(data);
  };

  return (
    <>
      <h2>Applicants</h2>
      {apps.length === 0 && <p className="muted">No applications yet.</p>}
      {apps.map((a) => (
        <div key={a._id} className="card">
          <div className="row">
            <div><strong>{a.applicant.name}</strong><p className="muted">{a.applicant.email}</p></div>
            <span className={`status ${a.status}`}>{a.status}</span>
          </div>
          {a.coverLetter && <p>{a.coverLetter}</p>}
          <div className="actions">
            <button className="btn small" onClick={() => viewResume(a.applicant._id)}>View resume</button>
            <button className="btn small" onClick={() => setStatus(a._id, 'Shortlisted')}>Shortlist</button>
            <button className="btn small danger" onClick={() => setStatus(a._id, 'Rejected')}>Reject</button>
          </div>
        </div>
      ))}
      {resume === null && <p className="muted">This applicant has not built a resume yet.</p>}
      {resume && <ResumePreview r={resume} />}
    </>
  );
}
