const mongoose = require('mongoose');
module.exports = mongoose.model('Resume', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  template: { type: String, enum: ['classic', 'modern', 'compact'], default: 'classic' },
  fullName: String, email: String, phone: String, location: String,
  linkedin: String, github: String, summary: String,
  skills: [String],
  education: [{ school: String, degree: String, year: String }],
  experience: [{ company: String, role: String, duration: String, details: String }],
  projects: [{ name: String, details: String }],
}, { timestamps: true }));
