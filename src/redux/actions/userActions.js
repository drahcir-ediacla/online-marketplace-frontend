// userActions.js
import { setUser, setError } from '../reducer/userSlice';
import axios from '../../apicalls/axios';
import { Setloader } from '../reducer/loadersSlice';

const GET_USER_LOGIN = '/auth/check-auth';

export const fetchUserProfile = () => async (dispatch) => {
  try {
    dispatch(Setloader(true));

    const response = await axios.get(GET_USER_LOGIN, {
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      },
    });

    if (response.status === 200) {
      dispatch(Setloader(false))
      const userData = response.data.user;
      dispatch(setUser(userData));
    } else {
      throw new Error('Authentication has failed!');
    }
  } catch (error) {
    if (error.response) {
      // The request was made, but the server responded with a non-2xx status code
      console.error('Server Error:', error.response.data);
    } else if (error.request) {
      // The request was made, but no response was received
      console.error('No Response from Server');
    } else {
      // Something happened in setting up the request
      console.error('Request Error:', error.message);
    }
    // Handle the error and update the error state in the Redux store
    dispatch(setError('Error updating profile.'));
  }
};


export const updateUserProfile = (userData) => async (dispatch) => {
  try {
    dispatch(Setloader(true));

    const response = await axios.put('/api/updateuser', userData);

    // Check if the server response indicates a successful update
    if (response.status === 200) {
      // Update the user data in the Redux store with the updated data from the server
      dispatch(setUser(response.data.user));
      dispatch(setError(null)); // Clear any previous errors
    } else {
      // Handle cases where the server responds with an error status
      dispatch(setError('Error updating profile: ' + response.data.error));
    }
  } catch (error) {
    // Handle other errors, such as network errors
    dispatch(setError('Error updating profile: ' + error.message));
  } finally {
    dispatch(Setloader(false));
  }
};
