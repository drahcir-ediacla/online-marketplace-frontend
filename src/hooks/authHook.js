import { useState, useEffect } from 'react';
import { GetCurrentUser } from '../apicalls/users';


const useAuthentication = () => {
    const [user, setUser] = useState(null);
    const [setError] = useState(null);
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          // Call your authentication API endpoint to get user data
          const response = await GetCurrentUser();
          setUser(response.data.user);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError(error);
        } 
      };
  
      fetchUserData();
    }, [setError]);
  
    return { user };
  };


  export default useAuthentication;