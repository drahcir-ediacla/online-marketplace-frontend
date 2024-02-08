import React, { useState, useEffect } from 'react'
import {GetProductsById} from '../../apicalls/products';
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
    const { id, product_name } = useParams();
    const [product, setProduct] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProductDetails = async () => {
          dispatch(Setloader(true)); // Set loader to true before making the request
    
          try {
            const response = await GetProductsById(id, product_name);
            dispatch(Setloader(false)); // Set loader to false after receiving the response
            setProduct(response.data); // Assuming you have a setProduct function to update the state
          } catch (error) {
            dispatch(Setloader(false)); // Set loader to false in case of an error as well
            console.error('Error fetching product details:', error);
          }
        };
    
        fetchProductDetails(); // Call the async function within useEffect
      }, [id, product_name, dispatch]);

    const viewListing = () => {
        window.location.href = `/productdetails/${id}/${encodeURIComponent(product_name)}`;
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
                            {product && product.images && product.images.length > 0 && (
                                <div className="new-listed-info">
                                    {/* Use the first image in the images array */}
                                    <img src={product.images[0].image_url} alt="" />
                                    <div className='new-listed-info-col-left'>
                                        <p>"{product.product_name}"</p>
                                        <span className='listed-price'>₱{Number(product.price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</span>
                                        <p className='listed-in'>Listed in {product.seller.city}, {product.seller.region}, Philippines</p>
                                    </div>
                                </div>
                            )}
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