import React from 'react'
import './style.scss'
import ChooseUsCard from './ChooseUsCard'

const WhyChooseUs = () => {
  return (
    <>
      <div className='why-choose-us-box'>
        <div className="container">
            <h1>Why Choose Us?</h1>
            <div className='row1'>
              <ChooseUsCard 
                img='images/img-choose-us-1.png'
                title='People Driven'
                text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                path='/'
              />
              <ChooseUsCard 
                img='images/img-choose-us-2.png'
                title='Support 24/7'
                text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                path='/'
              />
              <ChooseUsCard 
                img='images/img-choose-us-3.png'
                title='Secured Payment'
                text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                path='/'
              />
              <ChooseUsCard 
                img='images/img-choose-us-4.png'
                title='Verified Listing'
                text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                path='/'
              />
              <ChooseUsCard 
                img='images/img-choose-us-5.png'
                title='No Junk'
                text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                path='/'
              />
            </div>
        </div>
      </div>
    </>
  )
}

export default WhyChooseUs
