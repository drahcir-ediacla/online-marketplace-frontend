import axios from './axios'

export const GetAllCategories = async() => {
    try{
        const response = await axios.get('/api/getallcategories')
        return response
    } catch(error) {
        return error
    }
}


// Track Product Views
export const trackProductView = async (productId) => {
    try {
      const response = await axios.post(`/api/product/view/${productId}`, {
        id: productId,
      }, );
  
      if (response.data.success) {
        console.log('Product view tracked successfully:', response.data.message);
      } else {
        console.error('Failed to track product view:', response.data.error);
      }
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  };
  