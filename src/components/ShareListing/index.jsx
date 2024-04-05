import React from 'react'
import './style.scss'
import FbIcon from '../../assets/images/fb-share.png'
import TwitIcon from '../../assets/images/twitter-share.png'
import ViberIcon from '../../assets/images/viber-share.png'
import MailIcon from '../../assets/images/mail-share.png'
import MessengerIcon from '../../assets/images/messenger-share.png'


const ShareListing = () => {


    return (
        <>
            <div className="share-listing-container">
                <div className="share-listing-box">
                    <h5>Share this unique offer:</h5>
                    <div className='social-icon'>
                        <img src={FbIcon} alt="" />
                        <img src={TwitIcon} alt="" />
                        <img src={ViberIcon} alt="" />
                        <img src={MessengerIcon} alt="" />
                        <img src={MailIcon} alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}


export default ShareListing;