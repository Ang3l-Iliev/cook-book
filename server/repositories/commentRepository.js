const db = require('../db/index');

class CommentRepository {
    async create(recipeId, authorId, content) {
        const result = await db.query(
            `INSERT INTO comments (recipe_id, author_id, content) VALUES ($1, $2, $3) RETURNING *`,
            [recipeId, authorId, content]
        );
        return result.rows[0];
    }

    async findById(id) {
        const result = await db.query(
            'SELECT * FROM comments WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    async delete(id) {
        await db.query('DELETE FROM comments WHERE id = $1', [id]);
    }

    async findAllByRecipe(recipeId) {
        const result = await db.query(`
            SELECT comments.*, users.username as author_name
            FROM comments
            JOIN users ON comments.author_id = users.id
            WHERE comments.recipe_id = $1
            ORDER BY comments.created_at DESC
        `, [recipeId]);
        return result.rows;
    }
}

module.exports = new CommentRepository();