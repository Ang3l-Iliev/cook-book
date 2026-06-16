import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const token = localStorage.getItem('token');

    if (loading) return <p>Loading...</p>;
    if (!user || !token) return <Navigate to="/login" />;

    try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.exp * 1000 < Date.now()) {
            return <Navigate to="/login" />;
        }
    } catch {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;