import React from 'react'
import './style.scss'
import ProductCard from '../Cards/ProductCard'
import relatedListingsData from '../../data/relatedListingsData'
import BtnCategory from '../Button/BtnCategory'
import BtnSeeMore from  '../Button/BtnSeeMore'

const RelatedListings = () => {
  return (
    <>
      <div className="product-section-container">
        <div className='product-section-title'>
            <h3>Related Listings</h3>
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
            <ProductCard data={relatedListingsData} />
        </div>
      </div>
    </>
  )
}

export default RelatedListings
