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

function Home() {

  const [categories, setCategories] = useState([]);
  const {user} = useAuthentication();


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
        <GainGreenBanner user={user} />
        <PopularItems data={categories} />
        <NewItems data={categories} />
        <RecommendedItems />
        <WhyChooseUs />
        <Footer />
    </>
  )
}

export default Home
