// backend/routes/itineraryRoutes.js
const express = require('express');
const Itinerary = require('../models/Itinerary');
const router = express.Router();

// Create a new itinerary
router.post('/', async (req, res) => {
  const { user, activities, isPublic } = req.body;
  const newItinerary = new Itinerary({ user, activities, isPublic });

  try {
    const savedItinerary = await newItinerary.save();
    res.status(201).json(savedItinerary);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all itineraries
router.get('/', async (req, res) => {
  try {
    const itineraries = await Itinerary.find().populate('user', 'username');
    res.json(itineraries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upvote an itinerary
router.put('/:id/vote', async (req, res) => {
  try {
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      { $inc: { votes: 1 } },
      { new: true }
    );
    res.json(updatedItinerary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
