const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db.js');
const cafeRoutes = require('./routes/cafe.routes');
const reviewRoutes = require('./routes/review.routes');
const authRoutes = require('./routes/auth.routes');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/cafes', cafeRoutes);
app.use('/api/cafes/:cafeId/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});