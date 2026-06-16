import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getRecipes } from '../services/recipeApi';
import useDebounce from './useDebounce';

const useRecipes = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);

    const filters = useMemo(() => ({
        search: searchParams.get('search') || '',
        difficulty: searchParams.get('difficulty') || '',
        maxTime: searchParams.get('maxTime') || '',
        page: Number(searchParams.get('page')) || 1,
        limit: Number(searchParams.get('limit')) || 10,
        sortBy: searchParams.get('sortBy') || 'created_at',
        sortOrder: searchParams.get('sortOrder') || 'DESC'
    }), [searchParams])

    const setFilters = (newFilters) => {
        const params = {};
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) params[key] = value;
        });
        setSearchParams(params);
    };

    const debouncedSearch = useDebounce(filters.search, 500);

    const fetchRecipes = useCallback(async (signal) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getRecipes({ ...filters, search: debouncedSearch }, signal);
            setRecipes(data.recipes);
            setTotalPages(data.totalPages);
        } catch (error) {
            if (error.name !== 'AbortError') {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    }, [filters, debouncedSearch]);

    useEffect(() => {
        const controller = new AbortController();
        fetchRecipes(controller.signal);
        return () => controller.abort();
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