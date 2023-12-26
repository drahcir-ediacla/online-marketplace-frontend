import { useState, useEffect } from 'react';
import { GetCurrentUser } from '../apicalls/users';


const useAuthentication = () => {
    const [auth, setAuth ] = useState(null);
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          // Call your authentication API endpoint to get user data
          const response = await GetCurrentUser();
          setAuth(response.data);
          console.log('data:', response.data)
        } catch (error) {
          console.error('Error fetching user data:', error);
        } 
      };
  
      fetchUserData();
    }, []);
  
    return { auth, setAuth };
  };


  export default useAuthentication;