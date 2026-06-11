import { useState, useEffect, useCallback } from 'react';
import { getRecipes } from '../services/recipeApi';
import useDebounce from './useDebounce';

const useRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        difficulty: '',
        maxTime: '',
        page: 1,
        limit: 10
    });
    const [totalPages, setTotalPages] = useState(1);

    const debouncedSearch = useDebounce(filters.search, 500);

    const fetchRecipes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getRecipes({ ...filters, search: debouncedSearch });
            setRecipes(data.recipes);
            setTotalPages(data.totalPages);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [filters, debouncedSearch]);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    return {
        recipes,
        loading,
        error,
        filters,
        setFilters,
        totalPages
    };
};

export default useRecipes;