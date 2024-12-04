import { setCategories, setError } from '../reducer/productCategoriesSlice';
import axios from '../../apicalls/axios';


// Get Product Categories

export const getProductCategories = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/getallcategories');
    if (response.status === 200) {
      const categoriesData = response.data;
      dispatch(setCategories(categoriesData));
    } 
  } catch (error) {
    console.error('Error fetching categories:', error);

    // Handle the error and update the error state in the Redux store
    dispatch(setError('Error fetching categories.'));
  }
};
