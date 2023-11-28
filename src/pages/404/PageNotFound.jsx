import React from 'react'
import './style.scss'
import SadImage from '../../assets/images/page-not-found-image.png'
import BtnGreen from '../../components/Button/BtnGreen'

const HomePage = () => {
  window.location.href = '/'
}

const PageNotFound = () => {
  return (
    <>
      <div className="container page-not-found-body">
        <div className='page-not-found-content'>
          <div className='page-not-found-img'>
            <img src={SadImage} alt="" />
          </div>
          <div className='page-not-found-text'>
            <h1>OOPS! PAGE NOT FOUND</h1>
            <p>The page you are looking for might have been removed, had its name changed or is temporarily unavailable.</p>
            <BtnGreen label='BACT TO HOME' className='page-not-found-btn' onClick={HomePage} />
          </div>
        </div>
      </div>
    </>
  )
}

export default PageNotFound
