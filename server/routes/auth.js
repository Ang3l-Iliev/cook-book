const express = require('express');
const router = express.Router();
const { body } = require('express-validator')
const authController = require('../controllers/authController');
const validate = require('../middleware/validate')

router.post('/register', [
    body('email').isEmail().withMessage('invalid email'),
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('password').isLength({ min: 6 }).withMessage('Username must be at least 6 characters')
], validate, authController.register);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required')
], validate, authController.login);

module.exports = router;