import React from 'react'
import './style.scss'
import popularItemsData from '../../data/popularItemsData'
import ProductCarousel from '../../components/Carousel/ProductCarousel'
import BtnSeeMore from '../../components/Button/BtnSeeMore'


const SubCategoryItems = () => {
  return (
    <>
      <div className="product-section-container">
        <div className='product-section-title'>
            <h3>Popular Items</h3>
        </div>
        <div className='product-section-btns'>
          <BtnSeeMore label="See More Shoes >>" />
        </div>
        <div>
          <ProductCarousel product={popularItemsData} />
        </div>
      </div>
    </>
  )
}

export default SubCategoryItems
