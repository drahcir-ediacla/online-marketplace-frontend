import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axios from '../../apicalls/axios'
import { useParams } from 'react-router-dom'
import { FaStar } from 'react-icons/fa';
import './style.scss'
import customerReviewsData from '../../data/customerReviewsData.json'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import ProfileCard from '../../components/Cards/ProfileCard'
import FollowerCard from '../../components/Cards/FollowerCard'
import FollowingCard from '../../components/Cards/FollowingCard'
import SearchBox from '../../components/SearchBox'
import ModalItemFilter from '../../components/ProductFilter/ModalItemFilter'
import ListingCard from '../../components/Cards/ListingCard'
import CustomerReviews from '../../components/CustomerReviews/CustomerReviews'
import Pagination from '../../components/Pagination/Pagination'
import BtnClear from '../../components/Button/BtnClear'
import { ReactComponent as NoReviewIcon } from '../../assets/images/group-messages-icon.svg'


let postsPerPage = 5;
const ProfilePage = ({ userId }) => {

    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [authenticatedUser, setAuthenticatedUser] = useState(null);
    const [err, setErr] = useState(false);

    const [productStates, setProductStates] = useState({});
    const [wishlistCount, setWishlistCount] = useState({});

    const [reviewsData, setReviewsData] = useState([]);
    const [checkReviewsData, setCheckReviewsData] = useState([]);
    const [avgRating, setAvgRating] = useState(null)
    const [totalReviews, setTotalReviews] = useState(null)
    const [ratingBreakdown, setRatingBreakdown] = useState(null)
    const stars = Array(5).fill(0);

    const [searchTerm, setSearchTerm] = useState('')
    const [role, setRole] = useState('');
    console.log('role:', role)



    useEffect(() => {
        const fetchReviewsByTargetId = async () => {
            try {
                const response = await axios.get(`/api/get-reviews/${id}/${role}`)
                setReviewsData(response.data.reviewsTargetId)

            } catch (error) {
                console.log('Error fetching all the reviews:', error)
            }
        };

        fetchReviewsByTargetId(); // Fetch receiver information only if receiver_id is available
        console.log('fetchReviewsByTargetId:', fetchReviewsByTargetId)
    }, [id, role])


    useEffect(() => {
        const checkReviewsData = async () => {
            try {
                const response = await axios.get(`/api/get-reviews/${id}`)
                setCheckReviewsData(response.data.allReviewsTargetId)
                setAvgRating(response.data.averageRating)
                setTotalReviews(response.data.totalReviews)
                setRatingBreakdown(response.data.ratingBreakdown)

            } catch (error) {
                console.log('Error fetching all the reviews:', error)
            }
        };

        checkReviewsData(); // Fetch receiver information only if receiver_id is available
    }, [id])



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


    // useEffect(() => {
    //     const fetchData = async () => {
    //         dispatch(Setloader(true));

    //         try {
    //             // Fetch the user's profile data
    //             const response = await axios.get(`/api/user/${id}`);

    //             setUser(response.data);
    //             setFilteredListings(response.data?.products)


    //             // Fetch the authenticated user's data
    //             const authResponse = await axios.get('/auth/check-auth');
    //             setAuthenticatedUser(authResponse.data.user);

    //             dispatch(Setloader(false));
    //         } catch (error) {
    //             dispatch(Setloader(false));
    //             console.error('Error fetching data:', error);

    //             // Check if the error is due to unauthorized access
    //             if (error.response && error.response.status === 401) {
    //                 console.error('User not authenticated');
    //                 // Handle unauthorized access, e.g., redirect to login
    //             } else {
    //                 // Handle other errors
    //                 setErr(true); // Depending on your requirements
    //             }
    //         }
    //     };

    //     fetchData();
    // }, [id, dispatch]);


    const allProducts = useMemo(() => Array.isArray(user?.products) ? user?.products : [], [user?.products]);
    const [filteredListings, setFilteredListings] = useState(allProducts)


    // Use useCallback to memoize the function
    const getWishlistCount = useCallback((productId) => {
        const productData = allProducts.find((product) => product.id === productId);
        return productData ? (productData.wishlist ? productData.wishlist.length : 0) : 0;
    }, [allProducts]);


    // Use useEffect to update wishlist count after state changes
    useEffect(() => {
        // Update wishlist count for all products
        const updatedWishlistCounts = {};
        allProducts.forEach((product) => {
            updatedWishlistCounts[product.id] = getWishlistCount(product.id);
        });

        // Set the updated wishlist counts
        setWishlistCount(updatedWishlistCounts);

        console.log('Wishlist count updated:', updatedWishlistCounts);
    }, [productStates, allProducts, getWishlistCount]);



    // Initialize productStates based on initial wishlist data
    useEffect(() => {
        const initialProductStates = {};
        allProducts.forEach((product) => {
            const isProductInWishlist = Array.isArray(product.wishlist) && product.wishlist.some((entry) => String(entry.user_id) === String(userId));
            initialProductStates[product.id] = isProductInWishlist;
        });
        console.log('Initial Product States:', initialProductStates);
        setProductStates(initialProductStates);
    }, [allProducts, userId]);



    const [currentPage, setCurrentPage] = useState(1);
    // const [postsPerPage] = useState(5); 

    // Get current posts
    const currentReviewData = useMemo(() => {
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        // // const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
        return reviewsData.slice(indexOfFirstPost, indexOfLastPost);
    }, [currentPage, reviewsData]);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);


    const [activeTab, setActiveTab] = useState(0);


    const openContent = (tabIndex) => {
        setActiveTab(tabIndex);
    };

    const openReviews = (tabIndex) => {
        setRole(tabIndex);
    };




    const handleSearchChange = (e) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);

        if (searchTerm === '') {
            setFilteredListings(allProducts);
            return;
        }

        const filtered = allProducts.filter(product => {
            const productNameMatch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase());
            console.log('productNameMatch:', productNameMatch)

            // Check if either product name or seller's display name matches the search term
            return productNameMatch;

        });

        setFilteredListings(filtered);
    }

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
                                {(authenticatedUser?.id === user?.id) && (
                                    <div className="row1">
                                        <>
                                            <h3>My Profile</h3>
                                            <BtnClear to="/EditProfile" label="Edit Profile" className='edit-profile-btn' />
                                        </>
                                    </div>
                                )}
                                <div className="row2 cover-photo">
                                    {user?.cover_photo ? (
                                        <img src={user?.cover_photo} alt="" />
                                    ) : (
                                        <>
                                            NO COVER PHOTO AVAILABLE
                                        </>
                                    )}

                                </div>
                                <div className="row3 box-body">
                                    <div className="col-left">
                                        <ProfileCard
                                            data={user}
                                            authenticatedUser={authenticatedUser}
                                            setAuthenticatedUser={setAuthenticatedUser}
                                            allFollowersList={() => openContent(2)}
                                            allFollowingList={() => openContent(3)}
                                            avgRating={avgRating}
                                            totalReviews={totalReviews}
                                        />
                                    </div>
                                    <div className="col-right">
                                        <div className="profile-tab-box">
                                            <div className="profile-tab-header">
                                                <button className={`tab-name tablink ${activeTab === 0 ? 'active' : ''}`} onClick={() => openContent(0)}>Listings</button>
                                                <button className={`tab-name tablink ${activeTab === 1 ? 'active' : ''}`} onClick={() => openContent(1)}>Reviews</button>
                                                <button className={`tab-name tablink ${activeTab === 2 ? 'active' : ''}`} onClick={() => openContent(2)}>Followers</button>
                                                <button className={`tab-name tablink ${activeTab === 3 ? 'active' : ''}`} onClick={() => openContent(3)}>Following</button>
                                            </div>
                                            <div className='listing-content' style={{ display: activeTab === 0 ? 'block' : 'none' }}>
                                                <div className='row1'>
                                                    <h5>{user?.id !== authenticatedUser?.id ? (user?.display_name) : ('You')} have {user?.products?.length || 0} listing(s)</h5>
                                                    <div className='col-right'>
                                                        <SearchBox
                                                            placeholder='Search item name...'
                                                            value={searchTerm}
                                                            onChange={handleSearchChange}
                                                        />
                                                        <ModalItemFilter
                                                            userId={id}
                                                            userData={setUser}
                                                            filteredListings={setFilteredListings}
                                                            authenticatedUser={setAuthenticatedUser}
                                                            err={setErr}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="prod-listing-container">
                                                    <ListingCard
                                                        data={filteredListings || []}
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
                                                {checkReviewsData && checkReviewsData.length !== 0 && (
                                                    <>
                                                        <div className='row1'>
                                                            <div className="overall-rating">
                                                                <div className='avg-rate-box'>
                                                                    <div className='total-avg-rate'>{avgRating || 0}</div>
                                                                    <div className='out-of-5-stars'>Out of 5 Stars</div>
                                                                    <div className="seller-rating">
                                                                        <div style={{ display: 'flex', gap: '5px' }}>
                                                                            {stars.map((_, index) => {
                                                                                return (
                                                                                    <FaStar
                                                                                        key={index}
                                                                                        size={23}
                                                                                        color={(avgRating) > index ? '#FFD800' : '#bcbcbc'}
                                                                                    />
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <span>Overall rating of {totalReviews} reviews/ratings</span>
                                                            </div>
                                                            <div className="vl"></div>
                                                            <div className='progress-rating'>
                                                                <div className='progress-bar-box'>
                                                                    <div className="progress-stars">
                                                                        <div style={{ display: 'flex' }}>
                                                                            {stars.map((_, index) => {
                                                                                return (
                                                                                    <FaStar
                                                                                        key={index}
                                                                                        size={17}
                                                                                        color={5 > index ? '#FFD800' : '#bcbcbc'}
                                                                                    />
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                    <div class="progress-bar-container">
                                                                        <div class="five-star-bar" style={{ width: `${(ratingBreakdown?.['5'] || 0) * 20}%` }}></div>
                                                                    </div>
                                                                    <span>{ratingBreakdown?.[5]}</span>
                                                                </div>
                                                                <div className='progress-bar-box'>
                                                                    <div className='progress-bar-box'>
                                                                        <div className="progress-stars">
                                                                            <div style={{ display: 'flex' }}>
                                                                                {stars.map((_, index) => {
                                                                                    return (
                                                                                        <FaStar
                                                                                            key={index}
                                                                                            size={17}
                                                                                            color={4 > index ? '#FFD800' : '#bcbcbc'}
                                                                                        />
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                        <div class="progress-bar-container">
                                                                            <div class="four-star-bar" style={{ width: `${(ratingBreakdown?.['4'] || 0) * 20}%` }}></div>
                                                                        </div>
                                                                        <span>{ratingBreakdown?.[4]}</span>
                                                                    </div>
                                                                </div>
                                                                <div className='progress-bar-box'>
                                                                    <div className="progress-stars">
                                                                        <div style={{ display: 'flex' }}>
                                                                            {stars.map((_, index) => {
                                                                                return (
                                                                                    <FaStar
                                                                                        key={index}
                                                                                        size={17}
                                                                                        color={3 > index ? '#FFD800' : '#bcbcbc'}
                                                                                    />
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                    <div class="progress-bar-container">
                                                                        <div class="three-star-bar" style={{ width: `${(ratingBreakdown?.['3'] || 0) * 20}%` }}></div>
                                                                    </div>
                                                                    <span>{ratingBreakdown?.[3]}</span>
                                                                </div>
                                                                <div className='progress-bar-box'>
                                                                    <div className="progress-stars">
                                                                        <div style={{ display: 'flex' }}>
                                                                            {stars.map((_, index) => {
                                                                                return (
                                                                                    <FaStar
                                                                                        key={index}
                                                                                        size={17}
                                                                                        color={2 > index ? '#FFD800' : '#bcbcbc'}
                                                                                    />
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                    <div class="progress-bar-container">
                                                                        <div class="two-star-bar" style={{ width: `${(ratingBreakdown?.['2'] || 0) * 20}%` }}></div>
                                                                    </div>
                                                                    <span>{ratingBreakdown?.[2]}</span>
                                                                </div>
                                                                <div className='progress-bar-box'>
                                                                    <div className="progress-stars">
                                                                        <div style={{ display: 'flex' }}>
                                                                            {stars.map((_, index) => {
                                                                                return (
                                                                                    <FaStar
                                                                                        key={index}
                                                                                        size={17}
                                                                                        color={1 > index ? '#FFD800' : '#bcbcbc'}
                                                                                    />
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                    <div class="progress-bar-container">
                                                                        <div class="one-star-bar" style={{ width: `${(ratingBreakdown?.['1'] || 0) * 20}%` }}></div>
                                                                    </div>
                                                                    <span>{ratingBreakdown?.[1]}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row2"></div>
                                                    </>)}
                                                <div className="row3 profile-review-container">
                                                    {checkReviewsData && checkReviewsData.length > 0 ? (
                                                        <>
                                                            <div className='review-btns'>
                                                                <button className={`review-tab ${role === '' ? 'active' : ''}`} onClick={() => openReviews('')}>All Reviews</button>
                                                                <button className={`review-tab ${role === 'Buyer' ? 'active' : ''}`} onClick={() => openReviews('Buyer')}>Buyer Reviews</button>
                                                                <button className={`review-tab ${role === 'Seller' ? 'active' : ''}`} onClick={() => openReviews('Seller')}>Seller Reviews</button>
                                                            </div>
                                                            <div style={{ display: role === '' ? 'block' : 'none' }}>
                                                                <CustomerReviews posts={currentReviewData} />
                                                                <div className='pagination-container'>
                                                                    <Pagination paginate={paginate} postsPerPage={postsPerPage} totalPosts={reviewsData.length} currentPage={currentPage} />
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className='no-review-message-container'>
                                                            <div className='no-review-icon'><NoReviewIcon /></div>
                                                            <h5>{user?.display_name} does not yet have any reviews.</h5>
                                                        </div>
                                                    )}
                                                    <div style={{ display: role === 'Buyer' ? 'block' : 'none' }}>
                                                        {reviewsData && reviewsData.length > 0 ? (
                                                            <>
                                                                <CustomerReviews posts={currentReviewData} />
                                                                <div className='pagination-container'>
                                                                    <Pagination paginate={paginate} postsPerPage={postsPerPage} totalPosts={reviewsData.length} currentPage={currentPage} />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className='no-review-message-container'>
                                                                <div className='no-review-icon'><NoReviewIcon /></div>
                                                                <h5>{user?.display_name} does not yet have any buyer reviews.</h5>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ display: role === 'Seller' ? 'block' : 'none' }}>
                                                        {reviewsData && reviewsData.length > 0 ? (
                                                            <>
                                                                <CustomerReviews posts={currentReviewData} />
                                                                <div className='pagination-container'>
                                                                    <Pagination paginate={paginate} postsPerPage={postsPerPage} totalPosts={reviewsData.length} currentPage={currentPage} />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className='no-review-message-container'>
                                                                <div className='no-review-icon'><NoReviewIcon /></div>
                                                                <h5>{user?.display_name} does not yet have any seller reviews.</h5>
                                                            </div>
                                                        )}
                                                    </div>

                                                </div>
                                            </div>
                                            <div className='followers-list' style={{ display: activeTab === 2 ? 'block' : 'none' }}>
                                                <FollowerCard data={user} />
                                            </div>
                                            <div className='followers-list' style={{ display: activeTab === 3 ? 'block' : 'none' }}>
                                                <FollowingCard data={user} />
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
