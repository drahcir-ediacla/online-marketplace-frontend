import { setTags, setError } from '../reducer/forumTagsSlice';
import axios from '../../apicalls/axios';


// Get Forum Tags
export const getAllForumTags = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/fetchforumtags');
    if (response.status === 200) {
      const forumTagsData = response.data;
      dispatch(setTags(forumTagsData));
    } 
  } catch (error) {
    console.error('Error fetching forum tags:', error);

    // Handle the error and update the error state in the Redux store
    dispatch(setError('Error fetching forum tags.'));
  }
};
