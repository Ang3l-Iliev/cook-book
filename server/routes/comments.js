const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');

router.get('/:id/comments', commentController.getComments);
router.post('/:id/comments', authMiddleware, commentController.addComment);
router.delete('/:id/comments/:commentId', authMiddleware, commentController.deleteComment);

module.exports = router;