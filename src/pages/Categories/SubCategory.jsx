import React, { useEffect, useState, useCallback, useMemo } from 'react'
import axios from '../../apicalls/axios'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Setloader } from '../../redux/reducer/loadersSlice'
import useAuthentication from '../../hooks/authHook'
import './style.scss'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import { Link } from 'react-router-dom'
import CategoryProductFilter from '../../components/ProductFilter/CategoryProductFilter'
import ProductCard from '../../components/Cards/ProductCard'

const SubCategory = ({ userId }) => {

  const { id, label } = useParams();
  const [category, setCategory] = useState([]);
  const [err, setErr] = useState(false);
  const dispatch = useDispatch();
  const { user } = useAuthentication();

  const [productStates, setProductStates] = useState({});
  const [wishlistCount, setWishlistCount] = useState({});


// Add and remove wishlist function
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
      dispatch(Setloader(true));

      try {
        // Fetch the category's data
        const response = await axios.get(`/api/getcategory/${id}/${label}`);
        console.log('Sub API Response:', response.data);
        setCategory(response.data);
        dispatch(Setloader(false));

      } catch (error) {
        dispatch(Setloader(false));
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
  }, [id, label, dispatch])


  const products = useMemo(() => Array.isArray(category.products) ? category.products : [], [category.products]);



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
              <h3>{category.label}</h3>
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

export default SubCategory