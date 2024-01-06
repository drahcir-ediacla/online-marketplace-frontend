import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import '../Header/style.scss';
import axios from '../../apicalls/axios'
import { ReactComponent as MessageIcon } from '../../assets/images/message-regular.svg';
import { ReactComponent as HeartIcon } from '../../assets/images/heart-regular.svg';
import { ReactComponent as BellIcon } from '../../assets/images/bell-regular.svg';
import { ReactComponent as GlobeIcon } from '../../assets/images/globe-regular.svg';
import { ReactComponent as TriangleIcon } from '../../assets/images/triangle-up.svg';
import Logo from '../../assets/images/Yogeek-logo.png';
import RangeSlider from './RangeSlider';
import SearchBox from './HeaderSearchBox';
import NavMenu from './NavMenu';
import StickyHeader from './StickyHeader';

const GET_USER_LOGIN = '/auth/check-auth';

function Header() {


  const [user, setUser] = useState(null);


  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(GET_USER_LOGIN, {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
        });

        if (response.status === 200 && response.data.success) {
          const resObject = response.data;
          console.log('User data:', resObject.user);
          setUser(resObject.user);
        } else {
          throw new Error('Authentication has failed!');
        }
      } catch (err) {
        console.error(err);
      }
    };

    getUser();
  }, []); // Ensure that you pass an empty dependency array if you want the effect to run once on mount


  const myProfile = () => {
    if (user) {
      const userId = user.id;
      window.location.href = `/profile/${userId}`;
    }
  };

  

     const mywishlist = () => {
      if (user) {
        const userId = user?.id;
        window.location.href = `/wishlist/${userId}`;
      }
    };

  const logout = () => {
    const localBaseUrl = process.env.REACT_APP_BASE_URL;
    const logoutPath = '/api/logout';

    const logoutUrl = `${localBaseUrl}${logoutPath}`;

    window.open(logoutUrl, '_self');
  };

  useEffect(() => {
    const collapsibleElements = document.getElementsByClassName("collapsible");

    const handleCollapsibleClick = function () {
      this.classList.toggle("active");
      const content = this.nextElementSibling;

      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    };

    for (let i = 0; i < collapsibleElements.length; i++) {
      collapsibleElements[i].addEventListener("click", handleCollapsibleClick);
    }

    return () => {
      // Clean up event listeners when the component unmounts
      for (let i = 0; i < collapsibleElements.length; i++) {
        collapsibleElements[i].removeEventListener("click", handleCollapsibleClick);
      }
    };
  }, []);






  return (
    <>
      <header>
        <div><StickyHeader authenticated={user} /></div>
        <div className='row1'>
          <div className='container'>
            <div className='col-left'>
              <div className='language-selector'>
                <div className='globe-icon'><GlobeIcon /></div>
                <span>English</span>
                <span><i className="arrow down"></i></span>
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
                    <Link onClick={mywishlist} className='heart-icon'><HeartIcon /></Link>
                  </div>
                  <span><Link to='/addlisting' className='sell-btn'>Sell</Link></span>
                  <div className='my-account'>
                    <Link to='/editprofile' className='sell-btn'><span>My Account</span></Link>
                    <div className='my-account-dropdown'>
                      <div className='triangle-icon'><TriangleIcon /></div>
                      <ul>
                        <li><Link to='/editprofile'>Manage Account</Link></li>
                        <li><Link onClick={myProfile}>My Profile</Link></li>
                        <li><Link to='/settings/1'>Settings</Link></li>
                        <li>Help & Support</li>
                        <li><Link onClick={logout}>Logout</Link></li>
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <div className='login-register'>
                  <Link to='/loginemail'>SELL</Link>
                  <Link to='/loginemail'>LOGIN</Link>
                  <Link to='/registerbyemail'>REGISTER</Link>
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
            <div>
              <NavMenu />
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header