const favoriteService = require('../services/favoriteService');

const addFavorite = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const recipeId = req.params.recipeId;
        const result = await favoriteService.addFavorite(userId, recipeId);
        res.json(result);
    } catch (err) {
        next(err)
    }
};

const removeFavorite = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const recipeId = req.params.recipeId;
        const result = await favoriteService.removeFavorite(userId, recipeId);
        res.json(result);
    } catch (err) {
        next(err)
    }
};

const getFavorites = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const result = await favoriteService.getFavorites(userId);
        res.json(result);
    } catch (err) {
       next(err)
    }
};

module.exports = { addFavorite, removeFavorite, getFavorites };