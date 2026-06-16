const recipeService = require("../services/recipeService");

const getAllRecipes = async (req, res, next) => {
    try {
        const { search, difficulty, maxTime, page, limit } = req.query;
        const result = await recipeService.getAllRecipes({
            search,
            difficulty,
            maxTime,
            page,
            limit,
        });
        res.json(result);
    } catch (err) {
        next(err)
    }
};

const getRecipeById = async (req, res, next) => {
    try {
        const recipeId = req.params.id;
        const recipe = await recipeService.getRecipeById(recipeId);
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        res.json(recipe);
    } catch (err) {
        next(err)
    }
};

const createRecipe = async (req, res, next) => {
    try {
        const authorId = req.user.userId;
        const recipe = await recipeService.createRecipe(authorId, req.body);
        res.status(201).json(recipe);
    } catch (err) {
        next(err)
    }
};

const updateRecipe = async (req, res, next) => {
    try {
        const id = req.params.id
        const authorId = req.user.userId
        const result = await recipeService.updateRecipe(id, authorId, req.body)
        res.status(201).json(result);
    } catch (err) {
        next(err)
    }
}
const deleteRecipe = async (req, res, next) => {
    try {
        const id = req.params.id
        const authorId = req.user.userId
        const result = await recipeService.deleteRecipe(id, authorId)
        res.json(result);
    } catch (err) {
        next(err)
    }
}
module.exports = { getAllRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe };