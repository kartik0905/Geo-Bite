const express = require('express');
const { addReview } = require('../controllers/review.controllers');

const router = express.Router({ mergeParams: true });

router.route('/').post(addReview);

module.exports = router;