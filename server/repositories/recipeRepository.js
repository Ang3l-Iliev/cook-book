const db = require('../db/index');

class RecipeRepository {
    async findAll({ search, difficulty, maxTime, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' }) {
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

        let countParamCount = 1;
        let countValues = [];
        let countQuery = `
            SELECT COUNT(*) 
            FROM recipes r
            JOIN users u ON r.author_id = u.id
            WHERE 1=1
        `;

        if (search) {
            countQuery += ` AND r.title ILIKE $${countParamCount}`;
            countValues.push(`%${search}%`);
            countParamCount++;
        }

        if (difficulty) {
            countQuery += ` AND r.difficulty = $${countParamCount}`;
            countValues.push(difficulty);
            countParamCount++;
        }

        if (maxTime) {
            countQuery += ` AND r.cooking_time <= $${countParamCount}`;
            countValues.push(maxTime);
            countParamCount++;
        }

        const countResult = await db.query(countQuery, countValues);
        const total = parseInt(countResult.rows[0].count);

        const offset = (page - 1) * limit;
        const allowedSortFields = ['created_at', 'cooking_time', 'title', 'difficulty'];
        const allowedSortOrders = ['ASC', 'DESC'];

        const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
        const safeSortOrder = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

        query += ` ORDER BY r.${safeSortBy} ${safeSortOrder} LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        values.push(Number(limit));
        values.push(offset);

        const result = await db.query(query, values);

        return {
            recipes: result.rows,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit)
        };
    }

    async findById(id) {
        const recipeResult = await db.query(`
            SELECT r.*, u.username as author_name 
            FROM recipes r
            JOIN users u ON r.author_id = u.id
            WHERE r.id = $1
        `, [id]);

        if (recipeResult.rows.length === 0) return null;

        const ingredientsResult = await db.query(`
            SELECT * FROM ingredients WHERE recipe_id = $1
        `, [id]);

        return {
            ...recipeResult.rows[0],
            ingredients: ingredientsResult.rows
        };
    }

    async create(authorId, { title, description, cookingTime, difficulty, imageUrl, ingredients }) {
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            const recipeResult = await client.query(
                `INSERT INTO recipes (author_id, title, description, cooking_time, difficulty, image_url)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [authorId, title, description, cookingTime, difficulty, imageUrl]
            );

            const recipe = recipeResult.rows[0];

            if (ingredients?.length) {
                for (const ingredient of ingredients) {
                    await client.query(
                        `INSERT INTO ingredients (recipe_id, name, quantity) VALUES ($1, $2, $3)`,
                        [recipe.id, ingredient.name, ingredient.quantity]
                    );
                }
            }

            await client.query('COMMIT');
            return recipe;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async update(id, { title, description, cookingTime, difficulty, imageUrl }) {
        const result = await db.query(`
            UPDATE recipes 
            SET title = $1, description = $2, cooking_time = $3, difficulty = $4, image_url = $5
            WHERE id = $6
            RETURNING *
        `, [title, description, cookingTime, difficulty, imageUrl, id]);

        return result.rows[0];
    }

    async delete(id) {
        await db.query('DELETE FROM recipes WHERE id = $1', [id]);
    }

    async findByIdRaw(id) {
        const result = await db.query('SELECT * FROM recipes WHERE id = $1', [id]);
        return result.rows[0] || null;
    }
}

module.exports = new RecipeRepository();