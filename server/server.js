const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const db = require('./db/index');
const authRoutes = require('./routes/auth');  
const recipeRoutes = require('./routes/recipes');
const favoriteRoutes = require('./routes/favorites');
const commentRoutes = require('./routes/comments');
const mealPlanRoutes = require('./routes/mealPlan');



const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);  
app.use('/api/recipes', recipeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/recipes', commentRoutes);
app.use('/api/meal-plans', mealPlanRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'CookBook API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});