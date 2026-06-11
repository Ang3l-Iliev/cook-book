const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/index');

const register = async (email, username, password) => {
    const existingUser = await db.query(
        "SELECT id FROM users WHERE email = $1 OR username = $2",
        [email, username]
    );

    if (existingUser.rows.length > 0) {
        throw new Error('Email or username already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.query(
        'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username',
        [email, username, passwordHash]
    );

    const user = result.rows[0];

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return { user, token };
};

const login = async (email, password) => {
    const findUser = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );

    if (findUser.rows.length === 0) {
        throw new Error('Invalid credentials');
    }

    const user = findUser.rows[0];

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return {
        user: { id: user.id, email: user.email, username: user.username },
        token
    };
};

module.exports = { register, login };