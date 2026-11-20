const router = require('express').Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, employerOnly } = require('../middleware/auth');

router.get('/mine', protect, async (req, res) =>
  res.json(await Application.find({ applicant: req.user.id }).populate('job').sort({ createdAt: -1 })));

router.get('/job/:jobId', protect, employerOnly, async (req, res) => {
  const job = await Job.findOne({ _id: req.params.jobId, postedBy: req.user.id });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json(await Application.find({ job: job._id }).populate('applicant', 'name email'));
});

router.post('/:jobId', protect, async (req, res) => {
  try {
    if (req.user.role !== 'seeker') return res.status(403).json({ message: 'Only job seekers can apply' });
    const app = await Application.create({
      job: req.params.jobId, applicant: req.user.id, coverLetter: req.body.coverLetter,
    });
    res.status(201).json(app);
  } catch (e) {
    res.status(400).json({ message: e.code === 11000 ? 'You already applied to this job' : e.message });
  }
});

router.patch('/:id/status', protect, employerOnly, async (req, res) => {
  const app = await Application.findById(req.params.id).populate('job');
  if (!app || String(app.job.postedBy) !== req.user.id) return res.status(404).json({ message: 'Not found' });
  app.status = req.body.status;
  await app.save();
  res.json(app);
});

module.exports = router;
