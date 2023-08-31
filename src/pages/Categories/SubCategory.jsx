import React from 'react'
import './style.scss'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import { Link } from 'react-router-dom'
import CategoryProductFilter from '../../components/ProductFilter/CategoryProductFilter'
import subcategoryItemsData from '../../data/subcategoryItemsData.json'
import ProductCard from '../../components/Cards/ProductCard'

const SubCategory = () => {
  return (
    <>
      <Header />
      <div className='container sub-category-body'>
        <div className="row1">
            <ul className='breadcrumb'>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/MainCategory'>Mobiles & Electronics</Link></li>
                <li>Headphones</li>
            </ul>
        </div>
        <div className="row2 sub-category-banner">Your ADS Here</div>
        <div className="row3 sub-category-newly-listed">
            <div className="sub-category-newly-listed-row1">
                <div className='product-section-title'>
                    <h3>Headphones</h3>
                </div>
            </div>
            <div className='sub-category-newly-listed-row2'><CategoryProductFilter /></div>
            <div className='sub-category-newly-listed-row3'><ProductCard product={subcategoryItemsData} /></div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default SubCategory
