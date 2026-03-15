const Review = require('../models/Review.models');
const Cafe = require('../models/Cafe.models');

exports.addReview = async (req, res) => {
  try {
    req.body.cafe = req.params.cafeId;

    const cafe = await Cafe.findById(req.params.cafeId);

    if (!cafe) {
      return res.status(404).json({ error: 'Cafe not found' });
    }

    const review = await Review.create(req.body);

    const reviews = await Review.find({ cafe: req.params.cafeId });

    const totalRating = reviews.reduce((acc, item) => acc + item.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Cafe.findByIdAndUpdate(req.params.cafeId, {
      averageRating: averageRating.toFixed(1)
    });

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to add review' });
  }
};