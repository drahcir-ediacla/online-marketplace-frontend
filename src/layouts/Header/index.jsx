import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Header/style.scss';
import axios from '../../apicalls/axios'
import { ReactComponent as HeartIcon } from '../../assets/images/heart-regular.svg';
import { ReactComponent as GlobeIcon } from '../../assets/images/globe-regular.svg';
import { ReactComponent as TriangleIcon } from '../../assets/images/triangle-up.svg';
import { ReactComponent as LocationIcon } from '../../assets/images/location-solid-icon.svg'
import Logo from '../../assets/images/Yogeek-logo.png';
import SearchBox from './SearchByLoc';
import NavMenu from './NavMenu';
import StickyHeader from './StickyHeader';
import NotificationBell from '../../components/Notification';
import ChatMessageIcon from '../../components/ChatMessageIcon';
import SmallScreenHeader from './SmallScreenHeader';
import LocationRadiusModal from '../../components/Modal/SetLocationRadiusModal';
import AlertMessage from '../../components/AlertMessage';

const GET_USER_LOGIN = '/auth/check-auth';

function Header() {

  const [soldModalOpen, setSoldModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [radius, setRadius] = useState(() => {
    // Retrieve radius from localStorage if it exists, otherwise default to 15
    const savedRadius = localStorage.getItem('radius');
    return savedRadius ? JSON.parse(savedRadius) : 15;
  });
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [errMsg, setErrMsg] = useState('');



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

  const messages = () => {
    window.location.href = '/messages';
  }

  const mywishlist = () => {
    if (user) {
      const userId = user?.id;
      window.location.href = `/wishlist`;
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


  const openLocationRadiusModal = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setSoldModalOpen(true); // Set soldModalOpen to true on success
      },
      (error) => {
        // Handle error case
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrMsg("You denied Yogeek to use your current location.");
            break;
          case error.POSITION_UNAVAILABLE:
            setErrMsg("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setErrMsg("The request to get user location timed out.");
            break;
          case error.UNKNOWN_ERROR:
            setErrMsg("An unknown error occurred.");
            break;
        }
        setShowAlert(true); // Set showAlert to true on error
      }
    );
  };

  const toggleSoldModal = () => {
    setSoldModalOpen((prevSoldModalOpen) => !prevSoldModalOpen);
  }

  const handleRadiusChange = (newRadius) => {
    setRadius(newRadius);
  };



  return (
    <>
      {showAlert && <AlertMessage type="error" message={errMsg} className='alert-box' />}
      {soldModalOpen &&
        <LocationRadiusModal
          onClick={toggleSoldModal}
          onRadiusChange={handleRadiusChange}
          currentRadius={radius}
          latitude={latitude}
          longitude={longitude}
        />
      }
      <header>
        <div className="desktop-header">
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
                      <div className='header-message-icon-container' onClick={messages}>
                        <ChatMessageIcon />
                      </div>
                      <div className='header-notification-icon-container'>
                        <NotificationBell />
                      </div>
                      <div className='header-wishlist-icon-container' onClick={mywishlist}>
                        <div className='heart-icon'>
                          <HeartIcon />
                        </div>
                      </div>
                    </div>
                    <span><Link to='/addlisting' className='sell-btn'>Sell</Link></span>
                    <div className='my-account'>
                      <Link to='/editprofile' className='sell-btn'><span>My Account</span></Link>
                      <div className="my-account-dropdown-container">
                        <div className='my-account-dropdown'>
                          <div className='triangle-icon'><TriangleIcon /></div>
                          <ul>
                            <li><Link to='/editprofile'>Manage Account</Link></li>
                            <li><Link onClick={myProfile}>My Profile & Listings</Link></li>
                            <li><Link to='/settings/1'>Settings</Link></li>
                            <li>Help & Support</li>
                            <li><Link onClick={logout}>Logout</Link></li>
                          </ul>
                        </div>
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
                <SearchBox radius={radius} />
              </div>
              <div className='col3'>
                <div className='location-container'>
                  <div className='user-location'>
                    <div className='location-icon'>
                      <LocationIcon />
                    </div>
                    <button onClick={openLocationRadiusModal}>Set Your Location Radius</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row3'>
            <div className='container'>
              <NavMenu />
            </div>
          </div>
        </div>
        <SmallScreenHeader />
      </header>
    </>
  )
}

export default Header