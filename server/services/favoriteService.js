const favoriteRepository = require('../repositories/favoriteRepository');
const recipeRepository = require('../repositories/recipeRepository');
const { NotFoundError } = require('../utils/errors');

class FavoriteService {
    constructor(favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    async addFavorite(userId, recipeId) {
        const recipe = await recipeRepository.findByIdRaw(recipeId);
        if (!recipe) {
            throw new NotFoundError('Recipe not found');
        }
        await this.favoriteRepository.create(userId, recipeId);
        return { message: 'Recipe added to favorites' };
    }

    async removeFavorite(userId, recipeId) {
        const existing = await this.favoriteRepository.findByUserAndRecipe(userId, recipeId);
        if (!existing) {
            throw new NotFoundError('Recipe not in favorites');
        }
        await this.favoriteRepository.delete(userId, recipeId);
        return { message: 'Recipe removed from favorites' };
    }

    async getFavorites(userId) {
        return await this.favoriteRepository.findAllByUser(userId);
    }
}

module.exports = new FavoriteService(favoriteRepository);