import React from 'react'
import './style.scss'
import FbIcon from '../../assets/images/fb-share.png'
import TwitIcon from '../../assets/images/twitter-share.png'
import ViberIcon from '../../assets/images/viber-share.png'
import MailIcon from '../../assets/images/mail-share.png'
import MessengerIcon from '../../assets/images/messenger-share.png'


const ShareListing = ({ productId, productName }) => {

    // Function to share product details to social networks
    const shareProduct = (network) => {
        
        const ClientUrl = process.env.REACT_APP_CLIENT_URL;
        const productUrl = `${ClientUrl}/productdetails/${productId}/${encodeURIComponent(productName)}`;

        console.log('productUrl:', productUrl)
        // Constructing shareable message
        const message = `Check out this awesome product: ${productName}!`;

        // URL to share
        let shareUrl = '';
        switch (network) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${productUrl}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(message)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(productUrl)}&title=${encodeURIComponent(productName)}`;
                break;
            default:
                break;
        }
        console.log('shareUrl:', shareUrl)

        // Open the share URL in a centered pop-up window
        const windowWidth = 600; // Set your desired width
        const windowHeight = 500; // Set your desired height
        const left = (window.screen.width - windowWidth) / 2;
        const top = (window.screen.height - windowHeight) / 2;

        // Opening a new window for sharing
        window.open(shareUrl, '_blank', 'width=' + windowWidth + ',height=' + windowHeight + ',left=' + left + ',top=' + top + ',toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes');
    };


    return (
        <>
            <div className="share-listing-container">
                <div className="share-listing-box">
                    <h5>Share this unique offer:</h5>
                    <div className='social-icon'>
                        <img src={FbIcon} alt="" onClick={() => shareProduct('facebook')} />
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