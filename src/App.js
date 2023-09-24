import React, {useEffect, useState} from 'react';
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
import MainCategory from './pages/Categories/MainCategory'
import SubCategory from './pages/Categories/SubCategory'
import DeactivateAccount from './pages/Settings/DeactivateAccount'
import SetPassword from './pages/Settings/SetPassword'
import Wishlist from './pages/Wishlist'
import AddListing from './pages/AddListing/AddListing'
import ScrollToTop from './utils/ScrollToTop'

// const GET_USER_LOGIN = '/auth/login/success';

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = () => {
      fetch("https://yogeek-server.onrender.com/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Origin": true,
          "Access-Control-Allow-Methods": true,
          "Access-Control-Allow-Headers": true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("authentication has been failed!");
        })
        .then((resObject) => {
          setUser(resObject.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);
  
  return (
    <>
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
            <Route path='/BuyerProductDetails' element={<BuyerProductDetails />} />
            <Route path='/MainCategory' element={<MainCategory />} />
            <Route path='/SubCategory' element={<SubCategory />} />
            <Route path='/Wishlist' element={<Wishlist />} />
            <Route path='/DeactivateAccount' element={<DeactivateAccount />} />
            <Route path='/SetPassword' element={<SetPassword />} />
            <Route path='/AddListing' element={<AddListing />} />
          </Routes>
      </Router>
    </>
  );
}

export default App;
