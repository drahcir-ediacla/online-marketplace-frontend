import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import './style.scss'
import Logo from '../../../assets/images/yogeek-forum-logo.png'
import DefaultAvatar from '../../../assets/images/avatar-icon.png'
import { ReactComponent as TriangleIcon } from '../../../assets/images/triangle-up.svg';
import LoginModal from '../../../components/Modal/LoginModal'


const ForumHeader = ({ containerClass }) => {

    const authUser = useSelector((state) => state.user.data);
    const [dropDownProfile, setDropDownProfile] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false)
    const profileDropDown = useRef(null);
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    
    useEffect(() => {
        const handleGlobalClick = (event) => {
            if (profileDropDown.current && !profileDropDown.current.contains(event.target)) {
                setDropDownProfile(false);
            }
        };

        document.addEventListener('click', handleGlobalClick);

        return () => {
            document.removeEventListener('click', handleGlobalClick);
        };
    }, []);



    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down
            setShowHeader(false);
        } else {
            // Scrolling up
            setShowHeader(true);
        }
        setLastScrollY(currentScrollY);
    };


    const toggleDropDownProfile = () => {
        setDropDownProfile((prevdropDownProfile) => !prevdropDownProfile)
    }

    const logout = async () => {
        const logoutUrl = `${process.env.REACT_APP_BASE_URL}/api/logout`;
    
        try {
            const response = await fetch(logoutUrl, {
                method: 'GET',
                credentials: 'include', // Include cookies for the logout API
            });
    
            if (response.ok) {
                // Redirect after successful logout
                window.location.href = '/forum';
            } else {
                console.error('Logout failed:', response.status, response.statusText);
                // Optionally show an error message to the user
            }
        } catch (error) {
            console.error('An error occurred during logout:', error);
            // Optionally show an error message to the user
        }
    };

    const toggleLoginModal = () => {
        setLoginModalOpen((prevLoginModalOpen) => !prevLoginModalOpen)
    }

    const loginModal = () => {
        setLoginModalOpen(true)
    }

    return (
        <>
            {loginModalOpen && <LoginModal onClick={toggleLoginModal} />}
            <div className={`forum-header-container ${containerClass} ${showHeader ? "visible" : "hidden"}`}>
                <Link to='/'><img src={Logo} alt="" className='forum-logo' /></Link>
                <div className='forum-header-right-col'>
                    <Link to='/'>Marketplace</Link>
                    <span>|</span>
                    {authUser ? (
                        <>
                            <Link to={`/forum/profile/${authUser?.id}/created_discussions`}>{authUser?.display_name}</Link>
                            <div className='forum-profile-avatar-container'>
                                <img src={authUser?.profile_pic} alt="" className='default-forum-profile-avatar' onClick={toggleDropDownProfile} ref={profileDropDown} />
                                {dropDownProfile && (
                                    <div className="my-account-dropdown-container">
                                        <div className='my-account-dropdown'>
                                            <div className='triangle-icon'><TriangleIcon /></div>
                                            <ul>
                                                <li><Link to={`/forum/profile/${authUser?.id}/created_discussions`}>My Forum Profile</Link></li>
                                                <li><Link onClick={logout}>Logout</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <button onClick={loginModal} className='onclick-show-login-modal'>Sign In</button>
                            <button onClick={loginModal} className='onclick-show-login-modal'><img src={DefaultAvatar} alt="" className='default-forum-profile-avatar' /></button>
                        </>
                    )}
                </div>

            </div>
        </>
    )
}


export default ForumHeader