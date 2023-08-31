import React from 'react'
import {Link} from 'react-router-dom'
import './style.scss'
import Logo from '../../assets/images/Yogeek-logo.png';

const Footer = () => {
  return (
    <>
      <footer>
        <div className="container">
            <div className='row1'>
                <div className='col1'>
                    <Link to='/'>
                        <img src={Logo} alt="" />
                    </Link>
                    <p>Our Purpose Is To Sustainable Make The Pleasure and Benefits of Marketplace to the Many.</p>
                </div>
                <div className='col2'>
                    <h5>Company</h5>
                    <ul>
                        <li>About Us</li>
                        <li>Delivery Information</li>
                        <li>Terms & Conditions</li>
                        <li>Customer Service</li>
                        <li>Privacy Policy</li>
                        <li>Return Policy</li>
                        <li>Join Affiliate</li>
                    </ul>
                </div>
                <div className='col3'>
                <h5>Services</h5>
                    <ul>
                        <li>Payment</li>
                        <li>Feedback</li>
                        <li>Contact Us</li>
                        <li>Our Services</li>
                        <li>FAQ</li>
                        <li>Sitemap</li>
                    </ul>
                </div>
                <div className='col4'>
                <h5>Useful Links</h5>
                    <ul>
                        <li>Coupons</li>
                        <li>Blog Post</li>
                        <li>Return Policy</li>
                        <li>Join Affiliate</li>
                    </ul>
                </div>
            </div>
        </div>
        <div className='copyright'>
                <span>Copyright 2023 - Yogeek</span>
            </div>
      </footer>
    </>
  )
}

export default Footer
