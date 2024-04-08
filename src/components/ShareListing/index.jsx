import React from 'react'
import './style.scss'
import FbIcon from '../../assets/images/fb-share.png'
import TwitIcon from '../../assets/images/twitter-share.png'
import ViberIcon from '../../assets/images/viber-share.png'
import MailIcon from '../../assets/images/mail-share.png'
import MessengerIcon from '../../assets/images/messenger-share.png'


const ShareListing = ({ productId, productName }) => {

    const ClientUrl = process.env.REACT_APP_CLIENT_URL;
    const productUrl = `${ClientUrl}/productdetails/${productId}/${encodeURIComponent(productName)}`;

    // Function to share product details to social networks
    const shareProduct = (network) => {

        console.log('productUrl:', productUrl)
        // Constructing shareable message
        const message = `Check out this awesome product: ${productName}!`;

        // URL to share
        let shareUrl = '';
        switch (network) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${productUrl}&quote=${encodeURIComponent(message)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${productUrl}&text=${encodeURIComponent(message)}`;
                break;
            case 'viber':
                shareUrl = `viber://forward?text=${encodeURIComponent(message)}`;
                break;
            case 'messenger':
                shareUrl = `fb-messenger://share?link=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(message)}`;
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


    const shareViaEmail = () => {
        const subject = "Check out this awesome product!";
        const body = `Hi, \n\nI thought you might be interested in this product: ${productName}\n\nCheck it out here: ${productUrl}`;
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
    };


    return (
        <>
            <div className="share-listing-container">
                <div className="share-listing-box">
                    <h5>Share this unique offer:</h5>
                    <div className='social-icon'>
                        <img src={FbIcon} alt="" onClick={() => shareProduct('facebook')} />
                        <img src={TwitIcon} alt="" onClick={() => shareProduct('twitter')} />
                        <img src={ViberIcon} alt="" onClick={() => shareProduct('viber')} />
                        <img src={MessengerIcon} alt="" onClick={() => shareProduct('messenger')} />
                        <img src={MailIcon} alt="" onClick={() => (shareViaEmail)} />
                    </div>
                </div>
            </div>
        </>
    )
}


export default ShareListing;