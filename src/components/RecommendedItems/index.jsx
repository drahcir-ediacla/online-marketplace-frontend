import React, { useEffect, useState, useCallback } from 'react'
import useAuthentication from '../../hooks/authHook';
import { GetRandomProducts, AddWishlist, RemoveWishlist } from '../../apicalls/products';
import './style.scss'
import ProductCard from '../Cards/ProductCard'
import ProductCardSkeleton from '../SkeletonLoader/ProductCardSkeleton';
import BtnCategory from '../../components/Button/BtnCategory'
import BtnSeeMore from '../../components/Button/BtnSeeMore'

const RecommendedItems = ({ userId }) => {

  const [products, setProducts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const { user } = useAuthentication();
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


  const fetchData = async (pageNumber, pageSize) => {
    try {
      const response = await GetRandomProducts(pageNumber, pageSize);
      setProducts(prevProducts => [...prevProducts, ...response.data]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching category data:', error);
      // Handle errors as per your requirement
    }
  };


  useEffect(() => {
    // Fetch initial data when the component mounts
    fetchData(pageNumber, pageSize);
  }, []); // Empty dependency array means it will run once when the component mounts


  // Function to handle "Load More" button click
  const handleLoadMoreClick = () => {
    setPageNumber(prevPageNumber => prevPageNumber + 1); // Increment the page number
  };

  useEffect(() => {
    // Fetch data when pageNumber changes
    fetchData(pageNumber, pageSize);
  }, [pageNumber, pageSize]);


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
        <div className="load-more-button-container">
          <button onClick={handleLoadMoreClick} className="load-more-button">
            Load More Items
          </button>
        </div>
      </div>
    </>
  )
}

export default RecommendedItems