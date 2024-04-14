import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Setloader } from '../../redux/reducer/loadersSlice'
import useAuthentication from '../../hooks/authHook'
import { GetAllProducts, GetUserWishlist, AddWishlist, RemoveWishlist } from '../../apicalls/products';
import './style.scss'
import { Link } from 'react-router-dom'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import ProductCard from '../../components/Cards/ProductCard'
import SadImage from '../../assets/images/page-not-found-image.png'

const Wishlist = ({ userId }) => {

    const { user } = useAuthentication();
    const [wishlist, setwishlist] = useState([]);
    const [data, setData] = useState([]);
    const [err, setErr] = useState(false);
    const dispatch = useDispatch();

    const [productStates, setProductStates] = useState({});
    const [wishlistCount, setWishlistCount] = useState({});
    const [wishListEmpty, setwishlistEmpty] = useState([])


    

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



    useEffect(() => {
        const fetchData = async () => {
            dispatch(Setloader(true));

            try {
                // Fetch the user's wishlist
                const response = await GetUserWishlist();
                if (response.data && Array.isArray(response.data)) {
                    setwishlist(response.data);
                    setwishlistEmpty(response.data.length === 0);
                } else {
                    // Handle the case where the data is not an array
                    console.error('Received invalid wishlist data:', response.data);
                }


                // Fetch all products
                const prodResponse = await GetAllProducts();
                setData(prodResponse.data)
                dispatch(Setloader(false));

            } catch (error) {
                dispatch(Setloader(false));
                console.error('Error fetching wishlist data:', error);

                // Check if the error is due to unauthorized access
                if (error.response && error.response.status === 500) {
                    return error.message
                    // Handle unauthorized access, e.g., redirect to login
                } else {
                    // Handle other errors
                    setErr(true); // Depending on your requirements
                }
            }
        }
        fetchData();
    }, [dispatch])


    const mywishlist = useMemo(() => Array.isArray(wishlist) ? wishlist : [], [wishlist]);



    // Use useCallback to memoize the function
    const getWishlistCount = useCallback((productId) => {
        const productData = data.find((product) => product.id === productId);
        return productData ? (productData.wishlist ? productData.wishlist.length : 0) : 0;
    }, [data]);


    // Use useEffect to update wishlist count after state changes
    useEffect(() => {
        // Update wishlist count for all products
        const updatedWishlistCounts = {};
        mywishlist.forEach((product) => {
            updatedWishlistCounts[product.id] = getWishlistCount(product.id);
        });

        // Set the updated wishlist counts
        setWishlistCount(updatedWishlistCounts);

        console.log('Wishlist count updated:', updatedWishlistCounts);
    }, [productStates, mywishlist, getWishlistCount]);



    // Initialize productStates based on initial wishlist data
    useEffect(() => {
        const initialProductStates = {};
        mywishlist.forEach((product) => {
            const isProductInWishlist = Array.isArray(product.wishlist) && product.wishlist.some((entry) => String(entry.user_id) === String(userId));
            initialProductStates[product.id] = isProductInWishlist;
        });
        console.log('Initial Product States:', initialProductStates);
        setProductStates(initialProductStates);
    }, [mywishlist, userId]);

   

    return (
        <>
            <Header />
            <div className='container wishlist-body'>
                <div className="wishlist-row1">
                    <ul className='breadcrumb'>
                        <li><Link to='/'>Home</Link></li>
                        <li>Wishlist</li>
                    </ul>
                </div>
                <div className="wishlist-row2">
                    <div className='wishlist-title'>
                        <h3>My Wishlist</h3>
                        <h5>You have {wishlist.length} item(s) on your wishlist</h5>
                    </div>
                    {wishListEmpty ? (<div className='wishlist-empty'>
                        <div>
                            <img src={SadImage} alt="" />
                        </div>
                        <h4>Your Wishlist is Empty</h4>
                    </div>
                    ) : (
                    <div className='wishlist-items'>
                        <ProductCard
                            data={mywishlist || []}
                            addToWishlist={addToWishlist}
                            removeFromWishlist={removeFromWishlist}
                            userId={user?.id}
                            productStates={productStates}
                            setProductStates={setProductStates}
                            wishlistCount={wishlistCount}
                            setWishlistCount={setWishlistCount}
                            getWishlistCount={getWishlistCount}
                        />
                    </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Wishlist