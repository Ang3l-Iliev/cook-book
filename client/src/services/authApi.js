import { post } from './api';

const login = async (email, password) => {
    return await post('/auth/login', { email, password });
};

const register = async (email, username, password) => {
    return await post('/auth/register', { email, username, password });
};

export { login, register };