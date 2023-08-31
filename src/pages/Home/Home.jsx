import React, {useEffect} from 'react'
import HeroBanner from '../../components/Hero'
import Header from '../../layouts/Header'
import GainGreenBanner from '../../components/GainGreenBanner'
import PopularItems from '../../components/PopularItems'
import NewItems from '../../components/NewItems'
import RecommendedItems from '../../components/RecommendedItems'
import WhyChooseUs from '../../components/WhyChooseUs'
import Footer from '../../layouts/Footer'

function Home() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <HeroBanner />
      <GainGreenBanner />
      <PopularItems />
      <NewItems />
      <RecommendedItems />
      <WhyChooseUs />
      <Footer />
    </>
  )
}

export default Home
