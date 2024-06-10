import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Setloader } from '../../redux/reducer/loadersSlice'
import useAuthentication from '../../hooks/authHook'
import { GetCategoryByID, AddWishlist, RemoveWishlist, GetAllCategories } from '../../apicalls/products';
import './style.scss'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import SubCategoryCarousel from '../../components/Carousel/SubCategoryCarousel'
import CategoryProductFilter from '../../components/ProductFilter/CategoryProductFilter'
import ProductCard from '../../components/Cards/ProductCard'
import Breadcrumb from '../../components/Breadcrumb'
import SellBtn from '../../components/Button/SellBtn'




const MainCategory = ({ userId }) => {

  const { id, value } = useParams();
  const [category, setCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [setErr] = useState(false);
  const dispatch = useDispatch();
  const { user } = useAuthentication();

  const [productStates, setProductStates] = useState({});
  const [wishlistCount, setWishlistCount] = useState({});

  // If parentId is null, use the id as the selected category
  // const selectedCategory = parent_id !== null ? String(parent_id) : String(id);



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


  // const allProducts = useMemo(() => {
  //   const subCategoryProductsArray = Array.isArray(category?.subCategoryProducts) ? category?.subCategoryProducts : [];
  //   const productsArray = Array.isArray(category?.products) ? category?.products : [];
  //   return [...subCategoryProductsArray, ...productsArray];
  // }, [category?.subCategoryProducts, category?.products]);

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



  // useEffect(() => {
  //   const fetchData = async () => {
  //     dispatch(Setloader(true));

  //     try {
  //       // Fetch the category's data
  //       const response = await GetCategoryByID(id, value);

  //       setCategory(response.data);
  //       dispatch(Setloader(false));


  //     } catch (error) {
  //       dispatch(Setloader(false));
  //       console.error('Error fetching category data:', error);

  //       // Check if the error is due to unauthorized access
  //       if (error.response && error.response.status === 500) {
  //         return error.message;
  //         // Handle unauthorized access, e.g., redirect to login
  //       } else {
  //         // Handle other errors
  //         setErr(true); // Depending on your requirements
  //       }
  //     }
  //   };
  //   fetchData();
  // }, [id, value, dispatch, setErr]);



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
              <SubCategoryCarousel data={subcategories} />
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
            </div>
            <div className='main-category-newly-listed-row3'>
              <ProductCard
                data={allProducts || []}
                addToWishlist={addToWishlist}
                removeFromWishlist={removeFromWishlist}
                userId={user?.id}
                wishlistCount={wishlistCount}
                setWishlistCount={setWishlistCount}
                getWishlistCount={getWishlistCount}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <SellBtn />
    </>
  )
}

export default MainCategory