import React from 'react'
import './style.scss'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import { Link } from 'react-router-dom'
import ProductCarousel from '../../components/Carousel/ProductCarousel'
import popularItemsData from '../../data/popularItemsData'
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
                <li><Link to='#'>Main Category</Link></li>
                <li>Sub Category</li>
            </ul>
        </div>
        <div className="row2 category-banner">ADS or HTML Description Here</div>
        <div className="sub-categories-container">
            <div className="sub-category-thumbnail">
                <img src={SubCategory1} alt="" className="sub-category-img" />
                <div className="sub-category-thumbnail-name">Iphone & Smartphones</div>
            </div>
            <div className="sub-category-thumbnail">
                <img src={SubCategory2} alt="" className="sub-category-img" />
                <div className="sub-category-thumbnail-name">Computers, Tablets & Network Hardware</div>
            </div>
            <div className="sub-category-thumbnail">
                <img src={SubCategory3} alt="" className="sub-category-img" />
                <div className="sub-category-thumbnail-name">Cameras</div>
            </div>
            <div className="sub-category-thumbnail">
                <img src={SubCategory4} alt="" className="sub-category-img" />
                <div className="sub-category-thumbnail-name">TV, Video & Home Audio</div>
            </div>
            <div className="sub-category-thumbnail">
                <img src={SubCategory5} alt="" className="sub-category-img" />
                <div className="sub-category-thumbnail-name">Headphones</div>
            </div>
            <div className="sub-category-thumbnail">
                <img src={SubCategory6} alt="" className="sub-category-img" />
                <div className="sub-category-thumbnail-name">Vehicle Electronics</div>
            </div>
            <div className="sub-category-thumbnail">
                <img src={SubCategory7} alt="" className="sub-category-img" />
                <div className="sub-category-thumbnail-name">Surveillance & Smart Home Devices</div>
            </div>
        </div>
        <div className="row4">
            <ProductCarousel product={popularItemsData} />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default MainCategory
