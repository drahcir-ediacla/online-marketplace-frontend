import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from '../../../apicalls/axios';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import './style.scss'
import useAuthentication from '../../../hooks/authHook'
import { Setloader } from '../../../redux/reducer/loadersSlice';
import Header from '../../../layouts/Forum/Header'
import Footer from '../../../layouts/Forum/Footer'
import FilterNavigation from '../../../layouts/Forum/FilterNavigation'
import GTranslate from '../../../components/GTranslate';
import NewDiscussionBtn from '../../../components/Button/NewDiscussionBtn'
import ForumDiscussionCard from '../../../components/Forum/ForumDiscussionCard'
import SearchDiscussionBox from '../../../components/SearchDiscussionBox'
import QuillEditor from '../../../components/QuillEditor';
import Input from '../../../components/FormField/Input';
import BtnGreen from '../../../components/Button/BtnGreen';
import BtnClear from '../../../components/Button/BtnClear';
import LoginModal from '../../../components/Modal/LoginModal';
import { ReactComponent as ThreeDots } from '../../../assets/images//three-dots.svg';



const ForumProfile = () => {

    const { user } = useAuthentication()
    const { userId } = useParams();
    const userIdNumber = Number(userId)
    const dispatch = useDispatch()
    const location = useLocation();
    const navigate = useNavigate()
    const [categories, setCategories] = useState([])
    const [allTags, setAllTags] = useState([])
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [discussionFilter, setDiscussionFilter] = useState(true)
    const [loginModalOpen, setLoginModalOpen] = useState(false)
    const [selectCategoryOpen, setSelectCategoryOpen] = useState(false)
    const [selectedSubCategory, setSelectedSubCategory] = useState('')
    const [tags, setTags] = useState([]);
    const [inputTags, setInputTags] = useState('');
    const [filteredTags, setFilteredTags] = useState([allTags]);
    const [showDropdownTags, setShowDropdownTags] = useState(false);
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [activeNotifTab, setActiveNotifTab] = useState(0);
    const [notifThreeDotsOptions, setNotifThreeDotsOptions] = useState(false)
    const dropDownCategory = useRef();
    const dropDownTags = useRef();
    const dropDownNotif = useRef();
    const [displayedNotificationsCount, setDisplayedNotificationsCount] = useState(20);
    const [displayedUnreadNotificationsCount, setDisplayedUnreadNotificationsCount] = useState(20);

    useEffect(() => {
        if (location.state && location.state.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    useEffect(() => {
        if (location.state && location.state.hasOwnProperty('discussionFilter')) {
            setDiscussionFilter(location.state.discussionFilter);
        }
    }, [location.state]);

    useEffect(() => {
        const handleGlobalClick = (event) => {
            if (dropDownCategory.current && !dropDownCategory.current.contains(event.target)) {
                setSelectCategoryOpen(false);
            }

            if (dropDownTags.current && !dropDownTags.current.contains(event.target)) {
                setShowDropdownTags(false);
                setInputTags('');
            }

            if (
                dropDownNotif.current &&
                !dropDownNotif.current.contains(event.target) &&
                !event.target.closest('.dots-container')
            ) {
                setNotifThreeDotsOptions(false);
            }
        };

        document.addEventListener('click', handleGlobalClick);

        return () => {
            document.removeEventListener('click', handleGlobalClick);
        };
    }, []);

    const createdDiscussions = categories?.allDiscussions?.filter(
        (discussion) => (discussion.user_id === userIdNumber)
    )

    const joinedDiscussions = categories?.allDiscussions?.filter(discussion =>
        discussion.post.some(post =>
            post.replies.some(levelOneReply => levelOneReply.user_id === userIdNumber ||
                levelOneReply.replies.some(levelTwoReply => levelTwoReply.user_id === userIdNumber ||
                    levelTwoReply.replies.some(levelThreeReply => levelThreeReply.user_id === userIdNumber)
                )
            )
        )
    );

    const unreadNotifications = notifications?.filter(
        (notification) => (notification.read === false)
    )

    const markAsRead = async (notificationId) => {
        try {
            await axios.put(`/api/read-forum-notification/${notificationId}`, { read: true });
            // Update the state to reflect the change
            setNotifications(notifications.map(notification =>
                notification.id === notificationId ? { ...notification, read: true } : notification
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put('/api/read-all-forum-notifications', { read: true });
            // Update the state to reflect the change
            setNotifications(notifications.map(notification => ({ ...notification, read: true })));
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    }

    const deleteNotification = async (notificationId) => {
        try {
            await axios.delete(`/api/delete-forum-notification/${notificationId}`)
            // Update the state to reflect the change
            setNotifications(notifications.filter(notification => notification.id !== notificationId));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    }

    const deleteAllNotifications = async () => {
        try {
            await axios.delete('/api/delete-all-forum-notifications')
            setNotifications([])
        } catch (err) {
            console.error('Error deleting all notifications', err)
        }
    }

    const openContent = (tabIndex) => {
        setActiveTab(tabIndex);
    };

    const openNotifList = (tabIndex) => {
        setActiveNotifTab(tabIndex);
    };

    const handleNewDiscussionClick = () => {
        if (!user) {
            setLoginModalOpen(true)
        } else {
            navigate(`/forum/profile/${user.id}/add_discussions`);
        }
    };


    const createNewDiscussion = async (e) => {
        e.preventDefault();

        if (!user) {
            setLoginModalOpen(true)
        }

        // Basic validation
        if (!categoryId || !title || !content) {
            console.error('Category, title, and content are required.');
            return;
        }

        try {
            // Dispatch loader before making the API call
            dispatch(Setloader(true));

            // Make the API call
            const response = await axios.post('/api/create/newdiscussion', {
                forum_category_id: categoryId,
                title: title,
                content: content,
                discussionTags: tags.map(tag => ({
                    tag_id: tag.tag_id
                }))
            });

            // Clear the form fields
            setTitle('');
            setCategoryId('');
            setSelectedSubCategory('');
            setContent('');
            setTags([]);

            // Redirect to the new discussion page
            const discussionId = response.data.discussion_id;
            window.location.href = `/forum/discussion/${discussionId}`;
        } catch (error) {
            // Handle errors and dispatch loader as false
            console.error('Error adding the discussion:', error);
            // Optionally, set an error state to display a message to the user
        } finally {
            // Ensure loader is hidden in both success and failure cases
            dispatch(Setloader(false));
        }
    };


    const handleCategorySelect = (id, name) => {
        setCategoryId(id);
        setSelectedSubCategory(name)
        setSelectCategoryOpen(false);
    }


    const handleTagInputChange = (e) => {
        const inputValue = e.target.value;
        setInputTags(inputValue);

        if (inputValue.trim() !== '') {
            // Create a set of tag IDs that are already selected
            const selectedTagIds = new Set(tags.map(tag => tag.tag_id));

            // Filter available tags based on the input and exclude already selected tags
            setFilteredTags(
                allTags
                    .filter(tag =>
                        tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
                        !selectedTagIds.has(tag.id)
                    )
            );
            setShowDropdownTags(true);
        } else {
            setFilteredTags([]);
            setShowDropdownTags(false);
        }
    };


    const handleTagClick = (id, name) => {
        if (!tags.some(t => t.tag_id === id)) {
            setTags([...tags, { tag_id: id, tag_name: name }]);
            setInputTags(''); // Clear input after tag selection
            setShowDropdownTags(false);
        }
    };

    // Handle removing a tag
    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag.tag_id !== tagToRemove.tag_id));
    };

    const clearForm = (e) => {
        e.preventDefault();
        setTitle('')
        setCategoryId('')
        setSelectedSubCategory('')
        setContent('')
        setTags([])
    }

    const toggleSelectCategory = () => {
        setSelectCategoryOpen(!selectCategoryOpen)
    }

    const toggleLoginModal = () => {
        setLoginModalOpen((prevLoginModalOpen) => !prevLoginModalOpen)
    }

    const toggleNotifThreeDotsOptions = () => {
        setNotifThreeDotsOptions(!notifThreeDotsOptions)
    }

    const loginModal = () => {
        setLoginModalOpen(true)
    }

    const loadMoreNotifications = () => {
        setDisplayedNotificationsCount(prevCount => prevCount + 20);
    };

    const loadMoreUnreadNotifications = () => {
        setDisplayedUnreadNotificationsCount(prevCount => prevCount + 20);
    };

    return (
        <>
            {loginModalOpen && <LoginModal onClick={toggleLoginModal} />}
            <div className='forum-page-container'>
                <Header authUser={user} />
                <div className="forum-profile-container">
                    <FilterNavigation
                        authUser={user}
                        createdDiscussions={() => openContent(0)}
                        joinedDiscussions={() => openContent(1)}
                        likedDiscussions={() => openContent(2)}
                        forumNotifications={() => openContent(3)}
                        addDiscussions={() => openContent(4)}
                        discussionFilter={discussionFilter}
                        onClick={loginModal}
                        categoriesData={setCategories}
                        notificationData={setNotifications}
                        tagsData={setAllTags}
                        notifications={notifications}
                        className='profile-filter-navigation'
                    />
                    <div className='forum-profile-page-col2'>
                        <div className='language-selector-container'>
                            <GTranslate />
                        </div>
                        {activeTab !== 4 && <SearchDiscussionBox />}
                        <div className="discussions-container">
                            <div className="tab-content" style={{ display: activeTab === 0 ? 'flex' : 'none' }}>
                                <div className="forum-profile-tab-title">
                                    <h4>Created Discussions ({createdDiscussions?.length})</h4>
                                    <NewDiscussionBtn onClick={handleNewDiscussionClick} />
                                </div>
                                <ForumDiscussionCard
                                    data={createdDiscussions}
                                />
                            </div>
                            <div className='tab-content' style={{ display: activeTab === 1 ? 'flex' : 'none' }}>
                                <div className="forum-profile-tab-title">
                                    <h4>Joined Discussions ({joinedDiscussions?.length})</h4>
                                    <NewDiscussionBtn onClick={handleNewDiscussionClick} />
                                </div>
                                <ForumDiscussionCard
                                    data={joinedDiscussions}
                                />
                            </div>
                            <div className='tab-content' style={{ display: activeTab === 2 ? 'flex' : 'none' }}>
                                <div className='forum-profile-tab-title'>
                                    <h4>Likes (29)</h4>
                                    <NewDiscussionBtn onClick={handleNewDiscussionClick} />
                                </div>
                                <ForumDiscussionCard
                                    title='Possible Scamming Ring Uncovered!'
                                    postedMessage='I just recieved an email warning me that "Your account has a gap of two days or more between your set handling time and your actual handling time. You can choose to close this gap by manually setting an accurate handling time on your account and skus or by enabling automated handling time.'
                                    author='Seller_zGoDlPZLneGhF'
                                    date='3 hours ago'
                                    like='4.5k'
                                    replies='4.5k'
                                    views='1.2M'
                                />
                                <ForumDiscussionCard
                                    title='Possible Scamming Ring Uncovered!'
                                    postedMessage='User-generated reviews and discussions about products available on your marketplace.'
                                    author='Seller_zGoDlPZLneGhF'
                                    date='3 hours ago'
                                    like='4.5k'
                                    replies='4.5k'
                                    views='1.2M'
                                />
                                <ForumDiscussionCard
                                    title='Possible Scamming Ring Uncovered!'
                                    postedMessage='I was trying to print shipping labels the last several days, unable to successfully get it, when I clicked the inventories I’m about to ship out, instead of putting in the same labels it puts in to different boxes. Do to that the weight is too light, even I can’t ship in different boxes. An example I have 5 items, so it puts and pick like one here, two there… two…. I don’t get it'
                                    author='Seller_zGoDlPZLneGhF'
                                    date='3 hours ago'
                                    like='4.5k'
                                    replies='4.5k'
                                    views='1.2M'
                                />
                            </div>
                            <div className='tab-content' style={{ display: activeTab === 3 ? 'flex' : 'none' }}>
                                <div className='forum-profile-tab-title'>
                                    <h4>Notifications</h4>
                                    <NewDiscussionBtn onClick={handleNewDiscussionClick} />
                                </div>
                                <div className="notifications-tab">
                                    <div className="notifications-tab-container">
                                        <button className={`all-notif-tab ${activeNotifTab === 0 ? 'active' : ''}`} onClick={() => openNotifList(0)}>ALL</button>
                                        <button className={`unread-notif-tab ${activeNotifTab === 1 ? 'active' : ''}`} onClick={() => openNotifList(1)}>UNREAD</button>
                                    </div>
                                    <div className='dots-container' onClick={toggleNotifThreeDotsOptions}>
                                        <div className='three-dots'>
                                            <ThreeDots />
                                        </div>
                                        {notifThreeDotsOptions && (
                                            <div className="three-dots-dropdown-options" ref={dropDownNotif}>
                                                <ul>
                                                    <li onClick={markAllAsRead}>
                                                        <span>Mark All as Read</span>
                                                    </li>
                                                    <li onClick={deleteAllNotifications}>
                                                        <span>Clear All Notifications</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {notifications.length === 0 ? (
                                    <div style={{ display: activeNotifTab === 0 ? 'block' : 'none' }} className='no-notif'>You don't have any notifications</div>
                                ) : (
                                    <div style={{ display: activeNotifTab === 0 ? 'block' : 'none' }}>
                                        <ul>
                                            {notifications.slice(0, displayedNotificationsCount).map((notification) => (
                                                <li key={notification.id}>
                                                    <div className="delete-notif-btn" onClick={() => deleteNotification(notification.id)}>
                                                        <i class="fa fa-times"></i>
                                                    </div>
                                                    <div className="notification-container" onClick={() => markAsRead(notification.id)}>
                                                        <div className="user-avatar">
                                                            <img src={notification.subject_User.profile_pic} alt="" />
                                                        </div>
                                                        <div className='notification-info'>
                                                            <div><span dangerouslySetInnerHTML={{ __html: notification.message }} /></div>
                                                            <div className="date">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: enUS })}</div>
                                                        </div>
                                                        {!notification.read && (
                                                            <div className="circle-container">
                                                                <div className="circle"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        {notifications.length > displayedNotificationsCount &&
                                            <div className='view-more'>
                                                <button className='view-more-btn' onClick={loadMoreNotifications}>View more</button>
                                            </div>
                                        }
                                    </div>
                                )}
                                {unreadNotifications.length === 0 ? (
                                    <div className='no-notif' style={{ display: activeNotifTab === 1 ? 'block' : 'none' }}>You don't have unread notifications</div>
                                ) : (
                                    <div style={{ display: activeNotifTab === 1 ? 'block' : 'none' }}>
                                        <ul>
                                            {unreadNotifications.slice(0, displayedUnreadNotificationsCount).map((notification) => (
                                                <li key={notification.id} >
                                                    <div className="delete-notif-btn" onClick={() => deleteNotification(notification.id)}>
                                                        <i class="fa fa-times"></i>
                                                    </div>
                                                    <div className="notification-container" onClick={() => markAsRead(notification.id)}>
                                                        <div className="user-avatar">
                                                            <img src={notification.subject_User.profile_pic} alt="" />
                                                        </div>
                                                        <div className='notification-info'>
                                                            <div><span dangerouslySetInnerHTML={{ __html: notification.message }} /></div>
                                                            <div className="date">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: enUS })}</div>
                                                        </div>
                                                        {!notification.read && (
                                                            <div className="circle-container">
                                                                <div className="circle"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        {unreadNotifications.length > displayedUnreadNotificationsCount &&
                                            <div className='view-more'>
                                                <button className='view-more-btn' onClick={loadMoreUnreadNotifications}>View more</button>
                                            </div>
                                        }
                                    </div>
                                )}
                            </div>
                            <div className='tab-content' style={{ display: activeTab === 4 ? 'flex' : 'none' }}>
                                <div className='forum-profile-tab-title'>
                                    <h4>Add New Discussions</h4>
                                </div>
                                <form className='add-discussion-form'>
                                    <div className='add-discussion-form-field-container'>
                                        <label htmlFor="">Title</label>
                                        <Input
                                            className="discussion-title-box"
                                            placeholder='Type discussion title'
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className='add-discussion-form-field-container'>
                                        <label htmlFor="">Category</label>
                                        <div className="wrapper" ref={dropDownCategory}>
                                            <div className={`drop-down-arrow ${selectCategoryOpen && 'active'}`} onClick={toggleSelectCategory}></div>
                                            <div className="drop-down-forum-category">
                                                <input type="text" className="discussion-select-box" placeholder='Select category' value={selectedSubCategory} readOnly />
                                            </div>
                                            {selectCategoryOpen &&
                                                <div className="drop-down-forum-category-container">
                                                    <ul className='drop-down-forum-category-options'>
                                                        {categories?.categories?.map(category => (
                                                            <li className='forum-main-category' key={category.id}>
                                                                <div className="parent-forum-category">{category.name}</div>
                                                                <ul className='forum-subcategory'>
                                                                    {category.subcategories.map(subcategory => (
                                                                        <li key={subcategory.id} onClick={() => handleCategorySelect(subcategory.id, subcategory.name)}>
                                                                            <div className="first-level-forum-subcategory">{subcategory.name}</div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className='add-discussion-form-field-container'>
                                        <label htmlFor="">Message</label>
                                        <QuillEditor
                                            id='newDiscussion'
                                            name='newDiscussion'
                                            className='new-discussion-message'
                                            value={content}
                                            onChange={(e) => setContent(e)}
                                        />
                                    </div>
                                    <div className='add-discussion-form-field-container'>
                                        <label htmlFor="">Tags</label>
                                        <div className="tags-input-container" ref={dropDownTags}>
                                            <ul className="tags-list">
                                                {tags.map((tag, index) => (
                                                    <li key={index} className="tag">
                                                        {tag.tag_name}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveTag(tag)}
                                                            className="remove-tag-button"
                                                        >
                                                            &times;
                                                        </button>
                                                    </li>
                                                ))}
                                                <li className='input-tags-container'>
                                                    <input
                                                        type="text"
                                                        value={inputTags}
                                                        onChange={handleTagInputChange}
                                                        placeholder="Search or select tags"
                                                        className="tags-input"
                                                    />
                                                </li>
                                            </ul>
                                            {showDropdownTags && filteredTags.length > 0 && (
                                                <ul className="dropdown-list">
                                                    {filteredTags.map((tag, index) => (
                                                        <li key={index} onClick={() => handleTagClick(tag.id, tag.name)}>
                                                            {tag.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                        </div>
                                    </div>
                                    <div className='add-discussion-button-container'>
                                        <BtnGreen label='Post Discussion' onClick={createNewDiscussion} />
                                        <BtnClear label='Clear' onClick={clearForm} />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer className='forum-profile-footer' />
            </div>
        </>
    )
}

export default ForumProfile;