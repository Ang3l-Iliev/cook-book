const db = require('../db/index');

class UserRepository {
    async findByEmailOrUsername(email, username) {
        const result = await db.query(
            'SELECT id FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );
        return result.rows[0] || null;
    }

    async findByEmail(email) {
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0] || null;
    }

    async create(email, username, passwordHash) {
        const result = await db.query(
            'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING id, email, username',
            [email, username, passwordHash]
        );
        return result.rows[0] || null;
    }
}

module.exports = new UserRepository();