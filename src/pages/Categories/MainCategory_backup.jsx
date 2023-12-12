import React, { useEffect, useState } from 'react'
import axios from '../../apicalls/axios'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Setloader } from '../../redux/reducer/loadersSlice'
import './style.scss'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import { Link } from 'react-router-dom'
import newMobileElectronicsData from '../../data/newMobileElectronicsData.json'
import ProductCarousel from '../../components/Carousel/ProductCarousel'
import RecommendedItems from '../../components/RecommendedItems'
import BtnSeeMore from '../../components/Button/BtnSeeMore'
import SubCategory1 from '../../assets/images/sub-category-1.png'
import SubCategory2 from '../../assets/images/sub-category-2.png'
import SubCategory3 from '../../assets/images/sub-category-3.png'
import SubCategory4 from '../../assets/images/sub-category-4.png'
import SubCategory5 from '../../assets/images/sub-category-5.png'
import SubCategory6 from '../../assets/images/sub-category-6.png'
import SubCategory7 from '../../assets/images/sub-category-7.png'


const MainCategory = () => {

  const { id, label } = useParams();
  const [category, setCategory] = useState([]);
  const [setErr] = useState(false);
  const dispatch = useDispatch();


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



  const subCategoryProducts = Array.isArray(category.subCategoryProducts) ? category.subCategoryProducts : [];
  const products = Array.isArray(category.products) ? category.products : [];
  const allProducts = [...subCategoryProducts, ...products];

  useEffect(() => {
    const fetchData = async () => {
      dispatch(Setloader(true));

      try {
        // Fetch the category's data
        const response = await axios.get(`/api/getcategory/${id}/${label}`);

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


  return (
    <>
      <Header />
      <div className='container main-category-body'>
        <div className="row1">
          <ul className='breadcrumb'>
            <li><Link to='/'>Home</Link></li>
            <li>Mobiles & Electronics</li>
          </ul>
        </div>
        <div className="row2 main-category-banner">ADS or HTML Description Here</div>
        <div className="row3 sub-categories-container">
          <Link to='/SubCategory' className="sub-category-thumbnail">
            <img src={SubCategory1} alt="" className="sub-category-img" />
            <div className="sub-category-thumbnail-name">Iphone & Smartphones</div>
          </Link>
          <Link to='/SubCategory' className="sub-category-thumbnail">
            <img src={SubCategory2} alt="" className="sub-category-img" />
            <div className="sub-category-thumbnail-name">Computers, Tablets & Network Hardware</div>
          </Link>
          <Link to='/SubCategory' className="sub-category-thumbnail">
            <img src={SubCategory3} alt="" className="sub-category-img" />
            <div className="sub-category-thumbnail-name">Cameras</div>
          </Link>
          <Link to='/SubCategory' className="sub-category-thumbnail">
            <img src={SubCategory4} alt="" className="sub-category-img" />
            <div className="sub-category-thumbnail-name">TV, Video & Home Audio</div>
          </Link>
          <Link to='/SubCategory' className="sub-category-thumbnail">
            <img src={SubCategory5} alt="" className="sub-category-img" />
            <div className="sub-category-thumbnail-name">Headphones</div>
          </Link>
          <Link to='/SubCategory' className="sub-category-thumbnail">
            <img src={SubCategory6} alt="" className="sub-category-img" />
            <div className="sub-category-thumbnail-name">Vehicle Electronics</div>
          </Link>
          <Link to='/SubCategory' className="sub-category-thumbnail">
            <img src={SubCategory7} alt="" className="sub-category-img" />
            <div className="sub-category-thumbnail-name">Surveillance & Smart Home Devices</div>
          </Link>
        </div>
        <div className="row4 main-category-newly-listed">
          <div className="main-category-newly-listed-row1">
            <div className='product-section-title'>
              <h3>Newly Listed  {category.label}</h3>
            </div>
            <BtnSeeMore label="See More >>" />
          </div>
          <ProductCarousel data={allProducts} addToWishlist={addToWishlist}
                removeFromWishlist={removeFromWishlist} />

        </div>
        <div className="row5 main-category-center-ads">Your Ads Here</div>
        <div className="row6 main-category-newly-listed">
          <div className="main-category-newly-listed-row1">
            <div className='product-section-title'>
              <h3>Popular Cell Phones</h3>
            </div>
            <BtnSeeMore label="See More Shoes >>" />
          </div>
          <ProductCarousel data={newMobileElectronicsData} />
        </div>
        <RecommendedItems />
      </div>
      <Footer />
    </>
  )
}

export default MainCategory
