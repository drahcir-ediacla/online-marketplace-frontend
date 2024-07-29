import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import useAuthentication from '../../hooks/authHook'
import { AddWishlist, RemoveWishlist, GetAllCategories } from '../../apicalls/products';
import './style.scss'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import SubSubCategoryCarousel from '../../components/Carousel/SubSubCategoryCarousel';
import CategoryProductFilter from '../../components/ProductFilter/CategoryProductFilter'
import { SmallScreenProductFilter } from '../../components/ProductFilter/SmallScreenProductFilter'
import ProductCard from '../../components/Cards/ProductCard'
import Breadcrumb from '../../components/Breadcrumb'
import SellBtn from '../../components/Button/SellBtn'




const SubCategory = ({ userId }) => {

  const { id, value } = useParams();
  const [category, setCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const { user } = useAuthentication();

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


  const allProducts = Array.isArray(category?.allProducts) ? category?.allProducts : [];
  const subcategories = Array.isArray(category?.subcategories) ? category?.subcategories : [];

  // FETCH ALL CATEGORIES //
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await GetAllCategories();
        console.log('Categories:', response.data);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCategories();
  }, []);




  // Use useCallback to memoize the function
  const getWishlistCount = useCallback((productId) => {
    const productData = allProducts.find((product) => product.id === productId);
    return productData ? (productData.wishlist ? productData.wishlist.length : 0) : 0;
  }, [allProducts]);

  // Use useEffect to update wishlist count after state changes
  useEffect(() => {
    // Update wishlist count for all products
    const updatedWishlistCounts = {};
    allProducts.forEach((product) => {
      updatedWishlistCounts[product.id] = getWishlistCount(product.id);
    });

    // Set the updated wishlist counts
    setWishlistCount(updatedWishlistCounts);

    console.log('Wishlist count updated:', updatedWishlistCounts);
  }, [productStates, allProducts, getWishlistCount]);



  // Initialize productStates based on initial wishlist data
  useEffect(() => {
    const initialProductStates = {};
    allProducts.forEach((product) => {
      const isProductInWishlist = Array.isArray(product.wishlist) && product.wishlist.some((entry) => String(entry.user_id) === String(userId));
      initialProductStates[product.id] = isProductInWishlist;
    });
    console.log('Initial Product States:', initialProductStates);
    setProductStates(initialProductStates);
  }, [allProducts, userId]);



  return (
    <>
      <Header />
      <div className='container'>
        <div className='main-category-body'>
          <div className="row1">
            <Breadcrumb categories={categories} selectedCategory={id} />
          </div>
          <div className="row2 main-category-banner">ADS or HTML Description Here</div>
          {subcategories && subcategories.length > 0 && (
            <div className="sub-categories-container">
              <SubSubCategoryCarousel data={subcategories} />
            </div>
          )}
          <div className="row4 main-category-newly-listed">
            <div className="main-category-newly-listed-row1">
              <div className='product-section-title'>
                <h3>{category?.label}</h3>
              </div>
            </div>
            <div className='main-category-newly-listed-row2'>
              <CategoryProductFilter
                categoryId={id}
                value={value}
                updateCategoryData={setCategory}
              />
              <SmallScreenProductFilter
                categoryId={id}
                value={value}
                updateCategoryData={setCategory}
              />
            </div>
            <div className='main-category-newly-listed-row3'>
              {allProducts.length > 0 ? (
                <ProductCard
                  data={allProducts || []}
                  addToWishlist={addToWishlist}
                  removeFromWishlist={removeFromWishlist}
                  userId={user?.id}
                  wishlistCount={wishlistCount}
                  setWishlistCount={setWishlistCount}
                  getWishlistCount={getWishlistCount}
                />
              ) : (
                <>
                  <h4>No result found!</h4>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
      <Footer />
      <SellBtn />
    </>
  )
}

export default SubCategory