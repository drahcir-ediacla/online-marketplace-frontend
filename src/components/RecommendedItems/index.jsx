import React, { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux';
import axios from '../../apicalls/axios';
import { AddWishlist, RemoveWishlist } from '../../apicalls/products';
import './style.scss'
import ProductCard from '../Cards/ProductCard'
import ProductCardSkeleton from '../SkeletonLoader/ProductCardSkeleton';

const RecommendedItems = ({ userId }) => {

  const [products, setProducts] = useState([]);
  console.log('products:', products)
  const [offset, setOffset] = useState(0);
  const [limit] = useState(30); // Fixed limit for each request
  const [hasMore, setHasMore] = useState(true);
  const user = useSelector((state) => state.user.data)
  const [loading, setLoading] = useState(true);

  const [productStates, setProductStates] = useState({});
  const [wishlistCount, setWishlistCount] = useState({});



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


  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/products/getrandom?offset=${offset}&limit=${limit}`);
      if (response.data.length === 0) {
        // If no new products, stop further requests
        setHasMore(false);
      } else {
        setProducts(prevProducts => [...prevProducts, ...response.data]); // Append new products
        setOffset(prevOffset => prevOffset + limit); // Increment offset for next batch
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching category data:', error);
      // Handle errors as per your requirement
    }
  };


  useEffect(() => {
    // Fetch initial data when the component mounts
    fetchData();
  }, []); // Empty dependency array means it will run once when the component mounts


  const handleLoadMore = () => {
    fetchData(); // Load next batch of products
  };


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
        {/* <div className='product-section-btns'>
          <div className='sub-categories-btn'>
            <BtnCategory label="Shoes" className='active' />
            <BtnCategory label="Mobile" />
            <BtnCategory label="iPhone Accessories" />
            <BtnCategory label="Switch Games" />
            <BtnCategory label="Bicycles" />
            <BtnCategory label="Chanel" />
          </div>
          <BtnSeeMore label="See More Shoes >>" />
        </div> */}
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
        <div className="load-more-button-container">
          {loading && <p>Loading...</p>}
          {!loading && hasMore && <button onClick={handleLoadMore} className="load-more-button">Load More Items</button>}
          {!hasMore && <p>No more item to load</p>}
        </div>
      </div>
    </>
  )
}

export default RecommendedItems