const db = require('../db/index')

const addMealPlan = async (userId, recipeId, date) => {
    const result = await db.query(
        'INSERT INTO meal_plans (user_id, recipe_id, date) VALUES ($1, $2, $3) RETURNING *',
        [userId, recipeId, date]
    );
    return result.rows[0];
};
const deleteMealPlan = async (userId, id) => {
    const result = await db.query("DELETE FROM meal_plans WHERE user_id = $1 AND id=$2", [userId, id])
    return { message: 'Meal plan deleting successfully' }
}
const getMealPlans = async (userId) => {
    const result = await db.query(`
        SELECT meal_plans.*, recipes.title, recipes.cooking_time, recipes.difficulty, recipes.image_url
        FROM meal_plans
        JOIN recipes ON meal_plans.recipe_id = recipes.id
        WHERE meal_plans.user_id = $1
        ORDER BY meal_plans.date
    `, [userId]);
    return result.rows;
};

module.exports = { addMealPlan, deleteMealPlan, getMealPlans };