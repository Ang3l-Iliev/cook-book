import { useState, useEffect } from 'react';
import { get, post, del } from '../services/api';
import { getRecipes } from '../services/recipeApi';

const MealPlans = () => {
    const [mealPlans, setMealPlans] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [recipeId, setRecipeId] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(true);

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
        await post('/meal-plans', { recipeId: Number(recipeId), date });
        const data = await get('/meal-plans');
        setMealPlans(data);
        setRecipeId('');
        setDate('');
    };

    const handleDelete = async (id) => {
        await del(`/meal-plans/${id}`);
        setMealPlans(mealPlans.filter(plan => plan.id !== id));
    };

    return (
        <div>
            <h2>Meal Plan</h2>
            <form onSubmit={handleAdd}>
                <select required
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
                <input required
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