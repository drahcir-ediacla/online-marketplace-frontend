import React, {useEffect, useState} from 'react';
import axios from "../../apicalls/axios";
import {Link} from 'react-router-dom';
import '../Header/style.scss';
import {ReactComponent as MessageIcon} from '../../assets/images/message-regular.svg';
import {ReactComponent as HeartIcon} from '../../assets/images/heart-regular.svg';
import {ReactComponent as BellIcon} from '../../assets/images/bell-regular.svg';
import {ReactComponent as GlobeIcon} from '../../assets/images/globe-regular.svg';
import { ReactComponent as TriangleIcon } from '../../assets/images/triangle-up.svg';
import Logo from '../../assets/images/Yogeek-logo.png';
import RangeSlider from './RangeSlider';
import SearchBox from './HeaderSearchBox';
import NavMenu from './NavMenu';

const GET_USER_LOGIN = '/auth/login/success';

function Header() {

  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const getUser = () => {
  //     fetch("https://yogeek-server.onrender.com/auth/login/success", {
  //       method: "GET",
  //       credentials: "include",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         "Access-Control-Allow-Credentials": true,
  //       },
  //     })
  //       .then((response) => {
  //         if (response.status === 200) return response.json();
  //         throw new Error("authentication has been failed!");
  //       })
  //       .then((resObject) => {
  //         setUser(resObject.user);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };
  //   getUser();
  // }, []);

  useEffect(() => {
    const getUser = () => {
      axios.get(GET_USER_LOGIN, {
        withCredentials: true, // Include credentials (cookies) in the request
      })
      .then((response) => {
        if (response.status === 200) return response.data; // Use response.data to access JSON data
        throw new Error("Authentication has failed!");
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

  const logout = () => {
    window.open("https://yogeek-server.onrender.com/auth/logout", "_self");
  };
  
  // const logout = () => {
  //   const localBaseUrl = process.env.REACT_APP_BASE_URL;
  //   const logoutPath = '/auth/logout';
  
  //   // Combine the base URL and the logout path
  //   const logoutUrl = `${localBaseUrl}${logoutPath}`;
    
  //   window.open(logoutUrl, '_self');
  // };

  return (
    <>
      <header>
        <div className='row1'>
            <div className='container'>
              <div className='col-left'>
                <div className='language-selector'>
                  <div className='globe-icon'><GlobeIcon /></div>
                  <span>English</span>
                  <span><i class="arrow down"></i></span>
                  <div className='language-list'>
                    <ul>
                      <li>English</li>
                      <li>中國語</li>
                      <li>한국어</li>
                      <li>日本語</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className='col-right'>
                {user ? ( 
                <>
                  <div className='nav-tools'>
                    <div className='message-icon'><MessageIcon /></div>
                    <div className='bell-icon'><BellIcon /></div>
                    <Link to='/Wishlist' className='heart-icon'><HeartIcon /></Link>
                  </div>
                  <span><Link to='/AddListing' className='sell-btn'>Sell</Link></span>
                  <div className='my-account'>
                    <span>My Account</span>
                    <div className='my-account-dropdown'>
                    <div className='triangle-icon'><TriangleIcon /></div>
                    <ul>
                      <li><Link to='/EditProfile'>Manage Account</Link></li>
                      <li><Link to='/MyProfile'>My Profile</Link></li>
                      <li><Link to='/DeactivateAccount'>Settings</Link></li>
                      <li>Help & Support</li>
                      <li><Link onClick={logout}>Logout</Link></li>
                    </ul>
                    </div>
                  </div>
                </>
                ) : (
                  <div className='login-register'>
                    <Link to='/LoginEmail'>SELL</Link>
                    <Link to='/LoginEmail'>LOGIN</Link>
                    <Link to='/RegisterByEmail'>REGISTER</Link>
                  </div>
                )}
              </div>
            </div>
        </div>
        <div className='row2'>
          <div className='container'>
            <div className='col1'>
              <Link to="/">
                <img src={Logo} alt='' className='logo' />
              </Link>
            </div>
            <div className='col2'>
              <SearchBox />
            </div>
            <div className='col3'>
              <RangeSlider />
            </div>
          </div>
        </div>
        <div className='row3'>
          <div className='container'>
            <NavMenu user={user} />
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
