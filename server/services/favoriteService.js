const db = require('../db/index');

const addFavorite = async (userId, recipeId) => {
    const exist = await db.query(
        'SELECT * FROM favorite_recipes WHERE user_id = $1 AND recipe_id = $2',
        [userId, recipeId]
    );

    if (exist.rows.length > 0) {
        throw new Error('Recipe already in favorites');
    }

    await db.query(
        'INSERT INTO favorite_recipes (user_id, recipe_id) VALUES ($1, $2)',
        [userId, recipeId]
    );

    return { message: 'Recipe added to favorites' };
};

const removeFavorite = async (userId, recipeId) => {
    const exist = await db.query(
        'SELECT * FROM favorite_recipes WHERE user_id = $1 AND recipe_id = $2',
        [userId, recipeId]
    );

    if (exist.rows.length === 0) {
        throw new Error('Recipe not in favorites');
    }

    await db.query(
        'DELETE FROM favorite_recipes WHERE user_id = $1 AND recipe_id = $2',
        [userId, recipeId]
    );

    return { message: 'Recipe removed from favorites' };
};
const getFavorites = async (userId) => {
    const result = await db.query(`
        SELECT r.*, u.username as author_name
        FROM recipes r
        JOIN favorite_recipes f ON r.id = f.recipe_id
        JOIN users u ON r.author_id = u.id
        WHERE f.user_id = $1
    `, [userId]);
    return result.rows;
};

module.exports = { addFavorite, removeFavorite, getFavorites };