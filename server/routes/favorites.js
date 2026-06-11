const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, favoriteController.getFavorites);
router.post('/:recipeId', authMiddleware, favoriteController.addFavorite);
router.delete('/:recipeId', authMiddleware, favoriteController.removeFavorite);

module.exports = router;