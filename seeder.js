const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Cafe = require('./models/Cafe.models');

dotenv.config();

const cafes = require('./geu_cafes_dataset.json');

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