const express = require('express');
const { getNearbyCafes, createCafe } = require('../controllers/Cafe.controllers.js');

const router = express.Router();

router.route('/')
  .get(getNearbyCafes)
  .post(createCafe);

module.exports = router;