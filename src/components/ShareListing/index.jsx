import React from 'react'
import { Helmet } from 'react-helmet';
import { FacebookShareButton, TwitterShareButton, FacebookMessengerShareButton, EmailShareButton, WhatsappShareButton } from 'react-share'
import './style.scss'
import FbIcon from '../../assets/images/fb-share.png'
import TwitIcon from '../../assets/images/twitter-share.png'
import WhatsAppIcon from '../../assets/images/whatsapp-share.png'
import MailIcon from '../../assets/images/mail-share.png'
import MessengerIcon from '../../assets/images/messenger-share.png'


const ShareListing = ({ productId, productName }) => {

    const ClientUrl = process.env.REACT_APP_CLIENT_URL;
    const productUrl = `${ClientUrl}/productdetails/${productId}/${encodeURIComponent(productName)}`;
    const message = `Check out this awesome product: ${productName}!`;


    return (
        <><Helmet>
            <meta property="og:url" content={productUrl} />
            {/* <meta property="og:title" content={productName} /> */}
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
                        <WhatsappShareButton title={`Check out this product: ${productName}`} url={productUrl}>
                            <img src={WhatsAppIcon} alt="" />
                        </WhatsappShareButton>
                        <FacebookMessengerShareButton redirectUri={productUrl} url={productUrl} appId={'1245184422822098'}  >
                            <img src={MessengerIcon} alt="" />
                        </FacebookMessengerShareButton>
                        <EmailShareButton
                            url={productUrl}
                            subject={`Check out this product: ${productName}`}
                            body={`Hi,\n\nI thought you might be interested in this product: ${productName}\n\nCheck it out here: ${productUrl}`}>
                            <img src={MailIcon} alt="" subject={productName} />
                        </EmailShareButton>
                    </div>
                </div>
            </div>
        </>
    )
}


export default ShareListing;