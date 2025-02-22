const express = require('express');
const router = express.Router();
const Capsule = require('../models/Capsule');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Create a capsule
router.post('/capsules', authenticate, upload.single('media'), async (req, res) => {
  const { title, content, releaseDate, collaborators, isPublic } = req.body;
  const media = req.file ? req.file.path : null;
  const capsule = new Capsule({
    title,
    content,
    media,
    releaseDate,
    userId: req.user.id,
    collaborators: collaborators ? collaborators.split(',') : [],
    hash,
    isPublic
  });
  await capsule.save();
  res.json(capsule);
});

// Get user's capsules
router.get('/capsules', authenticate, async (req, res) => {
  const capsules = await Capsule.find({
    $or: [{ userId: req.user.id }, { collaborators: req.user.email }]
  });
  res.json(capsules.map(c => ({
    ...c._doc,
    locked: new Date() < new Date(c.releaseDate)
  })));
});

// Dummy login (for simplicity)
router.post('/login', (req, res) => {
  const { email } = req.body;
  const token = jwt.sign({ id: email, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
