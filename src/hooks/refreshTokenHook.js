import { useEffect } from 'react';
import axios from '../apicalls/axios';
import useAuthentication from './authHook1';

const useRefreshToken = () => {
    const { auth, setAuth } = useAuthentication();

    useEffect(() => {
        const refresh = async () => {
            try {
                // Make a request to refresh the token
                const response = await axios.get('/api/refresh', {
                    withCredentials: true
                });

                // Check if auth is not null and there is no accessToken or it has expired
                if (auth && (!auth.accessToken /* add your expiration logic here */)) {
                    
                    // Update the authentication state with the new access token
                    setAuth(prev => ({
                        ...prev,
                        accessToken: response.data.accessToken
                    }));
                    console.log(response.data.accessToken);
                }
                
            } catch (error) {
                // Log the error response from the server if available
                if (error.response) {
                    console.error('Error refreshing access token:', error.response.data);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error('No response received:', error.request);
                } else {
                    // Something happened in setting up the request that triggered an error
                    console.error('Error setting up the request:', error.message);
                }
            }
            
        };
        
        // Call the refresh function when the component mounts or auth changes
        refresh();
    }, [auth, setAuth]);

    return null; // Since this is a side effect, you don't need to return anything
};

export default useRefreshToken;
