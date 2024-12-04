// forumCategoriesActions.js
import { setCategories, setError } from '../reducer/forumCategoriesSlice';
import axios from '../../apicalls/axios';

export const getForumCategories = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/fetchforumcategories'); // Corrected the usage of GetCurrentUser()
    if (response.status === 200) {
      const categoriesData = response.data;
      dispatch(setCategories(categoriesData));
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
    dispatch(setError('Error fetching forum categories.'));
  }
};