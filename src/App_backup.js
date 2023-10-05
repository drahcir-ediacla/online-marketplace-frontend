import React, { useEffect, useState } from 'react';
import '../src/assets/styles/global.css';
import axios from './apicalls/axios'
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
import MainCategory from './pages/Categories/MainCategory'
import SubCategory from './pages/Categories/SubCategory'
import DeactivateAccount from './pages/Settings/DeactivateAccount'
import SetPassword from './pages/Settings/SetPassword'
import Wishlist from './pages/Wishlist'
import AddListing from './pages/AddListing/AddListing'
import Dashboard from './pages/AdminPanel/Dashboard'
import ScrollToTop from './utils/ScrollToTop'
import LoadingSpinner from './components/LoadingSpinner'


const GET_USER_LOGIN = '/auth/check-auth';



function App() {

  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true); 

  useEffect(() => {
    const getUser = () => {
      axios.get(GET_USER_LOGIN, {
        withCredentials: true, 
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.data; // Use response.data to access JSON data
          throw new Error("Authentication has failed!");
        })
        .then((resObject) => {
          console.log("User data:", resObject.user);
          setUser(resObject.user);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    getUser();
  }, []);



  return (
    <>
      <Router>
        <ScrollToTop />
        {isLoading ? ( // Render loading component while fetching data
          <LoadingSpinner />
        ) : (
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
          <Route path='/BuyerProductDetails' element={<BuyerProductDetails />} />
          <Route path='/MainCategory' element={<MainCategory />} />
          <Route path='/SubCategory' element={<SubCategory />} />
          <Route path='/Wishlist' element={<Wishlist />} />
          <Route path='/DeactivateAccount' element={<DeactivateAccount />} />
          <Route path='/SetPassword' element={<SetPassword />} />
          <Route path='/AddListing' element={<AddListing />} />
          <Route path='/Dashboard' element={<Dashboard />} />
        </Routes>
        )}
      </Router>
    </>
  );
}

export default App;
