import React, { useEffect, useState, useCallback } from 'react'
import axios from '../../apicalls/axios'
import { useLocation } from 'react-router-dom'
import useAuthentication from '../../hooks/authHook'
import { AddWishlist, RemoveWishlist } from '../../apicalls/products';
import './style.scss'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import { Link } from 'react-router-dom'
import CategoryProductFilter from '../../components/ProductFilter/CategoryProductFilter'
import ProductCard from '../../components/Cards/ProductCard'

const SearchResult = ({ userId }) => {

  const location = useLocation();
  const [products, setProducts] = useState([]);
  const { user } = useAuthentication();

  const [productStates, setProductStates] = useState({});
  const [wishlistCount, setWishlistCount] = useState({});

  const searchTerm = new URLSearchParams(location.search).get('keyword');

  useEffect(() => {

  const fetchSearchResults = async () => {

    // const product_name = searchTerm; // Replace with the actual search term entered by the user
    
    try {
      const response = await axios.get(`/api/search?keyword=${searchTerm}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error searching items:', error);
    }
  };

  fetchSearchResults();
  }, [location.search, searchTerm]);


  
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


  return (
    <>
      <Header />
      <div className='container sub-category-body'>
        <div className="row1">
          <ul className='breadcrumb'>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/MainCategory'>Mobiles & Electronics</Link></li>
            <li>Headphones</li>
          </ul>
        </div>
        <div className="row2 sub-category-banner">Your ADS Here</div>
        <div className="row3 sub-category-newly-listed">
          <div className="sub-category-newly-listed-row1">
            <div className='product-section-title'>
              <h4>Search Results for "{searchTerm}"</h4>
              <h5>Total Results: {products.length > 50 ? `${products.length}+` : products.length}</h5>
            </div>
          </div>
          <div className='sub-category-newly-listed-row2'><CategoryProductFilter /></div>
          <div className='sub-category-newly-listed-row3'>
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
      <Footer />
    </>
  )
}

export default SearchResult