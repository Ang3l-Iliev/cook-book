import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getRecipeById, deleteRecipe } from '../services/recipeApi';
import { getComments, addComment, deleteComment } from '../services/commentApi';

const RecipeDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                const recipeData = await getRecipeById(id);
                const commentsData = await getComments(id);
                setRecipe(recipeData);
                setComments(commentsData);
                setLoading(false);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setLoading(false);
                }
            }
        };
        fetchData();
        return () => controller.abort();
    }, [id]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        const comment = await addComment(id, newComment);
        setComments([...comments, comment]);
        setNewComment('');
    };

    const handleDeleteComment = async (commentId) => {
        await deleteComment(id, commentId);
        setComments(comments.filter(c => c.id !== commentId));
    };

    const handleDelete = async () => {
        await deleteRecipe(id);
        navigate('/recipes');
    };

    return (
        <div>
            {loading && <p>Loading...</p>}
            {recipe && (
                <div>
                    <h2>{recipe.title}</h2>
                    {recipe.image_url && <img src={recipe.image_url} alt={recipe.title} style={{ width: '100%', maxWidth: '400px' }} />}
                    <p>{recipe.description}</p>
                    <p>{recipe.difficulty} • {recipe.cooking_time} min</p>
                    <p>Author: {recipe.author_name}</p>
                    {user && user.id === Number(recipe.author_id) && (
                        <button onClick={handleDelete}>Remove recipe</button>
                    )}
                </div>
            )}
            <h3>Ingredients</h3>
            {recipe && (
                <ul>
                    {recipe.ingredients.map(ingredient => (
                        <li key={ingredient.id}>
                            {ingredient.name} - {ingredient.quantity}
                        </li>
                    ))}
                </ul>
            )}
            <h3>Comments</h3>
            {comments.map(comment => (
                <div key={comment.id}>
                    <p><strong>{comment.author_name}</strong>: {comment.content}</p>
                    {user && user.id === Number(comment.author_id) && (
                        <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                    )}
                </div>
            ))}
            {user && (
                <form onSubmit={handleAddComment}>
                    <input
                        type="text"
                        placeholder="Add comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button type="submit">Add</button>
                </form>
            )}
        </div>
    );
};

export default RecipeDetail;