import React, { useEffect, useState } from 'react'
import useAuthentication from '../../hooks/authHook';
import { MostViewedProducts, AddWishlist, RemoveWishlist } from '../../apicalls/products';
import './style.scss'
import BtnCategory from  '../../components/Button/BtnCategory'
import BtnSeeMore from '../../components/Button/BtnSeeMore'
import ProductCarousel from '../../components/Carousel/ProductCarousel'
import ProductCardSkeleton from '../SkeletonLoader/ProductCardSkeleton'

const PopularItems = () => {

  const [products, setProducts] = useState([]);
  const [err, setErr] = useState(false);
  const { user } = useAuthentication();
  const [loading, setLoading] = useState(true);


  // Add and remove wishlist function
  const addToWishlist = async (productId) => {
    try {
      const response = await AddWishlist(productId, {});
      console.log(response.data);
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await RemoveWishlist(productId, {});
      console.log(response.data);
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {

      try {
        // Fetch the category's data
        const response = await MostViewedProducts();

        // Limit the number of items to the first 5
        const limitedData = response.data.slice(0, 20);

        setProducts(limitedData);
        setLoading(false)

      } catch (error) {
        setLoading(false)
        console.error('Error fetching category data:', error);

        // Check if the error is due to unauthorized access
        if (error.response && error.response.status === 500) {
          return error.message
          // Handle unauthorized access, e.g., redirect to login
        } else {
          // Handle other errors
          setErr(true); // Depending on your requirements
        }
      }
    }
    fetchData();
  }, [])


  // Check if data is null or undefined
  if (!products) {
    return null; // or return some default content or loading indicator
  }



  return (
    <>
      <div className="product-section-container">
        <div className='product-section-title'>
            <h3>Popular Items</h3>
        </div>
        <div className='product-section-btns'>
          <div className='sub-categories-btn'>
            <BtnCategory label="Men's Footwear" className='active' />
            <BtnCategory label="Women's Footwear" />
            <BtnCategory label="iPhone Accessories" />
            <BtnCategory label="Mobile Phones" />
            <BtnCategory label="Furniture" />
            <BtnCategory label="Computers" />
          </div>
          <BtnSeeMore label="See More Shoes >>" />
        </div>
        <div>
        {loading &&
            <div className='skeleton-card-container'>
              <ProductCardSkeleton card={5} />
            </div>
          }
        <ProductCarousel data={products} addToWishlist={addToWishlist}
            removeFromWishlist={removeFromWishlist} userId={user?.id || ''} />
        </div>
      </div>
    </>
  )
}

export default PopularItems
