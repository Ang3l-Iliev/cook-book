const request = require('supertest');
const app = require('../app');
const db = require('../db/index');

describe('Recipes endpoints', () => {
    let token;

    beforeAll(async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'ivan@gmail.com',
                password: 'ivan1234'
            });
        token = response.body.token;
    });

    afterAll(async () => {
        await db.end();
    });

    describe('GET /api/recipes', () => {
        it('should return recipes list', async () => {
            const response = await request(app)
                .get('/api/recipes');

            expect(response.status).toBe(200);
            expect(response.body.recipes).toBeDefined();
            expect(Array.isArray(response.body.recipes)).toBe(true);
        });

        it('should filter by difficulty', async () => {
            const response = await request(app)
                .get('/api/recipes?difficulty=EASY');

            expect(response.status).toBe(200);
            response.body.recipes.forEach(recipe => {
                expect(recipe.difficulty).toBe('EASY');
            });
        });
    });

    describe('POST /api/recipes', () => {
        it('should create a recipe when logged in', async () => {
            const response = await request(app)
                .post('/api/recipes')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Test Recipe',
                    description: 'Test description',
                    cookingTime: 30,
                    difficulty: 'EASY',
                    imageUrl: '',
                    ingredients: [{ name: 'salt', quantity: '1tsp' }]
                });

            expect(response.status).toBe(201);
            expect(response.body.title).toBe('Test Recipe');
        });

        it('should return 401 without token', async () => {
            const response = await request(app)
                .post('/api/recipes')
                .send({
                    title: 'Test Recipe',
                    difficulty: 'EASY',
                    cookingTime: 30
                });

            expect(response.status).toBe(401);
        });
    });
});