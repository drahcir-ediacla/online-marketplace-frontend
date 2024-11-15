import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/Yogeek-logo.png';
import SearchBox from './SearchByLoc';
import BtnGreen from '../../components/Button/BtnGreen'
import SlidingSideNav from '../SlidingSideNav'
import LoginModal from '../../components/Modal/LoginModal';



const StickyHeader = ({ authenticated }) => {

    const navigate = useNavigate();
    const [isSticky, setIsSticky] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false)

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


    const handleHomePageClick = () => {
        // Check if the current location is already the homepage
        if (navigate && window.location.pathname === '/') {
            // Refresh the page or scroll to the top
            // window.location.reload(); // Refresh the page
            // OR
            window.scrollTo(0, 0); // Scroll to the top
        }
    };

    const handleLoginModal = () => {
        if (!authenticated) {
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
            <div id="sticky-header" className={`sticky-header ${isSticky ? 'sticky' : ''}`}>
                <div className='container'>
                    <div className='sticky-navbar'>
                        <div className='col1'>
                            <Link to="/" onClick={handleHomePageClick}>
                                <img src={Logo} alt='' className='logo' />
                            </Link>
                        </div>
                        <div className='col2'>
                            <SearchBox />
                        </div>
                        <div className='col3'>
                            <div>
                                <SlidingSideNav />
                            </div>
                            <div>
                                <BtnGreen onClick={handleLoginModal} label="Sell" className="sticky-header-sell-btn" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default StickyHeader
