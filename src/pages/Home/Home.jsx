import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './style.scss'
import { GetAllCategories } from '../../apicalls/products'
import HeroBanner from '../../components/HeroBanner'
import Header from '../../layouts/Header'
import GainGreenBanner from '../../components/GainGreenBanner'
import PopularItems from '../../components/PopularItems'
import NewItems from '../../components/NewItems'
import RecommendedItems from '../../components/RecommendedItems'
import WhyChooseUs from '../../components/WhyChooseUs'
import Footer from '../../layouts/Footer'
import useAuthentication from '../../hooks/authHook'
import SellBtn from '../../components/Button/SellBtn'

function Home() {

  const [categories, setCategories] = useState([]);
  const { user } = useAuthentication();


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await GetAllCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchCategories();
  }, [])

  const firstRowTopCategories = ["Mobile and Electronics", "Furniture", "Home, Garden & DIY", "Baby & Kids", "Women's Fashion"];
  const secondRowTopCategories = ["Men's Fashion", "Beauty & Personal Care", "Sports & Leisure", "Games, Hobbies & Crafts", "Book, Music & Tickets"];

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
