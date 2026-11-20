# HireDesk – Job Portal with Resume Builder (MERN)

## Features
- Register / login with JWT (roles: Job seeker, Employer)
- Employers: post jobs, delete jobs, view applicants, view their resumes, shortlist / reject
- Seekers: search & filter jobs, apply with cover letter, track application status
- Resume builder: live preview, save to database, download as PDF (browser print)

## Tech stack
MongoDB + Mongoose, Express, React (Vite), Node.js, JWT, bcrypt, Axios, React Router

## Extra features (v1.1)
- Security: Helmet headers, login rate-limiting, input validation, role checks on every protected route
- Job search with pagination, edit job, cascade-delete applications
- Saved jobs, dashboard statistics for both roles
- Resume builder: 3 templates (Classic, Modern, Compact), resume-strength meter, PDF download
- Seed script with demo data

## Run it
Requirements: Node 18+, MongoDB running locally (or a MongoDB Atlas URI in server/.env)

```
cd server
npm install
npm run seed       # optional: demo data (employer@demo.com / student@demo.com, password demo123)
npm run dev        # http://localhost:5000

cd ../client
npm install
npm run dev        # http://localhost:5173
```

## Folder structure
- server/models      User, Job, Application, Resume schemas
- server/routes      auth, jobs, applications, resume APIs
- server/middleware  JWT auth + role check
- client/src/pages   Jobs, JobDetail, Login, Register, PostJob, Dashboard, Applicants, ResumeBuilder
- client/src/components  Navbar, ResumePreview

## API summary
POST /api/auth/register, /api/auth/login
GET  /api/jobs?q=&location=&type=   POST /api/jobs (employer)   DELETE /api/jobs/:id
POST /api/applications/:jobId   GET /api/applications/mine   GET /api/applications/job/:jobId
PATCH /api/applications/:id/status
GET/PUT /api/resume   GET /api/resume/user/:userId (employer)

## Demo flow for your faculty
1. Sign up as Employer -> Post a job
2. Sign up as Job seeker -> Build resume -> Save -> Download PDF
3. Search the job -> Apply
4. Log in as Employer -> View applicants -> View resume -> Shortlist
5. Log in as seeker -> Dashboard shows "Shortlisted"

## Deploy (live link)
1. MongoDB Atlas: create free cluster, add a database user, allow network access 0.0.0.0/0, copy connection string.
2. Push this project to GitHub.
3. Render -> New -> Web Service -> connect repo.
   - Build command: `cd client && npm install && npm run build && cd ../server && npm install`
   - Start command: `cd server && npm start`
   - Environment variables: MONGO_URI, JWT_SECRET, NODE_ENV=production
4. Open the Render URL. (Optional) run `npm run seed` locally with the Atlas MONGO_URI to load demo data.
