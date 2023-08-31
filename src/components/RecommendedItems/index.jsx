import React from 'react'
import './style.scss'
import ProductCard from '../Cards/ProductCard'
import recommendedItemsData from '../../data/recommendedItemsData'
import BtnCategory from '../../components/Button/BtnCategory'
import BtnSeeMore from  '../../components/Button/BtnSeeMore'

const RecommendedItems = () => {
  return (
    <>
      <div className="product-section-container">
        <div className='product-section-title'>
            <h3>Recommended For You</h3>
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
        <div className='product-cards-container'>
            <ProductCard product={recommendedItemsData} />
        </div>
      </div>
    </>
  )
}

export default RecommendedItems
