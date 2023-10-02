import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/Yogeek-logo-gray.png';
import SearchBox from '../Header/HeaderSearchBox';
import BtnGreen from '../../components/Button/BtnGreen'
import SlidingSideNav from '../SlidingSideNav'



const StickyHeader = () => {

    const [isSticky, setIsSticky] = useState(false);

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
                                <SlidingSideNav />
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
