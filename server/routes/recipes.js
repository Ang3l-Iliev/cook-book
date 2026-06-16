const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const recipeController = require('../controllers/recipeController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');

router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);

router.post('/', authMiddleware, [
    body('title').notEmpty().withMessage('Title is required'),
    body('difficulty').isIn(['EASY', 'MEDIUM', 'HARD']).withMessage('Difficulty must be EASY, MEDIUM or HARD'),
    body('cookingTime').isInt({ min: 1 }).withMessage('Cooking time must be a positive number')
], validate, recipeController.createRecipe);

router.put('/:id', authMiddleware, [
    body('title').notEmpty().withMessage('Title is required'),
    body('difficulty').isIn(['EASY', 'MEDIUM', 'HARD']).withMessage('Difficulty must be EASY, MEDIUM or HARD'),
    body('cookingTime').isInt({ min: 1 }).withMessage('Cooking time must be a positive number')
], validate, recipeController.updateRecipe);

router.delete('/:id', authMiddleware, recipeController.deleteRecipe);

module.exports = router;