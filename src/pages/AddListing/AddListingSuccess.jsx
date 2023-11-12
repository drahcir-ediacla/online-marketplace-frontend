import React from 'react'
import './style.scss'
import { ReactComponent as CircleCheck } from '../../assets/images/circle-check-solid.svg';
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer';
import BtnGreen from '../../components/Button/BtnGreen'
import BtnClear from '../../components/Button/BtnClear';
import Cap from '../../assets/images/cap-5.jpg'



const AddListingSuccess = () => {



    return (
        <>
            <Header />
            <div className="add-listing-body">
                <div className="container">
                    <div className="add-listing-success">
                        <div className='success-caption-container'>
                            <div className="circle-check"><CircleCheck /></div>
                            <h4>Your product has successfully been published</h4>
                        </div>
                        <div className="success-new-listed-box">
                            <div className="new-listed-info">
                                <img src={Cap} alt="" />
                                <p>“PRIMO Red Grape Sparkling Juice 750ml PRIMO Red Grape Sparkling Juice 750ml PRIMO Red Grape Sparkling Juice 750ml”</p>
                            </div>
                            <div className="redirect-buttons">
                                <BtnClear label="Add New Listing" /> <BtnGreen label="View Listing" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>

    );
};


export default AddListingSuccess;