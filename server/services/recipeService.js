const recipeRepository = require('../repositories/recipeRepository');
const { NotFoundError, ForbiddenError } = require('../utils/errors');

class RecipeService {
    constructor(recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    async getAllRecipes(filters) {
        return await this.recipeRepository.findAll(filters);
    }

    async getRecipeById(id) {
        const recipe = await this.recipeRepository.findById(id);
        if (!recipe) {
            throw new NotFoundError('Recipe not found');
        }
        return recipe;
    }

    async createRecipe(authorId, data) {
        return await this.recipeRepository.create(authorId, data);
    }

    async updateRecipe(id, authorId, data) {
        const existing = await this.recipeRepository.findByIdRaw(id);
        if (!existing) {
            throw new NotFoundError('Recipe not found');
        }
        if (existing.author_id !== authorId) {
            throw new ForbiddenError('You cannot edit this recipe');
        }
        return await this.recipeRepository.update(id, data);
    }

    async deleteRecipe(id, authorId) {
        const existing = await this.recipeRepository.findByIdRaw(id);
        if (!existing) {
            throw new NotFoundError('Recipe not found');
        }
        if (existing.author_id !== authorId) {
            throw new ForbiddenError('You cannot delete this recipe');
        }
        await this.recipeRepository.delete(id);
        return { message: 'Recipe deleted successfully' };
    }
}

module.exports = new RecipeService(recipeRepository);