// userActions.js
import { setUser, setError } from '../reducer/userSlice';
import axios from '../../apicalls/axios';
import { Setloader } from '../../redux/loadersSlice';

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
    dispatch(Setloader(false))
    dispatch(setError('Error fetching user profile.'));
  }
};
