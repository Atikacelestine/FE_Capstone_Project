import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://api.deezer.com',
});

export default axiosInstance;
