import { Link } from 'react-router-dom';
import useRecipes from '../hooks/useRecipes';
import { getFavorites, addFavorite, removeFavorite } from '../services/favoriteApi';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';

const Recipes = () => {
    const { recipes, loading, error, filters, setFilters, totalPages } = useRecipes();
    const { user } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (user) {
            const fetchFavorites = async () => {
                const data = await getFavorites();
                setFavorites(data.map(f => f.id));
            };
            fetchFavorites();
        }
    }, [user]);

    const handleFavorite = async (recipeId) => {
        if (!user) return;
        const isFavorite = favorites.includes(recipeId);
        if (isFavorite) {
            setFavorites(prev => prev.filter(id => id !== recipeId));
        } else {
            setFavorites(prev => [...prev, recipeId]);
        }
        try {
            if (isFavorite) {
                await removeFavorite(recipeId);
            } else {
                await addFavorite(recipeId);
            }
        } catch (err) {
            if (isFavorite) {
                setFavorites(prev => [...prev, recipeId]);
            } else {
                setFavorites(prev => prev.filter(id => id !== recipeId));
            }
        }
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="Search recipe..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
                <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                >
                    <option value="">All</option>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                </select>
                <input
                    type="number"
                    placeholder="Max. minutes"
                    value={filters.maxTime}
                    onChange={(e) => setFilters({ ...filters, maxTime: e.target.value })}
                />
                <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                >
                    <option value="created_at">Newest</option>
                    <option value="cooking_time">Cooking Time</option>
                    <option value="title">Title</option>
                    <option value="difficulty">Difficulty</option>
                </select>
                <select
                    value={filters.sortOrder}
                    onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                >
                    <option value="DESC">Descending</option>
                    <option value="ASC">Ascending</option>
                </select>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                {recipes.map(recipe => (
                    <div key={recipe.id}>
                        <Link to={`/recipes/${recipe.id}`}>
                            <h3>{recipe.title}</h3>
                        </Link>
                        <p>{recipe.difficulty} • {recipe.cooking_time} мин</p>
                        {user && (
                            <button onClick={() => handleFavorite(recipe.id)}>
                                {favorites.includes(recipe.id) ? '❤️' : '🤍'}
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div>
                <button
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    disabled={filters.page === 1}
                >Back</button>
                <span>{filters.page} / {totalPages}</span>
                <button
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    disabled={filters.page === totalPages}
                >Next</button>
            </div>
        </div>
    );
};

export default Recipes;