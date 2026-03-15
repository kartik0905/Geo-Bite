const express = require('express');
const { getNearbyCafes, createCafe, getCafe } = require('../controllers/Cafe.controllers.js');

const router = express.Router();

router.route('/')
  .get(getNearbyCafes)
  .post(createCafe);

router.route('/:id')
  .get(getCafe);

module.exports = router;