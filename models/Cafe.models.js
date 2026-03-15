const mongoose = require('mongoose');

const cafeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genre: { type: String, required: true },
  averageRating: { type: Number, default: 0 },
  priceLevel: { type: Number, min: 1, max: 4 },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

cafeSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Cafe', cafeSchema);