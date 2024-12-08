import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import { getUser } from '../../redux/actions/userActions';
import '../Header/style.scss';
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
import GTranslate from '../../components/GTranslate';
import LoginModal from '../../components/Modal/LoginModal';

const GET_USER_LOGIN = '/auth/check-auth';

function Header() {

  const navigate = useNavigate();
  const [soldModalOpen, setSoldModalOpen] = useState(false);
  const user = useSelector((state) => state.user.data);
  // const dispatch = useDispatch()
  const [radius, setRadius] = useState(() => {
    const savedRadius = localStorage.getItem('radius');
    return savedRadius ? JSON.parse(savedRadius) : 15;
  });
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [placeName, setPlaceName] = useState(() => {
    const savedPlaceName = localStorage.getItem('placeName');
    return savedPlaceName ? JSON.parse(savedPlaceName) : null;
  });
  const [showAlert, setShowAlert] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  // useEffect(() => {
  //   dispatch(getUser())
  // }, [dispatch]);


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

  const getPlaceName = async (latitude, longitude) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY; // Replace with your actual API key
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();
      if (data.status === 'OK') {
        const placeRoute = data.results[0].address_components[1].long_name;
        const placeLocality = data.results[0].address_components[2].long_name;
        setPlaceName(`${placeRoute}, ${placeLocality}`)
        // Do something with the place name
      } else {
        console.error('Geocoding error:', data.status);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const roundToDecimal = (number, decimals) => {
    const factor = Math.pow(10, decimals);
    return Math.round(number * factor) / factor;
  };


  const openLocationRadiusModal = () => {
    setShowAlert(false);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const roundedLatitude = roundToDecimal(position.coords.latitude, 4); // Round to 4 decimal points
        const roundedLongitude = roundToDecimal(position.coords.longitude, 4); // Round to 4 decimal points
        setLatitude(roundedLatitude);
        setLongitude(roundedLongitude);
        getPlaceName(roundedLatitude, roundedLongitude); // Use the rounded values
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

  const checkLocationPermission = async () => {
    if (!navigator.permissions) return false;
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state === 'granted';
    } catch (error) {
      console.error('Error checking location permission:', error);
      return false;
    }
  };

  // Effect to check permission and update state accordingly
  useEffect(() => {
    const updateStateAndLocalStorage = async () => {
      const hasLocationAccess = await checkLocationPermission();
      if (hasLocationAccess) {
        localStorage.setItem('radius', JSON.stringify(radius));
        localStorage.setItem('placeName', JSON.stringify(placeName));
        const savedPlaceName = localStorage.getItem('placeName');
        if (savedPlaceName && !placeName) {
          setPlaceName(() => {
            const savedPlaceName = localStorage.getItem('placeName');
            return savedPlaceName ? JSON.parse(savedPlaceName) : null;
          });
        }
      } else {
        localStorage.removeItem('radius');
        localStorage.removeItem('placeName');
        setRadius(15);
        setPlaceName(null);
      }
    };
    updateStateAndLocalStorage();
  }, [radius, placeName]);

  const handleLoginModal = () => {
    if (!user) {
      setLoginModalOpen(true)
    } else {
      navigate('/addlisting');
    }
  };

  const toggleLoginModal = () => {
    setLoginModalOpen((prevLoginModalOpen) => !prevLoginModalOpen)
  }


  return (
    <>
      {loginModalOpen && <LoginModal onClick={toggleLoginModal} />}
      {showAlert && <AlertMessage type="error" message={errMsg} className='alert-box' />}
      {soldModalOpen &&
        <LocationRadiusModal
          onClick={toggleSoldModal}
          onRadiusChange={setRadius}
          currentRadius={radius}
          latitude={latitude}
          longitude={longitude}
          placeName={placeName}
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
                  {/* <span>English</span>
                  <span><i className="arrow down"></i></span>
                  <div className='language-list'>
                    <ul>
                      <li>English</li>
                      <li>中國語</li>
                      <li>한국어</li>
                      <li>日本語</li>
                    </ul>
                  </div> */}
                  <GTranslate />
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
                    <Link to='/addlisting' className='sell-btn'><span>Sell</span></Link>
                    <div className='my-account'>
                      <Link to='/editprofile' className='sell-btn'><span>My Account</span></Link>
                      <div className="my-account-dropdown-container">
                        <div className='my-account-dropdown'>
                          <div className='triangle-icon'><TriangleIcon /></div>
                          <ul>
                            <li><Link to='/editprofile'>Manage Account</Link></li>
                            <li><Link onClick={myProfile}>My Profile & Listings</Link></li>
                            <li><Link to='/forum'>Community</Link></li>
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
                    <button onClick={handleLoginModal} className='login-modal'>SELL</button>
                    <button onClick={handleLoginModal} className='login-modal'>LOGIN</button>
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
                <SearchBox radius={radius} placeName={placeName} setPlaceName={setPlaceName} />
              </div>
              <div className='col3'>
                <div className='location-container'>
                  <div className='user-location'>
                    <div className='location-icon'>
                      <LocationIcon />
                    </div>
                    {placeName === null ? (
                      <button onClick={openLocationRadiusModal}>Set Your Location Radius</button>
                    ) : (
                      <button onClick={openLocationRadiusModal}>{`${placeName} · ${radius}km`}</button>
                    )}
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
        <SmallScreenHeader user={user} />
      </header>
    </>
  )
}

export default Header