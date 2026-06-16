const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = ['JWT_SECRET', 'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.error(`Missing required environment variable: ${varName}`);
        process.exit(1);
    }
});

const app = require('./app');
const db = require('./db/index');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await db.end();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Shutting down gracefully...');
    await db.end();
    process.exit(0);
});