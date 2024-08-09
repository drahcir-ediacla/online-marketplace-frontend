import './style.scss'
import Header from '../../layouts/Forum/Header'
import Footer from '../../layouts/Forum/Footer'
import { ReactComponent as MagnifyingGlass } from '../../assets/images/magnifying-glass.svg'
import { ReactComponent as GroupMsgIcon } from '../../assets/images/group-message-icon.svg'
import { ReactComponent as MsgIcon } from '../../assets/images/message-icon.svg'
import { ReactComponent as EyeIcon } from '../../assets/images/eye-solid.svg'
import { ReactComponent as ProductIcon } from '../../assets/images/forum-product-category.svg'
import { ReactComponent as SupportIcon } from '../../assets/images/support-icon.svg'
import { ReactComponent as SellerCommunityIcon } from '../../assets/images/seller-community-icon.svg'
import { ReactComponent as MegaPhoneIcon } from '../../assets/images/mega-phone-icon.svg'
import { ReactComponent as NewsPaperIcon } from '../../assets/images/news-paper-icon.svg'
import { ReactComponent as CalendarIcon } from '../../assets/images/calendar-icon.svg'
import { ReactComponent as ExclamationIcon } from '../../assets/images/solid-exclamation.svg'
import NewDiscussionBtn from '../../components/Button/NewDiscussionBtn'
import ForumSubCategory from '../../components/Forum/ForumSubCategory'
import GTranslate from '../../components/GTranslate';



const ForumHomePage = () => {

    return (
        <>
            <Header />
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
                                <button className='forum-categories-nav-menu'>
                                    <div className='category-general-discussion-icon'><GroupMsgIcon /></div>
                                    GENERAL DISCUSSION
                                </button>
                                <button className='forum-categories-nav-menu'>
                                    <div><ProductIcon /></div>
                                    PRODUCT CATEGORIES
                                </button>
                                <button className='forum-categories-nav-menu'>
                                    <div><SupportIcon /></div>
                                    SUPPORT & FEEDBACK
                                </button>
                                <button className='forum-categories-nav-menu'>
                                    <div><SellerCommunityIcon /></div>
                                    SELLER COMMUNITY
                                </button>
                            </div>
                            <div className='browse-by-category-row2-col2'>
                                <button className='forum-categories-nav-menu'>
                                    <div><MegaPhoneIcon /></div>
                                    PROMOTION & DEALS
                                </button>
                                <button className='forum-categories-nav-menu'>
                                    <div><NewsPaperIcon /></div>
                                    INDUSTRY NEWS & TRENDS
                                </button>
                                <button className='forum-categories-nav-menu'>
                                    <div><CalendarIcon /></div>
                                    COMMUNITY EVENTS
                                </button>
                                <button className='forum-categories-nav-menu'>
                                    <div><ExclamationIcon /></div>
                                    OFF-TOPIC
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="forum-container">
                    <div className='start-discussion-btn-container'>
                        <NewDiscussionBtn />
                    </div>
                    <div className="listed-category-container">
                        <div className="listed-category">
                            <div className='listed-category-title'><h4>General Discussion</h4></div>
                            <div className="forum-sub-category">
                                <div className='forum-sub-category-col1'>
                                    <div className='forum-sub-category-info'>
                                        <div className='forum-sub-category-icon'><GroupMsgIcon /></div>
                                        <div className='forum-sub-category-title-desc'>
                                            <h5>Welcome and Introductions</h5>
                                            <span>A place for new members to introduce themselves and meet others.</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='forum-sub-category-col2'>
                                    <div className="view-reply-counter">
                                        <div className="reply-counter">
                                            <div className='reply-msg-icon'><MsgIcon /></div>
                                            <span>1.2k</span>
                                        </div>
                                        <div className="view-counter">
                                            <div className='view-msg-icon'><EyeIcon /></div>
                                            <span>1.2k</span>
                                        </div>
                                    </div>
                                    <span className="last-activity-time">July 1, 2024</span>
                                </div>
                            </div>
                            <div className="forum-sub-category">
                                <div className='forum-sub-category-col1'>
                                    <div className='forum-sub-category-info'>
                                        <div className='forum-sub-category-icon'><GroupMsgIcon /></div>
                                        <div className='forum-sub-category-title-desc'>
                                            <h5>Marketplace Announcements</h5>
                                            <span>Updates, news, and important announcements about the marketplace.</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='forum-sub-category-col2'>
                                    <div className="view-reply-counter">
                                        <div className="reply-counter">
                                            <div className='reply-msg-icon'><MsgIcon /></div>
                                            <span>1.2k</span>
                                        </div>
                                        <div className="view-counter">
                                            <div className='view-msg-icon'><EyeIcon /></div>
                                            <span>1.2k</span>
                                        </div>
                                    </div>
                                    <span className="last-activity-time">July 1, 2024</span>
                                </div>
                            </div>
                        </div>
                        <div className="listed-category">
                            <div className='listed-category-title'><h4>Product Categories</h4></div>
                            <ForumSubCategory 
                            title='Product Reviews' 
                            description='User-generated reviews and discussions about products available on your marketplace.'
                            replies='102k'
                            views='27.9M'
                            lastActivity='1h ago'
                            />
                            <div className="forum-sub-category">
                                <div className='forum-sub-category-col1'>
                                    <div className='forum-sub-category-info'>
                                        <div className='forum-sub-category-icon'><GroupMsgIcon /></div>
                                        <div className='forum-sub-category-title-desc'>
                                            <h5>Buying Advice</h5>
                                            <span>Tips and recommendations for purchasing decisions across different product categories.</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='forum-sub-category-col2'>
                                    <div className="view-reply-counter">
                                        <div className="reply-counter">
                                            <div className='reply-msg-icon'><MsgIcon /></div>
                                            <span>1.2k</span>
                                        </div>
                                        <div className="view-counter">
                                            <div className='view-msg-icon'><EyeIcon /></div>
                                            <span>1.2k</span>
                                        </div>
                                    </div>
                                    <span className="last-activity-time">July 1, 2024</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ForumHomePage;