const db = require('../db/index')

const addComment = async (recipeId, authorId, content) => {
    const add = await db.query(
        `INSERT INTO comments (recipe_id, author_id, content) VALUES ($1, $2, $3) RETURNING *`,
        [recipeId, authorId, content]
    );
    return add.rows[0]
}

const deleteComment = async (id, authorId) => {
    const existing = await db.query('SELECT * FROM comments WHERE id = $1', [id])
    if (existing.rows.length === 0) {
        throw new Error("Comment not found")
    }
    if (existing.rows[0].author_id != authorId) {
        throw new Erro("Unauthorized")
    }
    await db.query("DELETE FROM comments WHERE id =$1", [id])
    return { message: 'Comment delete successfully' }
}

const getComments = async (recipeId) => {
    const result = await db.query(`
        SELECT comments.*, users.username as author_name
        FROM comments
        JOIN users ON comments.author_id = users.id
        WHERE comments.recipe_id = $1
        ORDER BY comments.created_at DESC
    `, [recipeId]);
    return result.rows
}
module.exports = {addComment, deleteComment, getComments}