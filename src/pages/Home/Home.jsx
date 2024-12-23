import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import './style.scss'
import HeroBanner from '../../components/HeroBanner'
import Header from '../../layouts/Header'
import GainGreenBanner from '../../components/GainGreenBanner'
import PopularItems from '../../components/PopularItems'
import NewItems from '../../components/NewItems'
import RecommendedItems from '../../components/RecommendedItems'
import WhyChooseUs from '../../components/WhyChooseUs'
import Footer from '../../layouts/Footer'
import SellBtn from '../../components/Button/SellBtn'
import CommunityThumb from '../../assets/images/community-thumbnail.png'

function Home() {

  const categories = useSelector((state) => state.productcategories.data);
  const user = useSelector((state) => state.user.data);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the window was opened as a popup
    if (window.opener) {
      window.opener.location.reload(); // Reload the main window
      window.close(); // Close the popup
    } else {
      navigate('/'); // Navigate to the home page if not a popup
    }
  }, [navigate]);



  const firstRowTopCategories = ["Mobile and Electronics", "Furniture", "Home, Garden & DIY", "Baby & Kids"];
  const secondRowTopCategories = ["Women's Fashion", "Men's Fashion", "Beauty & Personal Care", "Sports & Leisure", "Games, Hobbies & Crafts"];

  // Filter the categories based on the included labels
  const filteredFirstRowCategories = categories.filter(category => firstRowTopCategories.includes(category.label));
  const filteredSecondRowCategories = categories.filter(category => secondRowTopCategories.includes(category.label));



  return (
    <>
      <Header />
      <HeroBanner />
      <div className="top-categories-title"><h3>Top Categories</h3></div>
      <div className="top-category-container">
        <div className="top-category-container-row1">
          <ul>
            <li>
              <Link to={'/forum'}>
                <img src={CommunityThumb} className='top-category-thumbnail-img' alt="" />
                <div className='category-name'>Community</div>
              </Link>
            </li>
            {filteredFirstRowCategories.map((category, index) => (
              <li key={index}>
                <Link to={`/category/${category.id}/${category.label}`}>
                  <img src={category.thumbnail_image} className='top-category-thumbnail-img' alt="" />
                  <div className='category-name'>{category.label}</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="top-category-container-row2">
          <ul>
            {filteredSecondRowCategories.map((category, index) => (
              <li>
                <Link to={`/category/${category.id}/${category.label}`}>
                  <img src={category.thumbnail_image} className='top-category-thumbnail-img' alt="" />
                  <div className='category-name'>{category.label}</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div >
      <GainGreenBanner user={user} />
      <PopularItems data={categories} />
      <NewItems data={categories} />
      <RecommendedItems />
      <WhyChooseUs />
      <Footer />
      <SellBtn />
    </>
  )
}

export default Home
