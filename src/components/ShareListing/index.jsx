import React from 'react'
import './style.scss'
import FbIcon from '../../assets/images/fb-share.png'
import TwitIcon from '../../assets/images/twitter-share.png'
import ViberIcon from '../../assets/images/viber-share.png'
import MailIcon from '../../assets/images/mail-share.png'
import MessengerIcon from '../../assets/images/messenger-share.png'


const ShareListing = () => {

    // Function to share product details to social networks
    const shareProduct = (network) => {
        // Dummy URL for the online store product page
        const productUrl = `/addlistingsuccess/${productId}/${encodeURIComponent(productName)}`;

        // Constructing shareable message
        const message = `Check out this awesome product: ${product.name}!`;

        // URL to share
        let shareUrl = '';
        switch (network) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(message)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(productUrl)}&title=${encodeURIComponent(product.name)}`;
                break;
            default:
                break;
        }

        // Opening a new window for sharing
        window.open(shareUrl, '_blank');
    };


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