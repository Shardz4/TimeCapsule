const mongoose = require('mongoose');

const capsuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  media: { type: String }, // Path to uploaded file
  releaseDate: { type: Date, required: true },
  userId: { type: String, required: true },
  collaborators: [{ type: String }], // Array of user emails
  isPublic: { type: Boolean, default: false }
  hash: { type: String, required: true }, // New field to store the hash
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Capsule', capsuleSchema);
