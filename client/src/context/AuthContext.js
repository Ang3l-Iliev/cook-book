import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const isTokenValid = (token) => {
        if (!token) return false;
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            return decoded.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser && isTokenValid(savedToken)) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;