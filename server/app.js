const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const favoriteRoutes = require('./routes/favorites');
const commentRoutes = require('./routes/comments');
const mealPlanRoutes = require('./routes/mealPlan');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/recipes', commentRoutes);
app.use('/api/meal-plans', mealPlanRoutes);

app.get('/api/health', async (req, res) => {
    try {
        const db = require('./db/index');
        await db.query('SELECT 1');
        res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
    } catch (err) {
        res.status(500).json({ status: 'error', database: 'disconnected' });
    }
});

app.use(errorHandler);

module.exports = app;