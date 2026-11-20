const router = require('express').Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  const user = await User.findById(req.user.id).populate('savedJobs');
  res.json((user?.savedJobs || []).filter(Boolean));
});

// Toggle save / unsave
router.post('/:jobId', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  const has = user.savedJobs.some((id) => String(id) === req.params.jobId);
  if (has) user.savedJobs.pull(req.params.jobId); else user.savedJobs.push(req.params.jobId);
  await user.save();
  res.json({ saved: !has });
});

module.exports = router;
