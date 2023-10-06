// userActions.js
import { setUser, setLoading, setError } from '../reducer/userSlice';
import axios from '../../apicalls/axios';

const GET_USER_LOGIN = '/auth/check-auth';

export const fetchUserProfile = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await axios.get(GET_USER_LOGIN, {
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      },
    });

    if (response.status === 200) {
      const userData = response.data.user;
      dispatch(setUser(userData));
    } else {
      throw new Error('Authentication has failed!');
    }
  } catch (error) {
    dispatch(setError('Error fetching user profile.'));
  }
};
