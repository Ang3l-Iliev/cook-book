import { useState, useEffect } from 'react';
import { get, post, del } from '../services/api';
import { getRecipes } from '../services/recipeApi';

const MealPlans = () => {
    const [mealPlans, setMealPlans] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [recipeId, setRecipeId] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const mealData = await get('/meal-plans');
            const recipeData = await getRecipes();
            setMealPlans(mealData);
            setRecipes(recipeData.recipes);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await post('/meal-plans', { recipeId: Number(recipeId), date });
            const data = await get('/meal-plans');
            setMealPlans(data);
            setRecipeId('');
            setDate('');
            setError(null);
        } catch (err) {
            setError('There is already a recipe for this date!');
        }
    };

    const handleDelete = async (id) => {
        await del(`/meal-plans/${id}`);
        setMealPlans(mealPlans.filter(plan => plan.id !== id));
    };

    return (
        <div>
            <h2>Meal Plan</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleAdd}>
                <select
                    value={recipeId}
                    onChange={(e) => setRecipeId(e.target.value)}
                >
                    <option value="">Select a recipe</option>
                    {recipes.map(recipe => (
                        <option key={recipe.id} value={recipe.id}>
                            {recipe.title}
                        </option>
                    ))}
                </select>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <button type="submit">Add</button>
            </form>

            {loading && <p>Loading...</p>}

            <div>
                {mealPlans.map((plan, index) => (
                    <div key={index}>
                        <p>{new Date(plan.date).toLocaleDateString('bg-BG')} — {plan.title}</p>
                        <button onClick={() => handleDelete(plan.id)}>X</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MealPlans;