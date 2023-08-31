
import React from 'react';
import '../src/assets/styles/global.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ScrollToTop from './utils/ScrollToTop'


function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
          <Routes>
            <Route index element={<Home />} />
            <Route path='/LoginEmail' element={<LoginEmail />} />
            <Route path='/LoginPhone' element={<LoginPhone />} />
            <Route path='/LoginSMS' element={<LoginSMS />} />
            <Route path='/ResetByEmail' element={<ResetByEmail />} />
            <Route path='/ResetByPhone' element={<ResetByPhone />} />
            <Route path='/RegisterByEmail' element={<RegisterByEmail />} />
            <Route path='/RegisterByPhone' element={<RegisterByPhone />} />
            <Route path='/EditProfile' element={<EditProfile />} />
            <Route path='/MyProfile' element={<MyProfile />} />
            <Route path='/BuyerProductDetails' element={<BuyerProductDetails />} />
            <Route path='/MainCategory' element={<MainCategory />} />
            <Route path='/SubCategory' element={<SubCategory />} />
          </Routes>
      </Router>
    </>
  );
}

export default App;
