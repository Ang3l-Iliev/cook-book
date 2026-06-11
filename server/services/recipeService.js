const db = require('../db/index');

const getAllRecipes = async ({ search, difficulty, maxTime, page = 1, limit = 10 }) => {
    let values = [];
    let paramCount = 1;

    let query = `
        SELECT r.*, u.username as author_name 
        FROM recipes r
        JOIN users u ON r.author_id = u.id
        WHERE 1=1
    `;

    if (search) {
        query += ` AND r.title ILIKE $${paramCount}`;
        values.push(`%${search}%`);
        paramCount++;
    }

    if (difficulty) {
        query += ` AND r.difficulty = $${paramCount}`;
        values.push(difficulty);
        paramCount++;
    }

    if (maxTime) {
        query += ` AND r.cooking_time <= $${paramCount}`;
        values.push(maxTime);
        paramCount++;
    }

    let countQuery = `
        SELECT COUNT(*) 
        FROM recipes r
        JOIN users u ON r.author_id = u.id
        WHERE 1=1
    `;
    let countValues = [...values];

    if (search) countQuery += ` AND r.title ILIKE $1`;
    if (difficulty) countQuery += ` AND r.difficulty = $${search ? 2 : 1}`;
    if (maxTime) countQuery += ` AND r.cooking_time <= $${[search, difficulty].filter(Boolean).length + 1}`;

    const countResult = await db.query(countQuery, countValues);
    const total = parseInt(countResult.rows[0].count);

    const offset = (page - 1) * limit;
    query += ` ORDER BY r.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(Number(limit));
    values.push(offset);

    const result = await db.query(query, values);

    return {
        recipes: result.rows,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit)
    };
};

const getRecipeById = async (id) => {
    const recipeResult = await db.query(`
        SELECT r.*, u.username as author_name 
        FROM recipes r
        JOIN users u ON r.author_id = u.id
        WHERE r.id = $1
    `, [id]);

    if (recipeResult.rows.length === 0) {
        return null;
    }

    const ingredientsResult = await db.query(`
        SELECT * FROM ingredients WHERE recipe_id = $1
    `, [id]);

    return {
        ...recipeResult.rows[0],
        ingredients: ingredientsResult.rows
    };
};

const createRecipe = async (authorId, { title, description, cookingTime, difficulty, imageUrl, ingredients }) => {
    const recipeResult = await db.query(`
        INSERT INTO recipes (author_id, title, description, cooking_time, difficulty, image_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `, [authorId, title, description, cookingTime, difficulty, imageUrl]);

    const recipe = recipeResult.rows[0];

    if (ingredients && ingredients.length > 0) {
        for (const ingredient of ingredients) {
            await db.query(`
                INSERT INTO ingredients (recipe_id, name, quantity)
                VALUES ($1, $2, $3)
            `, [recipe.id, ingredient.name, ingredient.quantity]);
        }
    }

    return recipe;
};

const updateRecipe = async (id, authorId, { title, description, cookingTime, difficulty, imageUrl }) => {
    const existing = await db.query(
        'SELECT * FROM recipes WHERE id = $1',
        [id]
    );

    if (existing.rows.length === 0) {
        throw new Error('Recipe not found');
    }

    if (existing.rows[0].author_id !== authorId) {
        throw new Error('Unauthorized');
    }

    const result = await db.query(`
        UPDATE recipes 
        SET title = $1, description = $2, cooking_time = $3, difficulty = $4, image_url = $5
        WHERE id = $6
        RETURNING *
    `, [title, description, cookingTime, difficulty, imageUrl, id]);

    return result.rows[0];
};

const deleteRecipe = async (id, authorId) => {
    const existing = await db.query(
        'SELECT * FROM recipes WHERE id = $1',
        [id]
    );

    if (existing.rows.length === 0) {
        throw new Error('Recipe not found');
    }

    if (existing.rows[0].author_id !== authorId) {
        throw new Error('Unauthorized');
    }

    await db.query('DELETE FROM recipes WHERE id = $1', [id]);

    return { message: 'Recipe deleted successfully' };
};

module.exports = { getAllRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe };