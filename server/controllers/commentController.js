const commentService = require('../services/commentService');

const addComment = async (req, res, next) => {
    try {
        const authorId = req.user.userId;
        const recipeId = req.params.id;
        const { content } = req.body;
        const comment = await commentService.addComment(recipeId, authorId, content);
        res.status(201).json(comment);
    } catch (err) {
        next(err)
    }
};

const deleteComment = async (req, res, next) => {
    try {
        const id = req.params.commentId;
        const authorId = req.user.userId;
        const result = await commentService.deleteComment(id, authorId);
        res.json(result);
    } catch (err) {
         next(err)
    }
};

const getComments = async (req, res, next) => {
    try {
        const recipeId = req.params.id;
        const comments = await commentService.getComments(recipeId);
        res.json(comments);
    } catch (err) {
         next(err)
    }
};

module.exports = { addComment, deleteComment, getComments };