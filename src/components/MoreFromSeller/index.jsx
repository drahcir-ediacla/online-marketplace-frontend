import React, { useEffect, useState } from 'react'
import useAuthentication from '../../hooks/authHook';
import { AddWishlist, RemoveWishlist } from '../../apicalls/products';
import { GetUserById } from '../../apicalls/users'
import './style.scss'
import ProductCarousel from '../../components/Carousel/ProductCarousel'
import ProductCardSkeleton from '../SkeletonLoader/ProductCardSkeleton'

const PopularItems = ({ data }) => {

  const { user } = useAuthentication();
  const [loading, setLoading] = useState(true);
  const [sellerListings, setSellerListins] = useState([]);
  const userId = data.seller_id;



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

        // Fetch the product data based on the categoryId
        const response = await GetUserById(userId);

        // Update the categoryData state with the fetched data
        setSellerListins(response.data.products);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching product data:', error);
      }
    };

    fetchData();
  }, []);



  return (
    <>
      <div className="product-section-container">
        <div className='product-section-title'>
          <h3>More From Seller</h3>
        </div>
        <div>
          {loading &&
            <div className='skeleton-card-container'>
              <ProductCardSkeleton card={5} />
            </div>
          }
          <ProductCarousel data={sellerListings} addToWishlist={addToWishlist}
            removeFromWishlist={removeFromWishlist} userId={user?.id || ''} />
        </div>
      </div>
    </>
  )
}

export default PopularItems
