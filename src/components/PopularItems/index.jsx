import React from 'react'
import './style.scss'
import BtnCategory from  '../../components/Button/BtnCategory'
import BtnSeeMore from '../../components/Button/BtnSeeMore'
import ProductCarousel from '../../components/Carousel/ProductCarousel'
import popularItemsData from '../../data/popularItemsData'

const PopularItems = () => {
  return (
    <>
      <div className="product-section-container">
        <div className='product-section-title'>
            <h3>Popular Items</h3>
        </div>
        <div className='product-section-btns'>
          <div className='sub-categories-btn'>
            <BtnCategory label="Shoes" className='active' />
            <BtnCategory label="Mobile" />
            <BtnCategory label="iPhone Accessories" />
            <BtnCategory label="Switch Games" />
            <BtnCategory label="Bicycles" />
            <BtnCategory label="Chanel" />
          </div>
          <BtnSeeMore label="See More Shoes >>" />
        </div>
        <div>
          <ProductCarousel product={popularItemsData} />
        </div>
      </div>
    </>
  )
}

export default PopularItems
