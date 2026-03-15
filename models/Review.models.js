const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  cafe: {
    type: mongoose.Schema.ObjectId,
    ref: 'Cafe',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);