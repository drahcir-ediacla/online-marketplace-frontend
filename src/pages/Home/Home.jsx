import React, { useEffect, useState } from 'react'
import './style.scss'
import { GetAllCategories } from '../../apicalls/products'
import HeroBanner from '../../components/Hero'
import Header from '../../layouts/Header'
import GainGreenBanner from '../../components/GainGreenBanner'
import PopularItems from '../../components/PopularItems'
import NewItems from '../../components/NewItems'
import RecommendedItems from '../../components/RecommendedItems'
import WhyChooseUs from '../../components/WhyChooseUs'
import Footer from '../../layouts/Footer'

function Home() {

  const [categories, setCategories] = useState([]);


  useEffect(() => {
    const fetchCategories = async() => {
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
        <GainGreenBanner />
        <PopularItems />
        <NewItems data={categories} />
        <RecommendedItems />
        <WhyChooseUs />
        <Footer />
    </>
  )
}

export default Home
