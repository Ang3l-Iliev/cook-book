const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/mealPlanController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, mealPlanController.addMealPlan);
router.delete('/:id', authMiddleware, mealPlanController.deleteMealPlan);
router.get('/', authMiddleware, mealPlanController.getMealPlans);

module.exports = router;