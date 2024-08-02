import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './style.scss'
import Logo from '../../assets/images/Yogeek-logo.png';
import LogoIcon from '../../assets/images/yogeek-icon-logo.png'
import ChatMessageIcon from '../../components/ChatMessageIcon';
import SlidingSideNav from '../SlidingSideNav';
import AccountNav from '../../components/AccountNav';
import SmallScreenSearchByLoc from './SmallScreenSearchByLoc';

const StickySmallScreenHeader = ({ user }) => {

    const [isSticky, setIsSticky] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
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


    const handleHomePageClick = () => {
        // Check if the current location is already the homepage
        if (navigate && window.location.pathname === '/') {
            // Refresh the page or scroll to the top
            // window.location.reload(); // Refresh the page
            // OR
            window.scrollTo(0, 0); // Scroll to the top
        }
    };


    const messages = () => {
        window.location.href = '/messages';
    }

    return (
        <>
            <div className={`tablet-header ${isSticky ? 'sticky-responsive-header' : ''}`}>
                <div className="tablet-header-row1">
                    <div className='tablet-header-row1-col1'>
                        <Link to="/" onClick={handleHomePageClick}>
                            <img src={Logo} alt='' className='small-screen-logo' />
                        </Link>
                        <Link to="/" onClick={handleHomePageClick}>
                            <img src={LogoIcon} alt='' className='logo-icon' />
                        </Link>
                    </div>

                    <div className='tablet-header-row1-col2'>
                        <div><SmallScreenSearchByLoc /></div>
                        {user &&
                            <div className="message-icon-container" onClick={messages}>
                                <ChatMessageIcon className='custom-message-icon' counterStyle='message-counter' />
                            </div>
                        }
                        <div className="user-account-icon">
                            <AccountNav />
                        </div>
                        <SlidingSideNav />
                    </div>
                </div>
                {/* <div className="tablet-header-row2">
                    <div className='tablet-header-row2-col1'>
                        <input type='text' className='search-box-tablet-header' />
                        <button><div className='magnifying-glass'><MagnifyingGlass /></div></button>
                    </div>
                </div> */}

            </div>

        </>
    )
}

export default StickySmallScreenHeader
