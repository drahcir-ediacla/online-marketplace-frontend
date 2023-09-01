import React from "react";
import './style.scss'
import {Link} from 'react-router-dom'
import subcategoryItemsData from '../../data/subcategoryItemsData.json'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import ProductCard from '../../components/Cards/ProductCard'

const Wishlist = () => {

    return (
        <>
            <Header />
            <div className='container wishlist-body'>
                <div className="wishlist-row1">
                    <ul className='breadcrumb'>
                        <li><Link to='/'>Home</Link></li>
                        <li>Wishlist</li>
                    </ul>
                </div>
                <div className="wishlist-row2">
                    <div className='wishlist-title'>
                        <h3>My Wishlist</h3>
                    </div>
                    <div className='wishlist-items'><ProductCard product={subcategoryItemsData} /></div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Wishlist