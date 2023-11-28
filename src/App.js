import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from './redux/actions/userActions';
import '../src/assets/styles/global.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home'
import LoginEmail from './pages/Auth/Login/LoginEmail'
import LoginPhone from './pages/Auth/Login/LoginPhone'
import LoginSMS from './pages/Auth/Login/LoginSMS'
import ResetByEmail from './pages/Auth/ResetPassword/ResetByEmail'
import ResetByPhone from './pages/Auth/ResetPassword/ResetByPhone'
import RegisterByEmail from './pages/Auth/RegisterAccount/RegisterByEmail'
import RegisterByPhone from './pages/Auth/RegisterAccount/RegisterByPhone'
import EditProfile from './pages/Profile/EditProfile'
import ProfilePage from './pages/Profile/ProfilePage'
import BuyerProductDetails from './pages/ProducDetails/BuyerProductDetails'
import ProductDetails from './pages/ProducDetails/ProductDetails'
import MainCategory from './pages/Categories/MainCategory'
import SubCategory from './pages/Categories/SubCategory'
import DeactivateAccount from './pages/Settings/DeactivateAccount'
import SetPassword from './pages/Settings/SetPassword'
import Wishlist from './pages/Wishlist'
import AddListing from './pages/AddListing/AddListing'
import AddListingSuccess from './pages/AddListing/AddListingSuccess'
import Dashboard from './pages/AdminPanel/Dashboard'
import PageNotFound from './pages/404/PageNotFound';
import TestPage from './pages/TestPage'
import ScrollToTop from './utils/ScrollToTop'
import LoadingSpinner from './components/LoadingSpinner'
import ProtectedPage from './components/ProtectedPage';



function App() {

  const user = useSelector((state) => state.user.data);
  const {loading} = useSelector(state => state.loaders);
  const dispatch = useDispatch();

  useEffect (() => {
    dispatch(getUser())
  }, [dispatch]);



  return (
    <>
    
    {loading && <LoadingSpinner />}
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" index element={<Home />} />
          <Route path='/loginemail' element={user ? <Navigate to="/" /> : <LoginEmail />} />
          <Route path='/loginphone' element={user ? <Navigate to="/" /> : <LoginPhone />} />
          <Route path='/loginsms' element={user ? <Navigate to="/" /> : <LoginSMS />} />
          <Route path='/resetbyemail' element={user ? <Navigate to="/" /> : <ResetByEmail />} />
          <Route path='/resetbyphone' element={user ? <Navigate to="/" /> : <ResetByPhone />} />
          <Route path='/registerbyemail' element={user ? <Navigate to="/" /> : <RegisterByEmail />} />
          <Route path='/registerbyphone' element={user ? <Navigate to="/" /> : <RegisterByPhone />} />
          <Route path='/editprofile' element={<EditProfile />} />
          <Route path='/myprofile' element={<ProfilePage />} />
          <Route path='/profile/:id' element={<ProfilePage />} />
          <Route path='/productdetails/:id/:name' element={<ProductDetails />} />
          <Route path='/buyerproductdetails' element={<BuyerProductDetails />} />
          <Route path='/maincategory' element={<MainCategory />} />
          <Route path='/subcategory/:id/:label' element={<SubCategory />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path='/deactivateaccount' element={<DeactivateAccount />} />
          <Route path='/setpassword' element={<SetPassword />} />
          <Route path='/addlisting' element={<AddListing />} />
          <Route path='/addlistingsuccess/:id/:name' element={<AddListingSuccess />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/test' element={<TestPage />} />
          <Route path='/*' element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
