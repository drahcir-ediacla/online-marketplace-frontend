import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from '../../apicalls/axios';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import useAuthentication from '../../hooks/authHook';
import { trackProductView, GetProductsById, AddWishlist, RemoveWishlist, GetAllCategories } from '../../apicalls/products';
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import { Link } from 'react-router-dom'
import './style.scss'
import customerReviewsData from '../../data/customerReviewsData.json'
import ItemImgGallery from '../../components/Gallery/ItemImgGallery'
import Pagination from '../../components/Pagination/Pagination'
import CustomerReviews from '../../components/CustomerReviews/CustomerReviews'
import { ReactComponent as ShareIcon } from '../../assets/images/share-icon.svg'
import { ReactComponent as FlagIcon } from '../../assets/images/flag-icon.svg'
import WishlistButton from '../../components/WishlistButton';
import { Setloader } from '../../redux/reducer/loadersSlice';
import Breadcrumb from '../../components/Breadcrumb'
import BtnClear from '../../components/Button/BtnClear'
import BtnGreen from '../../components/Button/BtnGreen'
import Input from '../../components/FormField/Input'
import MoreFromSeller from '../../components/MoreFromSeller'
import RelatedListings from '../../components/RelatedListings'
import AllPhIcon from '../../assets/images/all-ph-icon.png'
import ListedInMap from '../../assets/images/pro-details-map.png'
import AvatarIcon from '../../assets/images/profile-avatar.png'


