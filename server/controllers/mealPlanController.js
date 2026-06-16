const mealPlanService = require('../services/mealPlanService');

const addMealPlan = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { recipeId, date } = req.body;
        const result = await mealPlanService.addMealPlan(userId, recipeId, date);
        res.status(201).json(result);
    } catch (err) {
         next(err)
    }
};
const deleteMealPlan = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const id = req.params.id;
        const result = await mealPlanService.deleteMealPlan(userId, id);
        res.json(result);
    } catch (err) {
         next(err)
    }
};
const getMealPlans = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const result = await mealPlanService.getMealPlans(userId);
        res.json(result)
    } catch (err) { 
        next(err)
    }
};
module.exports = { addMealPlan, deleteMealPlan, getMealPlans };