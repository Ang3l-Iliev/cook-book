import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { register } from '../services/authApi';

const Register = () => {
    const [userName, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const { login: loginContext } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const result = await register(email, userName, password);
            loginContext(result.user, result.token);
            navigate('/recipes');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Sign up</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input required type="text" placeholder="Username" value={userName} onChange={(e) => setUsername(e.target.value)} />
                <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Create an account</button>
            </form>
        </div>
    );
};

export default Register;