import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRecipe } from '../services/recipeApi';

const CreateRecipe = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cookingTime, setCookingTime] = useState('');
    const [difficulty, setDifficulty] = useState('EASY');
    const [imageUrl, setImageUrl] = useState('');
    const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);

    const handleIngredientChange = (index, field, value) => {
        const updated = [...ingredients];
        updated[index][field] = value;
        setIngredients(updated);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '' }]);
    };

    const removeIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const recipe = await createRecipe({
            title, description, cookingTime, difficulty, imageUrl, ingredients
        });
        navigate(`/recipes/${recipe.id}`);
    };

    return (
        <div>
            <h2>Create a recipe</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Tittle" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <input type="number" placeholder="Time (min)" value={cookingTime} onChange={(e) => setCookingTime(e.target.value)} />
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                </select>
                <input type="text" placeholder="image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                <h3>Ingredients</h3>
                {ingredients.map((ingredient, index) => (
                    <div key={index}>
                        <input type="text" placeholder="Ingredients" value={ingredient.name} onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} />
                        <input type="text" placeholder="Quantity" value={ingredient.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} />
                        <button type="button" onClick={() => removeIngredient(index)}>X</button>
                    </div>
                ))}
                <button type="button" onClick={addIngredient}>+ Add an ingredient</button>
                <button type="submit">Create a recipe</button>
            </form>
        </div>
    );
};

export default CreateRecipe;