const request = require('supertest');
const app = require('../app');
const db = require('../db/index');

describe('Auth endpoints', () => {
    afterAll(async () => {
        await db.end();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: `test${Date.now()}@gmail.com`,
                    username: `testuser${Date.now()}`,
                    password: 'password123'
                });

            expect(response.status).toBe(201);
            expect(response.body.token).toBeDefined();
            expect(response.body.user.email).toBeDefined();
        });

        it('should return error for invalid email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'invalid',
                    username: 'testuser',
                    password: 'password123'
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'ivan@gmail.com',
                    password: 'ivan1234'
                });

            expect(response.status).toBe(200);
            expect(response.body.token).toBeDefined();
        });

        it('should return error for wrong password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'ivan@gmail.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
        });
    });
});