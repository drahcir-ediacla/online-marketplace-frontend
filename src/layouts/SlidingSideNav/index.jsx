import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './style.scss'
import axios from '../../apicalls/axios'
import NavCategories from '../SlidingSideNav/NavCategories'
import { ReactComponent as GridIcon } from '../../assets/images/grid-icon.svg';
import { ReactComponent as MagnifyingGlass } from '../../assets/images/magnifying-glass.svg';
import AvatarIcon from '../../assets/images/avatar-icon.png'

const GET_USER_LOGIN = '/auth/check-auth';

const SlidingSideNav = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  useEffect(() => {
    const getUser = () => {
      axios.get(GET_USER_LOGIN, {
        withCredentials: true, // Include credentials (cookies) in the request
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
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);



  return (
    <>
      <div className='btm-border' id='all-category-icon' onClick={toggleMenu}>
        <Link to="#" className='parent-menu'>
          <div className='grid-icon'><GridIcon /></div>
          All Categories
        </Link>
      </div>
      <div id='SlidingMenu' style={{ right: isMenuOpen ? '0' : '-435px' }}>
        <div id='menuBkgrnd' style={{ right: isMenuOpen ? '0' : '-100%' }} onClick={toggleMenu}></div>
        <nav id='menuBox'>
          <div className='col-left'>
            <div id="closeBtn" onClick={toggleMenu}>
              <i class="fa fa-times"></i>
            </div>
          </div>
          <div className='col-right'>
            <div className='row1'>
              {user ? (
                <div>
                  {user.profile_pic && user.profile_pic.length > 0 ? (
                    <div className="avatar-icon">
                      <Link to='/MyProfile'><img src={user.profile_pic} alt="" /></Link>
                    </div>
                  ) : (
                    <div className="avatar-icon">
                      <Link to='/MyProfile'><img src={AvatarIcon} alt="" /></Link>
                    </div>
                  )}
                  <Link to='/MyProfile'><h5>{user.display_name}</h5></Link>
                </div>
              ) : (
                <div>
                  <div className="avatar-icon">
                    <img src={AvatarIcon} alt="" />
                  </div>
                  <Link to='/LoginEmail'><h4>Hello, sign in</h4></Link>
                </div>
              )}
            </div>
            <div className='row2'>
              <div>
                <h5>All Categories</h5>
                <div className='search-container'>
                  <input type="text" placeholder='Search Categories' />
                  <button><div className='magnifying-glass'><MagnifyingGlass /></div></button>
                </div>
              </div>
            </div>
            <div className='row3'>
              <NavCategories />
            </div>
          </div>

        </nav>
      </div>
    </>
  )
}

export default SlidingSideNav
