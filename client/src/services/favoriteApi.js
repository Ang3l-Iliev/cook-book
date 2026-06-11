import {get, post, del} from './api'

const getFavorites = async ()=> {
    return await get ('/favorites')
}

const addFavorite = async (recipeId) => {
    return await post (`/favorites/${recipeId}`)
}
const removeFavorite = async (recipeId) => {
    return await del (`/favorites/${recipeId}`)
}
export { getFavorites, addFavorite, removeFavorite };
