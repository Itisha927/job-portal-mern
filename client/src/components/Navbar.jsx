import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="nav no-print">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={close}>hire<span>desk</span> <em>●</em></Link>
        <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <i /><i /><i />
        </button>
        <nav className={open ? 'open' : ''} onClick={close}>
          <Link to="/">Jobs</Link>
          {user?.role === 'seeker' && <Link to="/resume">Resume builder</Link>}
          {user?.role === 'employer' && <Link to="/post-job">Post a job</Link>}
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button className="link-btn" onClick={() => { logout(); nav('/'); }}>
                Log out ({user.name.split(' ')[0]})
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register" className="btn small">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
