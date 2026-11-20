export default function ResumePreview({ r }) {
  const has = (arr) => arr && arr.some((x) => Object.values(x).some(Boolean));
  return (
    <div className={`resume-paper ${r.template || 'classic'}`}>
      <div className="r-head">
        <h1>{r.fullName || 'Your Name'}</h1>
        <p className="contact">
          {[r.email, r.phone, r.location, r.linkedin, r.github].filter(Boolean).join('  |  ')}
        </p>
      </div>

      {r.summary && (<><h2>Summary</h2><p>{r.summary}</p></>)}

      {r.skills?.length > 0 && (
        <>
          <h2>Skills</h2>
          <p>{r.skills.join(', ')}</p>
        </>
      )}

      {has(r.experience) && (
        <>
          <h2>Experience</h2>
          {r.experience.map((x, i) => (
            <div key={i} className="item">
              <strong>{x.role}</strong>{x.company && ` – ${x.company}`}
              <span className="right">{x.duration}</span>
              <p>{x.details}</p>
            </div>
          ))}
        </>
      )}

      {has(r.projects) && (
        <>
          <h2>Projects</h2>
          {r.projects.map((x, i) => (
            <div key={i} className="item"><strong>{x.name}</strong><p>{x.details}</p></div>
          ))}
        </>
      )}

      {has(r.education) && (
        <>
          <h2>Education</h2>
          {r.education.map((x, i) => (
            <div key={i} className="item">
              <strong>{x.degree}</strong>{x.school && ` – ${x.school}`}
              <span className="right">{x.year}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
