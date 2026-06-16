const mealPlanRepository = require('../repositories/mealPlanRepository');
const { NotFoundError } = require('../utils/errors');
const { recipeRepository } = require('./recipeService');


class MealPlanService {
    constructor(mealPlanRepository) {
        this.mealPlanRepository = mealPlanRepository;
    }

    async addMealPlan(userId, recipeId, date) {
        const recipe = await recipeRepository.findByIdRaw(recipeId)
        if (!recipe) {
            throw new NotFoundError('Recipe not found');
        }
        return await this.mealPlanRepository.create(userId, recipeId, date);
    }

    async getMealPlans(userId) {
        return await this.mealPlanRepository.findAllByUser(userId);
    }
    async deleteMealPlan(userId, id) {
        const rowCount = await this.mealPlanRepository.delete(userId, id);
        if (rowCount === 0) {
            throw new NotFoundError('Meal plan not found');
        }
        return { message: 'Meal plan deleted successfully' };
    }
}

module.exports = new MealPlanService(mealPlanRepository);