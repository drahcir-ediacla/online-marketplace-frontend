import React, { useState, useEffect } from 'react'
import axios from '../../apicalls/axios';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Setloader } from '../../redux/reducer/loadersSlice';
import './style.scss'
import { ReactComponent as CircleCheck } from '../../assets/images/circle-check-solid.svg';
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer';
import BtnGreen from '../../components/Button/BtnGreen'
import BtnClear from '../../components/Button/BtnClear';



const AddListingSuccess = () => {

    const { id, name } = useParams();
    const [product, setProduct] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        // Fetch product details from the backend using both ID and name
        dispatch(Setloader(true));
        axios.get(`/api/getproductdetails/${id}/${name}`)
            .then((response) => {
                dispatch(Setloader(false))
                setProduct(response.data);
            })
            .catch((error) => {
                dispatch(Setloader(false))
                console.error('Error fetching product details:', error);
            });
    }, [id, name, dispatch]);

    const viewListing = () => {
        window.location.href = `/productdetails/${id}/${name}`;
    }

    const addNewListing = () => {
        window.location.href = '/addlisting';
    }

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
                                {/* Use the first image in the images array */}
                                <img src={product.images[0].image_url} alt="" />
                                <div className='new-listed-info-col-left'>
                                    <p>"{product.product_name}"</p>
                                    <span className='listed-price'>₱{product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    <p className='listed-in'>Listed in {product.seller.city}, {product.seller.region}, Philippines</p>
                                    
                                </div>
                            </div>
                            <div className="redirect-buttons">
                                <BtnClear label="Add New Listing" onClick={addNewListing} /> <BtnGreen label="View Listing" onClick={viewListing} />
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