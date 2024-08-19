import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.scss'
import useAuthentication from '../../hooks/authHook'
import Header from '../../layouts/Forum/Header'
import Footer from '../../layouts/Forum/Footer'
import { ReactComponent as MagnifyingGlass } from '../../assets/images/magnifying-glass.svg'
import { ReactComponent as GroupMsgIcon } from '../../assets/images/group-message-icon.svg'
import { ReactComponent as ProductIcon } from '../../assets/images/forum-product-category.svg'
import { ReactComponent as SupportIcon } from '../../assets/images/support-icon.svg'
import { ReactComponent as SellerCommunityIcon } from '../../assets/images/seller-community-icon.svg'
import { ReactComponent as MegaPhoneIcon } from '../../assets/images/mega-phone-icon.svg'
import { ReactComponent as NewsPaperIcon } from '../../assets/images/news-paper-icon.svg'
import { ReactComponent as CalendarIcon } from '../../assets/images/calendar-icon.svg'
import { ReactComponent as ExclamationIcon } from '../../assets/images/solid-exclamation.svg'
import NewDiscussionBtn from '../../components/Button/NewDiscussionBtn'
import ForumSubCategory from '../../components/Forum/ForumSubCategoryCard'
import LoginModal from '../../components/Modal/LoginModal';
import GTranslate from '../../components/GTranslate';



const ForumHomePage = () => {

    const { user } = useAuthentication();
    const [loginModalOpen, setLoginModalOpen] = useState(false)
    const navigate = useNavigate();

    const goToCategoryPage = () => {
        window.location.href='/forum/category'
    }

    const goToSubcategoryPage = () => {
        return '/forum/subcategory';
    }

    const handleNewDiscussionClick = () => {
        if (!user) {
            setLoginModalOpen(true)
        } else {
            navigate(`/forum/profile/${user.id}/add_discussions`);
        }
    };

    const toggleLoginModal = () => {
        setLoginModalOpen((prevLoginModalOpen) => !prevLoginModalOpen)
    }

    return (
        <>
        {loginModalOpen && <LoginModal onClick={toggleLoginModal} />}
            <Header authUser={user} />
            <div className='language-selector-container'>
                <GTranslate />
            </div>
            <div className="search-box-container">
                <div className='forum-search-box'>
                    <input
                        type="text"
                        placeholder='Search discussions...'
                    />
                    <button>
                        <div className='magnifying-glass'><MagnifyingGlass /></div>
                    </button>
                </div>
            </div>
            <div className="forum-categories-container">
                <h1>Welcome to Yogeek Community</h1>
                <div className='browse-by-category'>
                    <div className='browse-by-category-container'>
                        <div className="browse-by-category-row1"><h5>Browse by Category </h5></div>
                        <div className="browse-by-category-row2">
                            <div className='browse-by-category-row2-col1'>
                                <button className='forum-categories-nav-menu' onClick={goToCategoryPage}>
                                    <div className='category-general-discussion-icon'><GroupMsgIcon /></div>
                                    GENERAL DISCUSSION
                                </button>
                                <button className='forum-categories-nav-menu' onClick={goToCategoryPage}>
                                    <div><ProductIcon /></div>
                                    PRODUCT CATEGORIES
                                </button>
                                <button className='forum-categories-nav-menu' onClick={goToCategoryPage}>
                                    <div><SupportIcon /></div>
                                    SUPPORT & FEEDBACK
                                </button>
                                <button className='forum-categories-nav-menu' onClick={goToCategoryPage}>
                                    <div><SellerCommunityIcon /></div>
                                    SELLER COMMUNITY
                                </button>
                            </div>
                            <div className='browse-by-category-row2-col2'>
                                <button className='forum-categories-nav-menu' onClick={goToCategoryPage}>
                                    <div><MegaPhoneIcon /></div>
                                    PROMOTION & DEALS
                                </button>
                                <button className='forum-categories-nav-menu' onClick={goToCategoryPage}>
                                    <div><NewsPaperIcon /></div>
                                    INDUSTRY NEWS & TRENDS
                                </button>
                                <button className='forum-categories-nav-menu' onClick={goToCategoryPage}>
                                    <div><CalendarIcon /></div>
                                    COMMUNITY EVENTS
                                </button>
                                <button className='forum-categories-nav-menu' onClick={goToCategoryPage}>
                                    <div><ExclamationIcon /></div>
                                    OFF-TOPIC
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="forum-container">
                    <div className='start-discussion-btn-container'>
                        <NewDiscussionBtn onClick={handleNewDiscussionClick} />
                    </div>
                    <div className="listed-category-container">
                        <div className="listed-category">
                            <div className='listed-category-title'><h4>General Discussion</h4></div>
                            <ForumSubCategory
                                title='Welcome and Introductions'
                                description='A place for new members to introduce themselves and meet others.'
                                replies='1.2k'
                                views='27.9M'
                                lastActivity='1h ago'
                                to={goToSubcategoryPage()}
                            />
                            <ForumSubCategory
                                title='Marketplace Announcements'
                                description='Updates, news, and important announcements about the marketplace.'
                                replies='1.2k'
                                views='27.9M'
                                lastActivity='July 1, 2024'
                                to={goToSubcategoryPage()}
                            />
                        </div>
                        <div className="listed-category">
                            <div className='listed-category-title'><h4>Product Categories</h4></div>
                            <ForumSubCategory
                                title='Product Reviews'
                                description='User-generated reviews and discussions about products available on your marketplace.'
                                replies='102k'
                                views='27.9M'
                                lastActivity='1h ago'
                                to={goToSubcategoryPage()}
                            />
                            <ForumSubCategory
                                title='Buying Advice'
                                description='Tips and recommendations for purchasing decisions across different product categories.'
                                replies='1.2k'
                                views='27.9M'
                                lastActivity='July 1, 2024'
                                to={goToSubcategoryPage()}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ForumHomePage;