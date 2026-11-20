const router = require('express').Router();
const Resume = require('../models/Resume');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => res.json(await Resume.findOne({ user: req.user.id })));

router.get('/user/:userId', protect, async (req, res) => {
  if (req.user.role !== 'employer') return res.status(403).json({ message: 'Employers only' });
  res.json(await Resume.findOne({ user: req.params.userId }));
});

router.put('/', protect, async (req, res) => {
  const { _id, user, ...data } = req.body;
  const resume = await Resume.findOneAndUpdate(
    { user: req.user.id }, { ...data, user: req.user.id }, { new: true, upsert: true }
  );
  res.json(resume);
});

module.exports = router;
