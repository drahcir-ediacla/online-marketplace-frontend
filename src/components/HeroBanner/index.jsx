import React from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './style.scss';
import BtnClear from '../Button/BtnClear';

const HeroBanner = () => {

  const options = {
    items: 1,
    loop: true,
    margin: 0,
    autoplay: true,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    autoplayTimeout: 5000,
    autoplayHoverPause: false,
  }


  return (
    <>
      <div className="container">
        <div className="hero-banner">
          <OwlCarousel className='owl-theme' {...options}>
            <div class='item hero-banner-one'>
              <div className='text-container'>
                <h1>Your One-Stop-Shop Buy and Sell for all Gadget Needs</h1>
                <BtnClear label='Start Selling' className='hero-btn' />
              </div>
            </div>
            <div class='item hero-banner-one'>
              <div className='text-container'>
                <h1>Your One-Stop-Shop Buy and Sell for all Gadget Needs</h1>
                <BtnClear label='Start Selling' className='hero-btn' />
              </div>
            </div>
          </OwlCarousel>;
        </div>
      </div>
    </>
  )
}

export default HeroBanner
