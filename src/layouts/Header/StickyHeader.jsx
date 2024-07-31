import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/Yogeek-logo.png';
import SearchBox from './SearchByLoc';
import BtnGreen from '../../components/Button/BtnGreen'
import SlidingSideNav from '../SlidingSideNav'



const StickyHeader = ({ authenticated }) => {

    const [isSticky, setIsSticky] = useState(false);
    const navigate = useNavigate();

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


    return (
        <>
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
                            {authenticated ? (
                                <div>
                                    <BtnGreen to="/addlisting" label="Sell" className="sticky-header-sell-btn" />
                                </div>
                            ) : (
                                <div>
                                    <BtnGreen to="/loginemail" label="Sell" className="sticky-header-sell-btn" />
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default StickyHeader