let postsPerPage = 5;
const ProductDetails = ({ userId }) => {

    const { id, product_name } = useParams();
    const [product, setProduct] = useState(null);
    const dispatch = useDispatch();
    const { user } = useAuthentication();
    const [currentPage, setCurrentPage] = useState(1);
    const [productStates, setProductStates] = useState({});
    const [wishlistCount, setWishlistCount] = useState({});
    const didTrackProductView = useRef(false);
    const [input, setInput] = useState('');
    const [categories, setCategories] = useState([]);
    const categoryId = product?.category_id;
    const sender_id = user?.id.toString();
    const receiver_id = product?.seller.id.toString();
    const product_id = product?.id;
    const [chatId, setChatId] = useState(null);
    const isProductOwner = product?.seller.id === user?.id
    const viewChat = () => {
        window.location.href = `/messages/${chatId}`;
    }


    useEffect(() => {
        // Function to check if chat exists and set the chat_id state
        const checkChatExists = async () => {
            try {
                const response = await axios.get(`/api/check/chatid`, {
                    params: {
                        sender_id,
                        receiver_id,
                        product_id,
                    },
                });

                if (response.data && response.data.chat_id) {
                    setChatId(response.data.chat_id);
                }
            } catch (error) {
                console.error('Error checking chat:', error);
            }
        };

        // Call the function when component mounts or when sender_id, receiver_id, or product_id changes
        if (sender_id && receiver_id && product_id) {
            checkChatExists();
        }
    }, [sender_id, receiver_id, product_id]); // Dependencies

    console.log('Chat ID:', chatId)



    useEffect(() => {
        if (!didTrackProductView.current) {
            trackProductView(id);
            didTrackProductView.current = true;
        }
    }, [id]);


    // Get current posts
    const currentReviewData = useMemo(() => {
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        // // const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
        return customerReviewsData.slice(indexOfFirstPost, indexOfLastPost);
    }, [currentPage]);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);


    // Add and remove wishlist function
    const addToWishlist = async (productId) => {
        try {
            const response = await AddWishlist(productId, {});
            console.log(response.data);
        } catch (error) {
            console.error('Error adding item to wishlist:', error);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const response = await RemoveWishlist(productId, {});
            console.log(response.data);
        } catch (error) {
            console.error('Error removing item from wishlist:', error);
        }
    };


    // FETCH ALL CATEGORIES //
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await GetAllCategories();
                console.log('Categories:', response.data);
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchCategories();
    }, []);




    //Fetch product data
    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(Setloader(true));
                const response = await GetProductsById(id, product_name);

                // Check if the response data has images array
                if (response.data.images && Array.isArray(response.data.images)) {
                    setProduct(response.data);

                } else {
                    console.error('Invalid product data:', response.data);
                }

                dispatch(Setloader(false));
            } catch (error) {
                dispatch(Setloader(false));
                console.error('Error fetching product details:', error);
            }
        };

        fetchData();
    }, [id, product_name, dispatch]);



    console.log('Product Data1:', product);


    // Use useCallback to memoize the function
    const getWishlistCount = useCallback((productId) => {
        return product.wishlist ? product.wishlist.filter(entry => entry.product_id === productId).length : 0;
    }, [product]);



    // Use useEffect to update wishlist count after state changes
    useEffect(() => {
        if (!product || typeof product !== 'object') {
            return; // Exit early if product is null or not an object
        }

        // Check if product has a wishlist property
        if (product.wishlist && Array.isArray(product.wishlist)) {
            // Update wishlist count for the specific product
            const updatedWishlistCount = getWishlistCount(product.id);

            // Set the updated wishlist count
            setWishlistCount({ [product.id]: updatedWishlistCount });

            console.log('Wishlist count updated:', updatedWishlistCount);
        } else {
            console.error('Invalid product data. Expected a wishlist array:', product);
        }
    }, [product, getWishlistCount]);



    // Initialize productStates based on initial wishlist data
    useEffect(() => {
        if (!product) {
            return; // Exit early if product is null
        }

        // Check if product is iterable (array or array-like)
        if (typeof product[Symbol.iterator] === 'function') {
            // Update initial product states for all products
            const initialProductStates = {};
            product.forEach((productItem) => {
                const isProductInWishlist = Array.isArray(productItem.wishlist) && productItem.wishlist.some((entry) => String(entry.user_id) === String(userId));
                initialProductStates[productItem.id] = isProductInWishlist;
            });

            // Set the initial product states
            setProductStates(initialProductStates);

            console.log('Initial Product States:', initialProductStates);
        } else {
            console.error('Invalid product data. Expected an iterable (array or array-like):', product);
        }
    }, [product, userId]);



    if (!product) {
        // Render loading state or handle error
        return null;
    }


    const originalDate = product.seller?.createdAt || '';
    const formattedDate = new Date(originalDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });



    //------------------ SEND MESSAGE --------------------------//
    const sendMessage = async () => {
        try {
            const response = await axios.post('/api/create/messages', {
                chat_id: chatId,
                sender_id,
                receiver_id,
                product_id,
                content: input
            });

            const chatID = response.data.chat_id;
            window.location.href = `/messages/${chatID}`;
            // Clear the input field after sending the message
            setInput('');
        } catch (error) {
            console.error('Error sending message:', error)
        }
    };


    const handleBtnClearClick = (label) => {
        setInput(label); // Set input value to the clicked button's label
    };


    return (
        <>
            <Header />
            <div className="container product-details-body">
                <div className='row1'>
                    <Breadcrumb categories={categories} selectedCategory={categoryId} />
                </div>
                <div className='row2'>
                    <div className='col-left'>
                        <ItemImgGallery gallery={product.images?.map(image => image.image_url)} />
                    </div>
                    <div className='col-right'>
                        <div className='prod-details-title'><span>{product.product_name}</span></div>
                        <div className='prod-details-price'><span>₱{Number(product.price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</span></div>
                        <div><span><b>Condition:</b>&nbsp;{product.product_condition}</span></div>
                        <div className='prod-details-deal-method'>
                            <div className='col1'><b>Deal Method:</b></div>
                            <div className='col2'>
                                <div><span>Meet Up - </span><img src={AllPhIcon} alt="" className='deal-method-loc-icon' /><span> MCU-Monumento, Morning Breeze Subdivision</span></div>
                                <div><span>Delivery - </span><img src={AllPhIcon} alt="" className='deal-method-loc-icon' /><span> 186 Blumentritt Tondo Manila</span></div>
                            </div>
                        </div>
                        <div className='prod-details-listed-in'><small>Listed in {product.seller?.city}, {product.seller?.region}, Philippines</small></div>
                        <div><img src={ListedInMap} alt="" /></div>
                        <div>
                            <div className='prod-details-icon-btn'>
                                <div>
                                    <WishlistButton
                                        data={product}
                                        addToWishlist={addToWishlist}
                                        removeFromWishlist={removeFromWishlist}
                                        userId={user?.id}
                                        wishlistCount={wishlistCount}
                                        setWishlistCount={setWishlistCount}
                                        getWishlistCount={getWishlistCount}
                                    />
                                </div>
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
                            <span className='time-posted'><b>Posted:</b> {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true, locale: enUS })}</span>
                            <hr />
                            <div className='prod-details-title-desc'><h2>{product.product_name}</h2></div>
                            <div className='prod-details-spec'><p>{product.description}</p>
                            </div>
                            <div className="product-details-review">
                                <div className='review-for'>
                                    <h5>Reviews for {product.seller?.display_name}</h5>
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
                                <div><h5>Seller Information</h5><small>Joined in {formattedDate}</small></div>
                                <div className='row2'>
                                    <div className='col-left'><Link to={`/profile/${product.seller?.id}`}><img src={product.seller?.profile_pic || AvatarIcon} alt="" className='customer-pic' /></Link></div>
                                    <div className='col-right'>
                                        <Link to={`/profile/${product.seller?.id}`} className='seller-name'>{product.seller?.display_name}</Link>
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
                                {user ? (
                                    <>
                                        {isProductOwner ? (
                                            // If the user is the product owner, hide the chat-related elements
                                            null
                                        ) : (
                                            <>
                                                {chatId ? (
                                                    <>
                                                        <BtnGreen label='View Chat' onClick={viewChat} className="view-chat-btn" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className='row3'>
                                                            <textarea
                                                                cols="44"
                                                                rows="5"
                                                                value={input}
                                                                onChange={(e) => setInput(e.target.value)}
                                                                placeholder='Write a custom message...'
                                                                className='custom-message'></textarea>
                                                        </div>
                                                        <div className='row4'>
                                                            <BtnClear label="Is this item still available?" className='prod-details-inquiry-form-btn' onClick={() => handleBtnClearClick('Is this item still available?')} />
                                                            <BtnClear label="Is the price negotiable?" className='prod-details-inquiry-form-btn' onClick={() => handleBtnClearClick('Is the price negotiable?')} />
                                                            <BtnClear label="Do you deliver?" className='prod-details-inquiry-form-btn' onClick={() => handleBtnClearClick('Do you deliver?')} />
                                                            <BtnGreen
                                                                label="Send Message"
                                                                className='send-message'
                                                                onClick={sendMessage}
                                                                disabled={!input.trim()} // Disable if input is empty or contains only whitespace
                                                            />
                                                            <div className='input-make-offer-container'>
                                                                <span className='php-symbol'>₱</span>
                                                                <Input
                                                                    type='number'
                                                                    className='input-make-offer'
                                                                />
                                                                <BtnGreen label="Make Offer" className='make-offer-btn' />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Link to="/LoginEmail" className='signin-make-offer'>Sign in to send message</Link>
                                    </>
                                )}

                            </div>
                            <div className="prod-details-ads">
                                YOUR ADS HERE
                            </div>
                        </div>
                    </div>
                </div>
                <RelatedListings data={product} />
                <div><MoreFromSeller data={product} /></div>
            </div >
            <Footer />
        </>
    )
}

export default ProductDetails