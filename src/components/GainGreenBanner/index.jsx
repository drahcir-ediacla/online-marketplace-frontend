import React from 'react'
import './style.scss'
import { Link } from 'react-router-dom'
import DollarBox from '../../assets/images/dollar-box.png'
import SellArrow from '../../assets/images/sell-arrow.png'

const GainGreenBanner = ({ user }) => {
  return (
    <>
      <div className="container">
        <div className="contentbox">
          <div className="col-left">
            <div className='dollar-box'><img src={DollarBox} alt="" /></div>
            <h2>Gain more green, earn money quickly.</h2>
          </div>
          <div className="col-right">
            <Link to={`${user ? '/addlisting' : '/loginemail'}`} className="gain-more-btn">
              <h5>Sell Now</h5>
              <div className='sell-arrow'><img src={SellArrow} alt="" /></div>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default GainGreenBanner
