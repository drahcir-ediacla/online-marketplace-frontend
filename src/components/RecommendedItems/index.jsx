import React, { useEffect, useState, useCallback } from 'react'
import axios from '../../apicalls/axios'
import useAuthentication from '../../hooks/authHook';
import './style.scss'
import ProductCard from '../Cards/ProductCard'
import ProductCardSkeleton from '../SkeletonLoader/ProductCardSkeleton';
import BtnCategory from '../../components/Button/BtnCategory'
import BtnSeeMore from '../../components/Button/BtnSeeMore'

const RecommendedItems = ({ userId }) => {

  const [products, setProducts] = useState([]);
  const [err, setErr] = useState(false);
  const { user } = useAuthentication();
  const [loading, setLoading] = useState(true);

  const [productStates, setProductStates] = useState({});
  const [wishlistCount, setWishlistCount] = useState({});


  const addToWishlist = (productId) => {
    axios.post(`/api/addwishlist/product-${productId}`, {})
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error adding item to wishlist:', error);
      });
  };

  const removeFromWishlist = (productId) => {
    axios.post(`/api/removewishlist/product-${productId}`, {})
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error removing item from wishlist:', error);
      });
  };


  useEffect(() => {
    const fetchData = async () => {

      try {
        // Fetch the all product's data
        const response = await axios.get('/api/products/getrandom');

        setProducts(response.data);
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




  // Use useCallback to memoize the function
  const getWishlistCount = useCallback((productId) => {
    const productData = products.find((product) => product.id === productId);
    return productData ? (productData.wishlist ? productData.wishlist.length : 0) : 0;
  }, [products]);

  // Use useEffect to update wishlist count after state changes
  useEffect(() => {
    // Update wishlist count for all products
    const updatedWishlistCounts = {};
    products.forEach((product) => {
      updatedWishlistCounts[product.id] = getWishlistCount(product.id);
    });

    // Set the updated wishlist counts
    setWishlistCount(updatedWishlistCounts);

    console.log('Wishlist count updated:', updatedWishlistCounts);
  }, [productStates, products, getWishlistCount]);



  // Initialize productStates based on initial wishlist data
  useEffect(() => {
    const initialProductStates = {};
    products.forEach((product) => {
      const isProductInWishlist = Array.isArray(product.wishlist) && product.wishlist.some((entry) => String(entry.user_id) === String(userId));
      initialProductStates[product.id] = isProductInWishlist;
    });
    console.log('Initial Product States:', initialProductStates);
    setProductStates(initialProductStates);
  }, [products, userId]);


  // Check if data is null or undefined
  if (!products) {
    return null; // or return some default content or loading indicator
  }


  return (
    <>
      <div className="product-section-container">
        <div className='product-section-title'>
          <h3>Recommended For You</h3>
        </div>
        <div className='product-section-btns'>
          <div className='sub-categories-btn'>
            <BtnCategory label="Shoes" className='active' />
            <BtnCategory label="Mobile" />
            <BtnCategory label="iPhone Accessories" />
            <BtnCategory label="Switch Games" />
            <BtnCategory label="Bicycles" />
            <BtnCategory label="Chanel" />
          </div>
          <BtnSeeMore label="See More Shoes >>" />
        </div>
        <div className='product-cards-container'>
        {loading &&
            <div className='skeleton-card-container'>
              <ProductCardSkeleton card={30} />
            </div>
          }
          <ProductCard
            data={products || []}
            addToWishlist={addToWishlist}
            removeFromWishlist={removeFromWishlist}
            userId={user?.id}
            wishlistCount={wishlistCount}
            setWishlistCount={setWishlistCount}
            getWishlistCount={getWishlistCount}
          />
        </div>
      </div>
    </>
  )
}

export default RecommendedItems
