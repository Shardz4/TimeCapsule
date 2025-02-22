const express = require('express');
const router = express.Router();
const Capsule = require('../models/Capsule');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises; // For reading media files
const crypto = require('crypto'); // For hashing

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
  const { title, content, releaseDate, collaborators, isPublic, hash: clientHash } = req.body;
  const media = req.file ? req.file.path : null;

  try {
    // Prepare capsule data for hashing (excluding media for now)
    const capsuleData = JSON.stringify({
      title,
      content,
      releaseDate,
      collaborators: collaborators ? collaborators.split(',') : [],
      isPublic: isPublic === 'true' // Convert string to boolean
    });

    // Compute hash including media if present
    let finalHash = clientHash; // Default to client-provided hash
    if (media) {
      const mediaBuffer = await fs.readFile(media); // Read the media file
      finalHash = crypto
        .createHash('sha256')
        .update(capsuleData + mediaBuffer) // Combine text data and media
        .digest('hex');
    } else {
      // If no media, recompute hash from capsuleData to ensure consistency
      finalHash = crypto.createHash('sha256').update(capsuleData).digest('hex');
    }

    // Create the capsule with the final hash
    const capsule = new Capsule({
      title,
      content,
      media,
      releaseDate,
      userId: req.user.id,
      collaborators: collaborators ? collaborators.split(',') : [],
      hash: finalHash, // Store the computed hash
      isPublic: isPublic === 'true' // Convert string to boolean
    });

    await capsule.save();
    res.json(capsule);
  } catch (error) {
    console.error('Error creating capsule:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's capsules
router.get('/capsules', authenticate, async (req, res) => {
  try {
    const capsules = await Capsule.find({
      $or: [{ userId: req.user.id }, { collaborators: req.user.email }]
    });

    // Verify hash for each capsule and add locked status
    const verifiedCapsules = await Promise.all(capsules.map(async (c) => {
      const capsuleData = JSON.stringify({
        title: c.title,
        content: c.content,
        releaseDate: c.releaseDate,
        collaborators: c.collaborators,
        isPublic: c.isPublic
      });

      let recomputedHash;
      if (c.media) {
        const mediaBuffer = await fs.readFile(c.media);
        recomputedHash = crypto.createHash('sha256').update(capsuleData + mediaBuffer).digest('hex');
      } else {
        recomputedHash = crypto.createHash('sha256').update(capsuleData).digest('hex');
      }

      const isValid = recomputedHash === c.hash;
      return {
        ...c._doc,
        locked: new Date() < new Date(c.releaseDate),
        hashValid: isValid // Optional: Include hash verification status
      };
    }));

    res.json(verifiedCapsules);
  } catch (error) {
    console.error('Error fetching capsules:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Dummy login (for simplicity)
router.post('/login', (req, res) => {
  const { email } = req.body;
  const token = jwt.sign({ id: email, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
