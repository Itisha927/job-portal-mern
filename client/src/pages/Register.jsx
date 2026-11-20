import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext.jsx';

export default function Register() {
  const [f, setF] = useState({ name: '', email: '', password: '', role: 'seeker' });
  const [err, setErr] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', f);
      login(data);
      nav('/dashboard');
    } catch (e) { setErr(errMsg(e)); }
  };

  return (
    <form className="card narrow" onSubmit={submit}>
      <h2>Create your account</h2>
      {err && <p className="error">{err}</p>}
      <label>Full name<input required value={f.name} onChange={set('name')} /></label>
      <label>Email<input type="email" required value={f.email} onChange={set('email')} /></label>
      <label>Password<input type="password" minLength={6} required value={f.password} onChange={set('password')} /></label>
      <label>I am a
        <select value={f.role} onChange={set('role')}>
          <option value="seeker">Job seeker</option>
          <option value="employer">Employer</option>
        </select>
      </label>
      <button className="btn">Sign up</button>
      <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
    </form>
  );
}
