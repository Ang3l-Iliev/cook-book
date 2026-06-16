import { get, post, del } from "./api";

const getComments = async (recipeId) => {
    return await get(`/recipes/${recipeId}/comments`)
}

const addComment = async (recipeId, content) => {
    return await post(`/recipes/${recipeId}/comments`, { content })
}

const deleteComment = async (recipeId, id) => {
    return await del(`/recipes/${recipeId}/comments/${id}`);
};

export { getComments, addComment, deleteComment }