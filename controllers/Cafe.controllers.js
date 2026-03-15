const Cafe = require('../models/Cafe.models.js');

exports.getNearbyCafes = async (req, res) => {
  try {
    const { lng, lat, maxPrice, radius } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({ error: 'Missing coordinates' });
    }

    const maxDistance = radius ? parseInt(radius) : 2000;

    let query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: maxDistance
        }
      }
    };

    if (maxPrice) {
      query.priceLevel = { $lte: parseInt(maxPrice) };
    }

    const cafes = await Cafe.find(query).sort({ averageRating: -1 });

    res.status(200).json({
      success: true,
      count: cafes.length,
      data: cafes
    });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.createCafe = async (req, res) => {
  try {
    const cafe = await Cafe.create(req.body);

    res.status(201).json({
      success: true,
      data: cafe
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create cafe' });
  }
};