import React from 'react'
import { Helmet } from 'react-helmet';
import { FacebookShareButton, TwitterShareButton, ViberShareButton, FacebookMessengerShareButton } from 'react-share'
import './style.scss'
import FbIcon from '../../assets/images/fb-share.png'
import TwitIcon from '../../assets/images/twitter-share.png'
import ViberIcon from '../../assets/images/viber-share.png'
import MailIcon from '../../assets/images/mail-share.png'
import MessengerIcon from '../../assets/images/messenger-share.png'


const ShareListing = ({ productId, productName }) => {

    const ClientUrl = process.env.REACT_APP_CLIENT_URL;
    const productUrl = `${ClientUrl}/productdetails/${productId}/${encodeURIComponent(productName)}`;
    const message = `Check out this awesome product: ${productName}!`;


    return (
        <><Helmet>
            <meta property="og:url" content={productUrl} />
        </Helmet>
            <div className="share-listing-container">
                <div className="share-listing-box">
                    <h5>Share this unique offer:</h5>
                    <div className='social-icon'>
                        <FacebookShareButton url={productUrl} title={productName}>
                            <img src={FbIcon} alt="" />
                        </FacebookShareButton>
                        <TwitterShareButton url={productUrl} title={productName}>
                            <img src={TwitIcon} alt="" />
                        </TwitterShareButton>
                        <ViberShareButton>
                            <img src={ViberIcon} alt="" />
                        </ViberShareButton>
                        <FacebookMessengerShareButton redirectUri={productUrl} url={productUrl} appId={'1245184422822098'}  >
                            <img src={MessengerIcon} alt="" />
                        </FacebookMessengerShareButton>
                        <img src={MailIcon} alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}


export default ShareListing;