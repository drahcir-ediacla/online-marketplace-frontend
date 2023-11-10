import React, { useState, useEffect, useMemo } from 'react';
import axios from '../../apicalls/axios';
import { useParams } from 'react-router-dom';
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import { Link } from 'react-router-dom'
import './style.scss'
import customerReviewsData from '../../data/customerReviewsData.json'
import itemGalleryData from '../../data/itemGalleryData.json'
import ItemImgGallery from '../../components/Gallery/ItemImgGallery'
import Pagination from '../../components/Pagination/Pagination'
import CustomerReviews from '../../components/CustomerReviews/CustomerReviews'
import { ReactComponent as HeartIcon } from '../../assets/images/heart-icon.svg'
import { ReactComponent as ShareIcon } from '../../assets/images/share-icon.svg'
import { ReactComponent as FlagIcon } from '../../assets/images/flag-icon.svg'
import BtnClear from '../../components/Button/BtnClear'
import BtnGreen from '../../components/Button/BtnGreen'
import Input from '../../components/FormField/Input'
import MoreFromSeller from '../../components/MoreFromSeller'
import RelatedListings from '../../components/RelatedListings'
import AllPhIcon from '../../assets/images/all-ph-icon.png'
import ListedInMap from '../../assets/images/pro-details-map.png'
import CustomerPic from '../../assets/images/profile-pic_1.png'


