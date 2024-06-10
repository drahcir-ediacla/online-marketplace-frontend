import React, { useEffect, useState } from 'react'
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
import thumbnailPic from '../../assets/images/sub-category-1.png'

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


  return (
    <>
      <Header />
      <HeroBanner />
      <div className="top-category-container">
        <div className="top-category-container-row1">
          <ul>
            <li>
              <img src={thumbnailPic} className='top-category-thumbnail-img' alt="" />
              <div className='category-name'>Mobile and Electronics</div>
            </li>
            <li>
              <img src={thumbnailPic} className='top-category-thumbnail-img' alt="" />
              <div className='category-name'>Furniture</div>
            </li>
            <li>
              <img src={thumbnailPic} className='top-category-thumbnail-img' alt="" />
              <div className='category-name'>Women's Fashion</div>
            </li>
            <li>
              <img src={thumbnailPic} className='top-category-thumbnail-img' alt="" />
              <div className='category-name'>Men's Fashion</div>
            </li>
            <li>
              <img src={thumbnailPic} className='top-category-thumbnail-img' alt="" />
              <div className='category-name'>Sports & Leisure</div>
            </li>
          </ul>
        </div>
        <div className="top-category-container-row2">
          <ul>
            <li>
              <img src={thumbnailPic} className='top-category-thumbnail-img' alt="" />
              <div className='category-name'>Games, Hobbies & Crafts</div>
            </li>
            <li>
              <img src={thumbnailPic} className='top-category-thumbnail-img' alt="" />
              <div className='category-name'>Mobile and Electronics</div>
            </li>
            <li>
              <img src={thumbnailPic} className='top-category-thumbnail-img' alt="" />
              <div className='category-name'>Mobile and Electronics</div>
            </li>
            <li>
              <img src={thumbnailPic} className='top-category-thumbnail-img' alt="" />
              <div className='category-name'>Mobile and Electronics</div>
            </li>
            <li>
              <img src={thumbnailPic} className='top-category-thumbnail-img' alt="" />
              <div className='category-name'>Mobile and Electronics</div>
            </li>
          </ul>
        </div>
      </div>
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
