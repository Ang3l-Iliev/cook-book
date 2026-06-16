const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const { ConflictError, UnauthorizedError } = require('../utils/errors');

class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async register(email, username, password) {
        const existing = await this.userRepository.findByEmailOrUsername(email, username);
        if (existing) {
            throw new ConflictError('Email or username already exists');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await this.userRepository.create(email, username, passwordHash);

        if (!user) {
            throw new ConflictError('Email or username already exists');
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return { user, token };
    }

    async login(email, password) {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            throw new UnauthorizedError('Invalid credentials');
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
    }
}

module.exports = new AuthService(userRepository);