import React from 'react'
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
                    <h3>Newly Listed  Mobiles & Electronics</h3>
                </div>
                <BtnSeeMore label="See More >>" />
            </div>
            <ProductCarousel product={newMobileElectronicsData} />
        </div>
        <div className="row5 main-category-center-ads">Your Ads Here</div>
        <div className="row6 main-category-newly-listed">
            <div className="main-category-newly-listed-row1">
                <div className='product-section-title'>
                    <h3>Popular Cell Phones</h3>
                </div>
                <BtnSeeMore label="See More Shoes >>" />
            </div>
            <ProductCarousel product={newMobileElectronicsData} />
        </div>
        <RecommendedItems />
      </div>
      <Footer />
    </>
  )
}

export default MainCategory
