import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axios from '../../apicalls/axios'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import './style.scss'
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
const ProfilePage = ({ userId }) => {

    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [authenticatedUser, setAuthenticatedUser] = useState(null);
    const [err, setErr] = useState(false);
    const dispatch = useDispatch();

    const [productStates, setProductStates] = useState({});
    const [wishlistCount, setWishlistCount] = useState({});


    const addToWishlist = (productId) => {
        axios.post(`/api/addwishlist/product-${productId}`, {})
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error adding item to wishlist:', error);
            });
    };

    const removeFromWishlist = (productId) => {
        axios.post(`/api/removewishlist/product-${productId}`, {})
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error removing item from wishlist:', error);
            });
    };


    useEffect(() => {
        const fetchData = async () => {
            dispatch(Setloader(true));

            try {
                // Fetch the user's profile data
                const response = await axios.get(`/api/user/${id}`);

                setUser(response.data);

                // Fetch the authenticated user's data
                const authResponse = await axios.get('/auth/check-auth');
                setAuthenticatedUser(authResponse.data.user);

                dispatch(Setloader(false));
            } catch (error) {
                dispatch(Setloader(false));
                console.error('Error fetching data:', error);

                // Check if the error is due to unauthorized access
                if (error.response && error.response.status === 401) {
                    console.error('User not authenticated');
                    // Handle unauthorized access, e.g., redirect to login
                } else {
                    // Handle other errors
                    setErr(true); // Depending on your requirements
                }
            }
        };

        fetchData();
    }, [id, dispatch]);


    const products = useMemo(() => Array.isArray(user?.products) ? user?.products : [], [user?.products]);



    // Use useCallback to memoize the function
    const getWishlistCount = useCallback((productId) => {
        const productData = products.find((product) => product.id === productId);
        return productData ? (productData.wishlist ? productData.wishlist.length : 0) : 0;
    }, [products]);


    // Use useEffect to update wishlist count after state changes
    useEffect(() => {
        // Update wishlist count for all products
        const updatedWishlistCounts = {};
        products.forEach((product) => {
            updatedWishlistCounts[product.id] = getWishlistCount(product.id);
        });

        // Set the updated wishlist counts
        setWishlistCount(updatedWishlistCounts);

        console.log('Wishlist count updated:', updatedWishlistCounts);
    }, [productStates, products, getWishlistCount]);



    // Initialize productStates based on initial wishlist data
    useEffect(() => {
        const initialProductStates = {};
        products.forEach((product) => {
            const isProductInWishlist = Array.isArray(product.wishlist) && product.wishlist.some((entry) => String(entry.user_id) === String(userId));
            initialProductStates[product.id] = isProductInWishlist;
        });
        console.log('Initial Product States:', initialProductStates);
        setProductStates(initialProductStates);
    }, [products, userId]);



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
            <div className="profile-body">
                <Header />
                <>
                    {err ? (
                        <h2 className='profile-not-found'>Sorry we could not find this profile!</h2>
                    ) : (
                        <div className="myprofile-body">
                            <div className="container">
                                <div className="row1">
                                    {(authenticatedUser?.id === user?.id) && (
                                        <>
                                            <h3>My Profile</h3>
                                            <BtnClear to="/EditProfile" label="Edit Profile" className='edit-profile-btn' />
                                        </>
                                    )}
                                </div>
                                <div className="row2 cover-photo">COVER PHOTO</div>
                                <div className="row3 box-body">
                                    <div className="col-left">
                                        <ProfileCard
                                            data={user}
                                            authenticatedUser={authenticatedUser}
                                            setAuthenticatedUser={setAuthenticatedUser}
                                        />
                                    </div>
                                    <div className="col-right">
                                        <div className="profile-tab-box">
                                            <div className="profile-tab-header">
                                                <button className={`tab-name tablink ${activeTab === 0 ? 'active' : ''}`} onClick={() => openContent(0)}>Listings</button>
                                                <button className={`tab-name tablink ${activeTab === 1 ? 'active' : ''}`} onClick={() => openContent(1)}>Reviews</button>
                                                <button className={`tab-name tablink ${activeTab === 2 ? 'active' : ''}`} onClick={() => openContent(2)}>Badges</button>
                                            </div>
                                            <div className='listing-content' style={{ display: activeTab === 0 ? 'block' : 'none' }}>
                                                <div className='row1'>
                                                    <div><h5>You have {user?.products?.length || 0} listings</h5></div>
                                                    <div className='col-right'>
                                                        <SearchBox placeholder='Search listings...' />
                                                        <Filters />
                                                    </div>
                                                </div>
                                                <div className="prod-listing-container">
                                                    <ListingCard
                                                        data={products || []}
                                                        city={user?.city || ''}
                                                        region={user?.region || ''}
                                                        authenticatedUser={authenticatedUser}
                                                        addToWishlist={addToWishlist}
                                                        removeFromWishlist={removeFromWishlist}
                                                        userId={user?.id}
                                                        wishlistCount={wishlistCount}
                                                        setWishlistCount={setWishlistCount}
                                                        getWishlistCount={getWishlistCount}
                                                    />
                                                </div>
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

                    )}
                </>
                <Footer />
            </div>
        </>
    )
}

export default ProfilePage
