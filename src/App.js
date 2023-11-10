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
import MyProfile from './pages/Profile/MyProfile'
import BuyerProductDetails from './pages/ProducDetails/BuyerProductDetails'
import ProductDetails from './pages/ProducDetails/ProductDetails'
import MainCategory from './pages/Categories/MainCategory'
import SubCategory from './pages/Categories/SubCategory'
import DeactivateAccount from './pages/Settings/DeactivateAccount'
import SetPassword from './pages/Settings/SetPassword'
import Wishlist from './pages/Wishlist'
import AddListing from './pages/AddListing/AddListing'
import Dashboard from './pages/AdminPanel/Dashboard'
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
          <Route path='/LoginEmail' element={user ? <Navigate to="/" /> : <LoginEmail />} />
          <Route path='/LoginPhone' element={user ? <Navigate to="/" /> : <LoginPhone />} />
          <Route path='/LoginSMS' element={user ? <Navigate to="/" /> : <LoginSMS />} />
          <Route path='/ResetByEmail' element={user ? <Navigate to="/" /> : <ResetByEmail />} />
          <Route path='/ResetByPhone' element={user ? <Navigate to="/" /> : <ResetByPhone />} />
          <Route path='/RegisterByEmail' element={user ? <Navigate to="/" /> : <RegisterByEmail />} />
          <Route path='/RegisterByPhone' element={user ? <Navigate to="/" /> : <RegisterByPhone />} />
          <Route path='/EditProfile' element={<EditProfile />} />
          <Route path='/MyProfile' element={<MyProfile />} />
          <Route path='/ProductDetails/:id/:name' element={<ProductDetails />} />
          <Route path='/BuyerProductDetails' element={<BuyerProductDetails />} />
          <Route path='/MainCategory' element={<MainCategory />} />
          <Route path='/SubCategory' element={<SubCategory />} />
          <Route path='/Wishlist' element={<Wishlist />} />
          <Route path='/DeactivateAccount' element={<DeactivateAccount />} />
          <Route path='/SetPassword' element={<SetPassword />} />
          <Route path='/AddListing' element={<AddListing />} />
          <Route path='/Dashboard' element={<Dashboard />} />
          <Route path='/test' element={<TestPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
