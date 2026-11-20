import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Jobs from './pages/Jobs.jsx';
import JobDetail from './pages/JobDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import PostJob from './pages/PostJob.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ResumeBuilder from './pages/ResumeBuilder.jsx';
import Applicants from './pages/Applicants.jsx';

function Private({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
          <Route path="/resume" element={<Private role="seeker"><ResumeBuilder /></Private>} />
          <Route path="/post-job" element={<Private role="employer"><PostJob /></Private>} />
          <Route path="/edit-job/:id" element={<Private role="employer"><PostJob /></Private>} />
          <Route path="/applicants/:jobId" element={<Private role="employer"><Applicants /></Private>} />
        </Routes>
      </main>
    </>
  );
}
