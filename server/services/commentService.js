const commentRepository = require('../repositories/commentRepository');
const { NotFoundError, ForbiddenError } = require('../utils/errors');

class CommentService {
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }

    async addComment(recipeId, authorId, content) {
        return await this.commentRepository.create(recipeId, authorId, content);
    }

    async deleteComment(id, authorId) {
        const existing = await this.commentRepository.findById(id);
        if (!existing) {
            throw new NotFoundError('Comment not found');
        }
        if (existing.author_id != authorId) {
            throw new ForbiddenError('You cannot delete this comment');
        }
        await this.commentRepository.delete(id);
        return { message: 'Comment deleted successfully' };
    }

    async getComments(recipeId) {
        return await this.commentRepository.findAllByRecipe(recipeId);
    }
}

module.exports = new CommentService(commentRepository);