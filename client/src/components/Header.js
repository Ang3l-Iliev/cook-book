import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ display: 'flex', gap: '16px', padding: '12px 24px', borderBottom: '1px solid #eee', alignItems: 'center' }}>
            <Link to="/">CookBook</Link>
            <Link to="/recipes">Recipes</Link>
            {user && <Link to="/meal-plans">Meal Plan</Link>}
            {user && <Link to="/create-recipe">Create Recipe</Link>}
            <div style={{ marginLeft: 'auto' }}>
                {user ? (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span>Hello, {user.username}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Header;