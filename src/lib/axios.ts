import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_API_KEY,
    },
});

export default axiosInstance;