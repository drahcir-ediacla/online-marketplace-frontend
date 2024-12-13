import React, { useEffect, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux';
import useAuthentication from '../../hooks/authHook'
import { AddWishlist, RemoveWishlist } from '../../apicalls/products';
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import SearchResultFilter from '../../components/ProductFilter/SearchResultFilter'
import ProductCard from '../../components/Cards/ProductCard'
import './style.scss'

const SearchResult = () => {

  const location = useLocation();
  const user = useSelector((state) => state.user.data);
  const [products, setProducts] = useState([]);

  // const [productStates, setProductStates] = useState({});
  const [wishlistCount, setWishlistCount] = useState({});

  const searchTerm = new URLSearchParams(location.search).get('keyword');
  const searchFilterLocation = new URLSearchParams(location.search).get('location');
  const latitude = new URLSearchParams(location.search).get('latitude');
  const longitude = new URLSearchParams(location.search).get('longitude');
  const radius = new URLSearchParams(location.search).get('radius');


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
  }, [products, getWishlistCount]);



  // Initialize productStates based on initial wishlist data
  // useEffect(() => {
  //   const initialProductStates = {};
  //   products.forEach((product) => {
  //     const isProductInWishlist = Array.isArray(product.wishlist) && product.wishlist.some((entry) => String(entry.user_id) === String(userId));
  //     initialProductStates[product.id] = isProductInWishlist;
  //   });
  //   console.log('Initial Product States:', initialProductStates);
  //   setProductStates(initialProductStates);
  // }, [products, userId]);


  return (
    <>
      <Header />
      <div className='container'>
        <div className='search-result-body'>
          <div className="row2 search-result-banner">Your ADS Here</div>
          <div className="row3 search-result-newly-listed">
            <div className="search-result-newly-listed-row1">
              <div className='product-section-title'>
                <h4>Search Results for "{searchTerm}" in {searchFilterLocation}</h4>
                <h5>Total Results: {products.length > 50 ? `${products.length}+` : products.length}</h5>
              </div>
            </div>
            <div className='search-result-newly-listed-row2'>
              <SearchResultFilter 
              searchTerm={searchTerm}
              searchFilterLocation={searchFilterLocation}
              searchResultsData={setProducts}
              latitude={latitude}
              longitude={longitude}
              radius={radius}
              />
              </div>
            <div className='search-result-newly-listed-row3'>
              <ProductCard
                data={products || []}
                addToWishlist={addToWishlist}
                removeFromWishlist={removeFromWishlist}
                userId={user?.id}
                wishlistCount={wishlistCount}
                setWishlistCount={setWishlistCount}
                getWishlistCount={getWishlistCount}
              /></div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default SearchResult