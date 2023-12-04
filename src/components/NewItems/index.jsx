import React from 'react'
import './style.scss'
import newItemsData from '../../data/newItemsData'
import ProductCarousel from '../../components/Carousel/ProductCarousel'
import BtnCategory from  '../../components/Button/BtnCategory'
import BtnSeeMore from  '../../components/Button/BtnSeeMore'

const NewItems = () => {
  return (
    <>
      <div className="product-section-container">
        <div className='product-section-title'>
            <h3>Newly Listed Items</h3>
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
        <ProductCarousel data={newItemsData} />
        </div>
      </div>
    </>
  )
}

export default NewItems