let postsPerPage = 5;
const BuyerProductDetails = () => {

    const { id, name } = useParams();
    const [product, setProduct] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    // const [postsPerPage] = useState(5);



    // Get current posts
    const currentReviewData = useMemo(() => {
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        // // const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
        return customerReviewsData.slice(indexOfFirstPost, indexOfLastPost);
    }, [currentPage]);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    useEffect(() => {
        // Fetch product details from the backend using both ID and name
        axios.get(`/api/getproductdetails/${id}/${name}`)
            .then((response) => {
                setProduct(response.data);
            })
            .catch((error) => {
                console.error('Error fetching product details:', error);
            });
    }, [id, name]);

    if (!product) {
        // Render loading state or handle error
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
            <div className="container product-details-body">
                <div className='row1'>
                    <ul className='breadcrumb'>
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='#'>Men’s Fashion</Link></li>
                        <li>Shoes</li>
                    </ul>
                </div>
                <div className='row2'>
                    <div className='col-left'>
                        <ItemImgGallery gallery={itemGalleryData} />
                    </div>
                    <div className='col-right'>
                        <div className='prod-details-title'><span>{product.product_name}</span></div>
                        <div className='prod-details-price'><span>₱{product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                        <div><span><b>Condition:</b>&nbsp;{product.product_condition}</span></div>
                        <div className='prod-details-deal-method'>
                            <div className='col1'><b>Deal Method:</b></div>
                            <div className='col2'>
                                <div><span>Meet Up - </span><img src={AllPhIcon} alt="" className='deal-method-loc-icon' /><span> MCU-Monumento, Morning Breeze Subdivision</span></div>
                                <div><span>Delivery - </span><img src={AllPhIcon} alt="" className='deal-method-loc-icon' /><span> 186 Blumentritt Tondo Manila</span></div>
                            </div>
                        </div>
                        <div className='prod-details-listed-in'><small>Listed in Caloocan, Metro Manila</small></div>
                        <div><img src={ListedInMap} alt="" /></div>
                        <div>
                            <div className='prod-details-icon-btn'>
                                <div className='heart-icon'><HeartIcon /></div>
                                <div className='share-icon'><ShareIcon /></div>
                                <div className='flag-icon'><FlagIcon /></div>
                            </div>
                            <div></div>
                        </div>
                    </div>
                </div>
                <div className='row3'>
                    <h2>Product Details</h2>
                    <hr />
                    <div className='product-details'>
                        <div className='col-left'>
                            <span className='time-posted'><b>Posted:</b> 12 hours ago</span>
                            <hr />
                            <div className='prod-details-title-desc'><h2>{product.product_name}</h2></div>
                            <div className='prod-details-spec'><p>Count on MLBShop.com for all the best in official Mexico Baseball men's gear. We have everything from authentic player jerseys and on-field New Era caps to collectible and exclusive Mexico Baseball memorabilia. Shop for Mexico Baseball men's t-shirts, hoodies, and authentic MLB gear for all 30 teams so you can show your loyalty all year long from Spring Training to the World Series. You can shop for Mexico Baseball accessories for your office, car, the gym, even the golf course.</p><br /><br />
                                <ul>
                                    <li><b>Snapback hat:</b> These hats feature a snap closure in the back along with a flat brim. These are considered to be high profile and are adjustable.</li>
                                    <li><b>Adjustable hat:</b> These hats have a velcro closure in the back but are unstructured yet adjustable. These have a curved brim and low profile.</li>
                                    <li><b>Fitted hat: These</b> hats feature either a curved or flat brim and are structured, high profile but unadjustable.</li>
                                    <li><b>Flexfit hat:</b> These hats feature a curved or flat brim and are structured, high profile and can be adjusted by the use of elastic materials.</li>
                                </ul>
                            </div>
                            <div className="product-details-review">
                                <div className='review-for'>
                                    <h5>Reviews for Vito Corleon</h5>
                                    <div className="seller-rating">
                                        <span>4.0</span>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-regular fa-star-half-stroke"></i>
                                        <i class="fa-regular fa-star"></i>
                                        <span>|</span><span>5 Review(s)</span>
                                    </div>
                                </div>
                                <hr />
                                <CustomerReviews posts={currentReviewData} />
                                <div className='pagination-container'><Pagination paginate={paginate} postsPerPage={postsPerPage} totalPosts={customerReviewsData.length} currentPage={currentPage} /></div>
                            </div>
                        </div>
                        <div className='col-right'>
                            <div className="prod-details-inquiry-form">
                                <div><h5>Seller Information</h5><small>Joined in July 2020</small></div>
                                <div className='row2'>
                                    <div className='col-left'><Link to="#"><img src={CustomerPic} alt="" className='customer-pic' /></Link></div>
                                    <div className='col-right'>
                                        <Link to="#" className='seller-name'>Vito Corleon</Link>
                                        <div className="seller-rating">
                                            <span>4.0</span>
                                            <i class="fa-solid fa-star"></i>
                                            <i class="fa-solid fa-star"></i>
                                            <i class="fa-solid fa-star"></i>
                                            <i class="fa-regular fa-star-half-stroke"></i>
                                            <i class="fa-regular fa-star"></i>
                                            <span> | </span><span>5 Review(s)</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='row3'>
                                    <textarea cols="44" rows="5" placeholder='Write a custom message...' className='custom-message'></textarea>
                                </div>
                                <div className='row4'>
                                    <BtnClear label="Is this item still available?" className='prod-details-inquiry-form-btn' />
                                    <BtnClear label="Is the price negotiable?" className='prod-details-inquiry-form-btn' />
                                    <BtnClear label="Do you deliver?" className='prod-details-inquiry-form-btn' />
                                    <BtnGreen label="Send Message" className='send-message' />
                                    <Link to="/LoginEmail" className='signin-make-offer'>Sign in to make offer</Link>
                                    <div className='input-make-offer-container'><span className='php-symbol'>₱</span><Input type='number' className='input-make-offer' /><BtnGreen label="Make Offer" className='make-offer-btn' /></div>
                                </div>
                            </div>
                            <div className="prod-details-ads">
                                YOUR ADS HERE
                            </div>
                        </div>
                    </div>
                </div>
                <MoreFromSeller />
                <div><RelatedListings /></div>
            </div>
            <Footer />
        </>
    )
}

export default BuyerProductDetails
