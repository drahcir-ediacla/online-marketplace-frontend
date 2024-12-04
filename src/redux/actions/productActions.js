import { setCategories, setError } from '../reducer/productSlice';
import axios from '../../apicalls/axios';
import {GetAllCategories} from '../../apicalls/products'


// Get Product Categories

export const getAllCategory = () => async (dispatch) => {
  try {
    const response = await GetAllCategories();

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
