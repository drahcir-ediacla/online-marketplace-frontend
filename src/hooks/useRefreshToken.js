import axios from '../apicalls/axios';

const useRefreshToken = () => {
  const refresh = async () => {
    try {
      const response = await axios.get('/api/refresh', {
        withCredentials: true,
      });
      return response.data; // Return refreshed token or relevant data
    } catch (error) {
      console.error('Error refreshing token:', error);

      // Use a React Router navigation approach if applicable
      window.location.href = '/loginemail'; // Replace with navigate('/loginemail') if using React Router

      throw error; // Rethrow error to handle in calling function
    }
  };

  return refresh;
};

export default useRefreshToken;
