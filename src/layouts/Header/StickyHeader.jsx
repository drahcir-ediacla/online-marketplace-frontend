import React, { useEffect, useState } from 'react';
// import axios from '../../apicalls/axios'
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/Yogeek-logo-gray.png';
import SearchBox from '../Header/HeaderSearchBox';
import NavCategories from '../SlidingSideNav/NavCategories'
import BtnGreen from '../../components/Button/BtnGreen'
import { ReactComponent as GridIcon } from '../../assets/images/grid-icon.svg';
import { ReactComponent as MagnifyingGlass } from '../../assets/images/magnifying-glass.svg';
import AvatarIcon from '../../assets/images/avatar-icon.png'

// const GET_USER_LOGIN = '/auth/check-auth';

const StickyHeader = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isSticky, setIsSticky] = useState(false);


    useEffect(() => {
        const getUser = async () => {
          try {
            const response = await fetch("https://yogeek-server.onrender.com/auth/check-auth", {
              method: "GET",
              credentials: "include",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
              },
            });
    
            if (response.status === 200) {
              const resObject = await response.json();
              setUser(resObject.user);
            } else {
              // Handle the case where the user is not authenticated
              setUser(null); // Set user to null or handle the absence of user data
            }
          } catch (err) {
            console.log(err);
          }
        };
    
    
        getUser();
      }, []);


    const toggleMenu = () => {
        setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 80) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    return (
        <>
            <div id="sticky-header" className={`sticky-header ${isSticky ? 'sticky' : ''}`}>
                <div className='container'>
                    <div className='sticky-navbar'>
                        <div className='col1'>
                            <Link to="/">
                                <img src={Logo} alt='' className='logo' />
                            </Link>
                        </div>
                        <div className='col2'>
                            <SearchBox />
                        </div>
                        <div className='col3'>
                            <div>
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
                                                        {user.photos && user.photos.length > 0 ? (
                                                            <div className="avatar-icon">
                                                                <img src={user.photos[0].value} alt="" />
                                                            </div>
                                                        ) : (
                                                            <div className="avatar-icon">
                                                                <img src={AvatarIcon} alt="" />
                                                            </div>
                                                        )}
                                                        <Link to='#'><h5>{user.display_name}</h5></Link>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="avatar-icon">
                                                            <img src={AvatarIcon} alt="" />
                                                        </div>
                                                        <Link to='/LoginEmail'><h5>Hello, sign in</h5></Link>
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
                            </div>
                            <div>
                                <BtnGreen to="/AddListing" label="Sell" className="sticky-header-sell-btn" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default StickyHeader
