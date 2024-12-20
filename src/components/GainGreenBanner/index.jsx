import { useState } from 'react'
import './style.scss'
import { useNavigate } from 'react-router-dom'
import LoginModal from '../Modal/LoginModal'
import DollarBox from '../../assets/images/dollar-box.png'
import SellArrow from '../../assets/images/sell-arrow.png'

const GainGreenBanner = ({ user }) => {

  const navigate = useNavigate()
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  const handleLoginModal = () => {
    if (!user) {
      setLoginModalOpen(true)
    } else {
      navigate('/addlisting');
    }
  }

  const toggleLoginModal = () => {
    setLoginModalOpen((prevLoginModalOpen) => !prevLoginModalOpen)
  }

  return (
    <>
      {loginModalOpen && <LoginModal onClick={toggleLoginModal} />}
      <div className="green-banner-container">
        <div className="contentbox">
          <div className="col-left">
            <div className='dollar-box'><img src={DollarBox} alt="" /></div>
            <h2>Make Space, Make Money: Sell Your Preloved Items Easily!</h2>
          </div>
          <div className="col-right">
            <button onClick={handleLoginModal} className="gain-more-btn">
              <h5>Sell Now</h5>
              <div className='sell-arrow'><img src={SellArrow} alt="" /></div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default GainGreenBanner
