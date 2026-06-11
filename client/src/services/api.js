const BASE_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

export const get = async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });
    return response.json();
};

export const post = async (endpoint, data) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const del = async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });
    return response.json();
};