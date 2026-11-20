const router = require('express').Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const { protect, employerOnly } = require('../middleware/auth');

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const parseSkills = (s) =>
  Array.isArray(s) ? s : (s || '').toString().split(',').map((x) => x.trim()).filter(Boolean);
const pick = (b) => ({
  title: b.title, company: b.company, location: b.location, type: b.type,
  salary: b.salary, description: b.description, skills: parseSkills(b.skills),
});

// Search + filter + pagination
router.get('/', async (req, res) => {
  const { q, location, type } = req.query;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = 8;
  const filter = {};
  if (q) filter.$or = [
    { title: new RegExp(esc(q), 'i') }, { company: new RegExp(esc(q), 'i') }, { skills: new RegExp(esc(q), 'i') },
  ];
  if (location) filter.location = new RegExp(esc(location), 'i');
  if (type) filter.type = type;
  const total = await Job.countDocuments(filter);
  const jobs = await Job.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
  res.json({ jobs, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
});

router.get('/mine', protect, employerOnly, async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 }).lean();
  const withCounts = await Promise.all(
    jobs.map(async (j) => ({ ...j, applicantCount: await Application.countDocuments({ job: j._id }) }))
  );
  res.json(withCounts);
});

router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    job ? res.json(job) : res.status(404).json({ message: 'Job not found' });
  } catch { res.status(404).json({ message: 'Job not found' }); }
});

router.post('/', protect, employerOnly, async (req, res) => {
  try {
    res.status(201).json(await Job.create({ ...pick(req.body), postedBy: req.user.id }));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/:id', protect, employerOnly, async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.id }, pick(req.body), { new: true, runValidators: true }
    );
    job ? res.json(job) : res.status(404).json({ message: 'Job not found' });
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/:id', protect, employerOnly, async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.user.id });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  await Application.deleteMany({ job: job._id });   // no orphan applications
  res.json({ message: 'Deleted' });
});

module.exports = router;
