const express = require('express');
const { getNearbyCafes, createCafe, getCafe, aiSearchCafes } = require('../controllers/Cafe.controllers.js');

const router = express.Router();

router.route('/')
  .get(getNearbyCafes)
  .post(createCafe);

router.route('/ai-search')
  .post(aiSearchCafes);

router.route('/:id')
  .get(getCafe);

module.exports = router;