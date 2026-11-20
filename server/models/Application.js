const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: String,
  status: { type: String, enum: ['Applied', 'Shortlisted', 'Rejected'], default: 'Applied' },
}, { timestamps: true });
schema.index({ job: 1, applicant: 1 }, { unique: true });
module.exports = mongoose.model('Application', schema);
