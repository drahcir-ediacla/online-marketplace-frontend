import { useEffect } from 'react';
import axios from 'axios';
import useAuthentication from './authHook';

const useAxiosPrivate = () => {
    const auth = useAuthentication()

    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL, // Your backend API base URL
        withCredentials: true, // Send cookies with requests
    });
    
    useEffect(() => {
        // Add request interceptor
        const requestInterceptor = axiosInstance.interceptors.request.use(
            (config) => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Add response interceptor
        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error?.config;
        
                if (error?.response?.status === 401 && !originalRequest?.sent) {
                    originalRequest.sent = true; // Avoid infinite retry loop
        
                    const newAccessToken = await axiosInstance.get('/api/refresh', {
                        withCredentials: true,
                    });
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                }
        
                return Promise.reject(error);
            }
        );

        // Cleanup interceptors on unmount
        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, [auth, axiosInstance]);

    return axiosInstance;
};

export default useAxiosPrivate;
