import { setCategories, setError } from '../reducer/categorySlice';
import axios from '../../apicalls/axios';


// Get Product Categories

export const getProductCategory = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/getProductCategories');

    if (response.status === 200) {
      const categoriesData = response.data;
      dispatch(setCategories(categoriesData));
    } else {
      throw new Error('Failed to fetch categories.');
    }
  } catch (error) {
    console.error('Error fetching categories:', error);

    // Handle the error and update the error state in the Redux store
    dispatch(setError('Error fetching categories.'));
  }
};
