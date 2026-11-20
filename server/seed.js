// Run: npm run seed   -> creates demo users + sample jobs
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

const jobs = [
  ['MERN Stack Developer', 'TechNova Solutions', 'Bengaluru', 'Full-time', '₹6–9 LPA', 'React, Node.js, MongoDB, Express', 'Build and maintain full stack web apps. You will work with React on the front end and Node/Express APIs backed by MongoDB.'],
  ['Frontend Developer Intern', 'PixelCraft Studio', 'Remote', 'Internship', '₹15,000/month', 'HTML, CSS, JavaScript, React', 'Work with our design team to turn Figma designs into responsive React components.'],
  ['Backend Engineer', 'CloudBridge', 'Hyderabad', 'Full-time', '₹8–12 LPA', 'Node.js, MongoDB, REST, AWS', 'Design scalable REST APIs and own services end to end, from schema design to deployment.'],
  ['UI/UX Designer', 'Designly', 'Pune', 'Full-time', '₹5–8 LPA', 'Figma, Prototyping, User Research', 'Own the design of our mobile and web products, from research to hand-off.'],
  ['Data Analyst', 'InsightHub', 'Mumbai', 'Full-time', '₹5–7 LPA', 'SQL, Python, Power BI', 'Turn raw data into dashboards and weekly business insights.'],
  ['Java Developer', 'FinServe Systems', 'Chennai', 'Full-time', '₹6–10 LPA', 'Java, Spring Boot, MySQL', 'Develop banking microservices using Spring Boot.'],
  ['Part-time Content Writer', 'WordWorks', 'Remote', 'Part-time', '₹20,000/month', 'Writing, SEO', 'Write blogs and landing page copy for tech clients.'],
  ['DevOps Engineer', 'ScaleUp Labs', 'Noida', 'Full-time', '₹9–14 LPA', 'Docker, CI/CD, AWS, Linux', 'Automate deployments and keep our infrastructure reliable.'],
  ['Android Developer', 'AppForge', 'Remote', 'Remote', '₹7–11 LPA', 'Kotlin, Android, Firebase', 'Build and ship features for our consumer Android app.'],
  ['Machine Learning Intern', 'DeepMind Labs India', 'Bengaluru', 'Internship', '₹20,000/month', 'Python, TensorFlow, Pandas', 'Assist the ML team with model training and evaluation.'],
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([Job.deleteMany({}), Application.deleteMany({}), User.deleteMany({ email: { $in: ['employer@demo.com', 'student@demo.com'] } })]);
  const pw = await bcrypt.hash('demo123', 10);
  const emp = await User.create({ name: 'Demo Employer', email: 'employer@demo.com', password: pw, role: 'employer' });
  await User.create({ name: 'Demo Student', email: 'student@demo.com', password: pw, role: 'seeker' });
  await Job.insertMany(jobs.map(([title, company, location, type, salary, skills, description]) => ({
    title, company, location, type, salary, description, skills: skills.split(',').map((s) => s.trim()), postedBy: emp._id,
  })));
  console.log('Seeded. Logins -> employer@demo.com / demo123  |  student@demo.com / demo123');
  process.exit(0);
})();
