const mealPlanService = require('../services/mealPlanService');

const addMealPlan = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { recipeId, date } = req.body;
        const result = await mealPlanService.addMealPlan(userId, recipeId, date);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const deleteMealPlan = async (req, res) => {
    try {
        const userId = req.user.userId;
        const id = req.params.id;
        const result = await mealPlanService.deleteMealPlan(userId, id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const getMealPlans = async (req, res) => {
    try {
        console.log('body:', req.body);
        console.log('user:', req.user);
        const userId = req.user.userId;
        const result = await mealPlanService.getMealPlans(userId);
        res.json(result)
    } catch (error) { 
        res.status(400).json({ error: error.message });
    }
};
module.exports = { addMealPlan, deleteMealPlan, getMealPlans };