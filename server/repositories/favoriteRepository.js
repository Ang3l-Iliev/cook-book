const db = require('../db/index');

class FavoriteRepository {
    async findByUserAndRecipe(userId, recipeId) {
        const result = await db.query(
            'SELECT * FROM favorite_recipes WHERE user_id = $1 AND recipe_id = $2',
            [userId, recipeId]
        );
        return result.rows[0] || null;
    }

    async create(userId, recipeId) {
        await db.query(
            'INSERT INTO favorite_recipes (user_id, recipe_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [userId, recipeId]
        );
    }

    async delete(userId, recipeId) {
        await db.query(
            'DELETE FROM favorite_recipes WHERE user_id = $1 AND recipe_id = $2',
            [userId, recipeId]
        );
    }

    async findAllByUser(userId) {
        const result = await db.query(`
            SELECT r.*, u.username as author_name
            FROM recipes r
            JOIN favorite_recipes f ON r.id = f.recipe_id
            JOIN users u ON r.author_id = u.id
            WHERE f.user_id = $1
        `, [userId]);
        return result.rows;
    }
}

module.exports = new FavoriteRepository();