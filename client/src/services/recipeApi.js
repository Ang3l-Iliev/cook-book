import { get, post, put, del } from "./api";
export const getRecipes = async (filters = {}, signal) => {
    const { search, difficulty, maxTime, page, limit } = filters;
    const params = new URLSearchParams();

    if (search) params.append('search', search);
    if (difficulty) params.append('difficulty', difficulty);
    if (maxTime) params.append('maxTime', maxTime);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    return await get(`/recipes?${params.toString()}`, signal);
};
export const getRecipeById = async (id) => {
    return await get(`/recipes/${id}`);
};

export const createRecipe = async (data) => {
    return await post('/recipes', data);
};

export const updateRecipe = async (id, data) => {
    return await put(`/recipes/${id}`, data);
};

export const deleteRecipe = async (id) => {
    return await del(`/recipes/${id}`);
};