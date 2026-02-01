import axios from 'axios';

// TODO: Set base URL from env
const BASE_URL = 'https://api.example.com';

export const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptors here if needed (e.g. for auth)
