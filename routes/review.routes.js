const express = require('express');
const { addReview } = require('../controllers/review.controllers');
const { protect } = require('../middlewares/auth.middlewares');

const router = express.Router({ mergeParams: true });

router.route('/').post(protect, addReview);

module.exports = router;