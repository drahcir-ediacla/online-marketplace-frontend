import React, { useState, useEffect, useMemo } from 'react'
import axios from '../../apicalls/axios'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import './style.scss'
import recommendedItemsData from '../../data/recommendedItemsData'
import customerReviewsData from '../../data/customerReviewsData.json'
import { Setloader } from '../../redux/reducer/loadersSlice'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import ProfileCard from '../../components/Cards/ProfileCard'
import SearchBox from '../../components/SearchBox'
import Filters from '../../components/Button/Filters'
import ListingCard from '../../components/Cards/ListingCard'
import CustomerReviews from '../../components/CustomerReviews/CustomerReviews'
import Pagination from '../../components/Pagination/Pagination'
import BtnClear from '../../components/Button/BtnClear'


let postsPerPage = 5;
const MyProfile = () => {

    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [authenticatedUserId, setAuthenticatedUserId] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            dispatch(Setloader(true));

            try {
                // Fetch the user's profile data
                const response = await axios.get(`/api/user/${id}`);
                setUser(response.data);

                // Fetch the authenticated user's data
                const authResponse = await axios.get('/auth/check-auth');
                setAuthenticatedUserId(authResponse.data.user);

                dispatch(Setloader(false));
            } catch (error) {
                dispatch(Setloader(false));
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id, dispatch]);

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


    const [activeTab, setActiveTab] = useState(0);

    const openContent = (tabIndex) => {
        setActiveTab(tabIndex);
    };

    return (
        <>
            <Header />
            <div className="myprofile-body">
                <div className="container">
                    <div className="row1">
                        {(authenticatedUserId?.id === user?.id) && (
                            <>
                                <h3>My Profile</h3>
                                <BtnClear to="/EditProfile" label="Edit Profile" className='edit-profile-btn' />
                            </>
                        )}
                    </div>
                    <div className="row2 cover-photo">COVER PHOTO</div>
                    <div className="row3 box-body">
                        <div className="col-left"><ProfileCard /></div>
                        <div className="col-right">
                            <div className="profile-tab-box">
                                <div className="profile-tab-header">
                                    <button className={`tab-name tablink ${activeTab === 0 ? 'active' : ''}`} onClick={() => openContent(0)}>Listings</button>
                                    <button className={`tab-name tablink ${activeTab === 1 ? 'active' : ''}`} onClick={() => openContent(1)}>Reviews</button>
                                    <button className={`tab-name tablink ${activeTab === 2 ? 'active' : ''}`} onClick={() => openContent(2)}>Badges</button>
                                </div>
                                <div className='listing-content' style={{ display: activeTab === 0 ? 'block' : 'none' }}>
                                    <div className='row1'>
                                        <div><h5>You have 18 listings</h5></div>
                                        <div className='col-right'>
                                            <SearchBox placeholder='Search listings...' />
                                            <Filters />
                                        </div>
                                    </div>
                                    <div className="prod-listing-container"><ListingCard data={recommendedItemsData} /></div>
                                </div>
                                <div className="reviews-content" style={{ display: activeTab === 1 ? 'block' : 'none' }}>
                                    <div className='row1'>
                                        <div className="overall-rating">
                                            <div className='avg-rate-box'>
                                                <div className='total-avg-rate'>4.0</div>
                                                <div className='out-of-5-stars'>Out of 5 Stars</div>
                                                <div className="seller-rating">
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-regular fa-star-half-stroke"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                </div>
                                            </div>
                                            <span>Overall rating of 28 reviews/ratings</span>
                                        </div>
                                        <div className="vl"></div>
                                        <div className='progress-rating'>
                                            <div className='progress-bar-box'>
                                                <div className="progress-stars">
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                </div>
                                                <div class="progress-bar-container">
                                                    <div class="five-star-bar"></div>
                                                </div>
                                                <span>15</span>
                                            </div>
                                            <div className='progress-bar-box'>
                                                <div className='progress-bar-box'>
                                                    <div className="progress-stars">
                                                        <i class="fa-solid fa-star"></i>
                                                        <i class="fa-solid fa-star"></i>
                                                        <i class="fa-solid fa-star"></i>
                                                        <i class="fa-solid fa-star"></i>
                                                        <i class="fa-regular fa-star"></i>
                                                    </div>
                                                    <div class="progress-bar-container">
                                                        <div class="four-star-bar"></div>
                                                    </div>
                                                    <span>10</span>
                                                </div>
                                            </div>
                                            <div className='progress-bar-box'>
                                                <div className="progress-stars">
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                </div>
                                                <div class="progress-bar-container">
                                                    <div class="three-star-bar"></div>
                                                </div>
                                                <span>6</span>
                                            </div>
                                            <div className='progress-bar-box'>
                                                <div className="progress-stars">
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                </div>
                                                <div class="progress-bar-container">
                                                    <div class="two-star-bar"></div>
                                                </div>
                                                <span>3</span>
                                            </div>
                                            <div className='progress-bar-box'>
                                                <div className="progress-stars">
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                </div>
                                                <div class="progress-bar-container">
                                                    <div class="one-star-bar"></div>
                                                </div>
                                                <span>1</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row2"></div>
                                    <div className="row3 profile-review-container">
                                        <CustomerReviews posts={currentReviewData} />
                                        <div className='pagination-container'><Pagination paginate={paginate} postsPerPage={postsPerPage} totalPosts={customerReviewsData.length} currentPage={currentPage} /></div>
                                    </div>
                                </div>
                                <div style={{ display: activeTab === 2 ? 'block' : 'none' }}>
                                    <h2>Badges</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default MyProfile
