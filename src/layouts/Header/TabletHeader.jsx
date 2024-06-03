import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './style.scss'
import { ReactComponent as MagnifyingGlass } from '../../assets/images/magnifying-glass.svg';
import Logo from '../../assets/images/Yogeek-logo-gray.png';
import SearchBox from '../../components/SearchBox'
import ChatMessageIcon from '../../components/ChatMessageIcon';
import { ReactComponent as UserIcon } from '../../assets/images/user-icon.svg'
import { ReactComponent as BurgerBtn } from '../../assets/images/burger-btn.svg'
import SlidingSideNav from '../SlidingSideNav';

const TabletHeader = () => {

    const navigate = useNavigate();

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
            <div className="tablet-header">
                <div className="tablet-header-row1">
                    <div className='tablet-header-row1-col1'>
                        <Link to="/" onClick={handleHomePageClick}>
                            <img src={Logo} alt='' className='logo' />
                        </Link>
                    </div>

                    <div className='tablet-header-row1-col2'>
                        <div className="message-icon-container" onClick={messages}>
                            <ChatMessageIcon className='custom-message-icon' counterStyle='message-counter' />
                        </div>
                        <div className="user-account-icon">
                            <UserIcon />
                        </div>

                        <SlidingSideNav />
                    </div>
                </div>
                <div className="tablet-header-row2">
                    <div className='tablet-header-row2-col1'>
                        <input type='text' className='search-box-tablet-header' />
                        <button><div className='magnifying-glass'><MagnifyingGlass /></div></button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default TabletHeader
