const favoriteService = require('../services/favoriteService');

const addFavorite = async (req, res) => {
    try {
        const userId = req.user.userId;
        const recipeId = req.params.recipeId;
        const result = await favoriteService.addFavorite(userId, recipeId);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const removeFavorite = async (req, res) => {
    try {
        const userId = req.user.userId;
        const recipeId = req.params.recipeId;
        const result = await favoriteService.removeFavorite(userId, recipeId);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getFavorites = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await favoriteService.getFavorites(userId);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { addFavorite, removeFavorite, getFavorites };