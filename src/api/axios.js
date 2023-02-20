import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:3500'
})

//attaches interceptors to requests for re-try on accesstoken expiry
export const axiosPrivate = axios.create({
    baseURL: 'http://localhost:3500',
    withCredentials: true
})

