const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Cafe = require('./models/Cafe.models');

dotenv.config();

const cafes = [
  {
    name: "Wild Wisteria Cafe & Restaurant",
    genre: "Dine-in",
    averageRating: 4.8,
    priceLevel: 3,
    location: { type: "Point", coordinates: [77.9993, 30.2628] }
  },
  {
    name: "Arth Coffee House",
    genre: "Coffee",
    averageRating: 4.2,
    priceLevel: 2,
    location: { type: "Point", coordinates: [78.0012, 30.2645] }
  },
  {
    name: "Bake Masters",
    genre: "Fast Food",
    averageRating: 3.9,
    priceLevel: 1,
    location: { type: "Point", coordinates: [77.9920, 30.2695] }
  },
  {
    name: "The Vintage Lounge",
    genre: "Late Night",
    averageRating: 4.5,
    priceLevel: 3,
    location: { type: "Point", coordinates: [77.9950, 30.2710] }
  },
  {
    name: "Green Leaf Vegan",
    genre: "Vegan",
    averageRating: 4.6,
    priceLevel: 2,
    location: { type: "Point", coordinates: [77.9910, 30.2650] }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Cafe.insertMany(cafes);
    console.log('Database Seeded Successfully');
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedDB();