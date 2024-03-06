import axios from './axios'


// ------------------------ PRODUCTS API ENDPOINT ------------------------ //
export const AddNewProduct = async (payload) => {
  try {
    const response = await axios.post('/api/addnewproduct', payload)
    return response.data;
  } catch (error) {
    return error.message
  }
}

export const GetProductsById = async (id, product_name) => {
  const encodedProductName = encodeURIComponent(product_name);

  try {
    const response = await axios.get(`/api/getproductdetails/${id}/${encodedProductName}`)
    return response
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error; // Propagate the error if needed
  }
}


export const GetAllProducts = async () => {
  try {
    const response = await axios.get('/api/getallproducts')
    return response
  } catch (error) {
    return error
  }
}


export const GetRandomProducts = async () => {
  try {
    const response = await axios.get('/api/products/getrandom')
    return response
  } catch (error) {
    return error
  }
}


// ------------------------ DELETE PRODUCTS BY ID ------------------------ //

export const DeleteProductById = async (productId) => {
  try {
    const response = await axios.delete(`/api/deleteproductbyid/${productId}`)
    return response
  } catch (error) {
    return error
  }
}


// ------------------------ MARK AS SOLD PRODUCT ------------------------ //
export const MarkSoldProduct = async (productId) => {

 
  try {
    const response = await axios.put(`/api/mark-sold/${productId}`)
    return response
  } catch (error) {
    return error
  }
}



// ------------------------ TRACKING PRODUCT VIEWS ------------------------ //
export const trackProductView = async (productId) => {
  try {
    const response = await axios.post(`/api/product/view/${productId}`, {
      id: productId,
    },);

    if (response.data.success) {
      console.log('Product view tracked successfully:', response.data.message);
    } else {
      console.error('Failed to track product view:', response.data.error);
    }
  } catch (error) {
    console.error('Error tracking product view:', error);
  }
};


export const MostViewedProducts = async () => {
  try {
    const response = await axios.get('/api/product/most-viewed');
    return response
  } catch (error) {
    return error
  }
}


export const MostViewedProductsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`/api/category/most-viewed-product/${categoryId}`);
    return response
  } catch (error) {
    return error
  }
}


// ------------------------ CATEGORIES API ENDPOINT ------------------------ //
export const GetAllCategories = async () => {
  try {
    const response = await axios.get('/api/getallcategories')
    return response
  } catch (error) {
    return error
  }
}


export const GetCategoryByID = async (id, value) => {
  try {
    const response = await axios.get(`/api/getcategory/${id}/${value}`)
    return response
  } catch (error) {
    return error
  }
}



// ------------------------ WISHLIST API ENDPOINT ------------------------ //
export const AddWishlist = async (id) => {
  try {
    const response = await axios.post(`/api/addwishlist/product-${id}`)
    return response
  } catch (error) {
    return error
  }
}

export const RemoveWishlist = async (id) => {
  try {
    const response = await axios.post(`/api/removewishlist/product-${id}`)
    return response
  } catch (error) {
    return error
  }
}


export const GetUserWishlist = async (id) => {
  try {
    const response = await axios.get(`/api/getuserwishlist/${id}`)
    return response
  } catch (error) {
    return error
  }
}

