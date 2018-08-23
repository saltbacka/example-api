const express = require("express");
const router = express.Router();

const Location = require("../models/location");

// @route   GET /api/locations/
// @desc    Get all locations
// @access  Public
router.get("/locations", (req, res) => {
  Location.find().then(foundLocations => res.json(foundLocations));
});

// @route   POST /api/locations/
// @desc    Create location
// @access  Public
router.post("/locations", (req, res) => {
  const newLocation = new Location({
    name: req.body.name,
    description: req.body.description,
    position: req.body.position
  });
  newLocation
    .save()
    .then(createdLocation => res.json(createdLocation))
    .catch(error => res.status(400).json({ error }));
});

// @route   GET /api/locations/:id
// @desc    Get single location
// @access  Public
router.get("/locations/:id", (req, res) => {
  Location.findById(req.param.id).then(foundLocation =>
    res.json(foundLocation)
  );
});

module.exports = router;
