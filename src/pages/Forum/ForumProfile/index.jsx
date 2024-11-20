import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
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
import ProfileDiscussionCard from '../../../components/Forum/ProfileDiscussionCard'
import SearchDiscussionBox from '../../../components/SearchDiscussionBox'
import QuillEditor from '../../../components/QuillEditor';
import Input from '../../../components/FormField/Input';
import BtnGreen from '../../../components/Button/BtnGreen';
import BtnClear from '../../../components/Button/BtnClear';
import LoginModal from '../../../components/Modal/LoginModal';
import DefaultAvatar from '../../../assets/images/avatar-icon.png'
import { ReactComponent as ThreeDots } from '../../../assets/images//three-dots.svg';
import { ReactComponent as LoadingSpinner } from '../../../assets/images/loading-spinner.svg'



const ForumProfile = () => {

    const { user } = useAuthentication()
    const dispatch = useDispatch()
    const location = useLocation();
    const navigate = useNavigate()
    const [paramsUser, setParamsUser] = useState({})
    const [categories, setCategories] = useState([])
    const [allTags, setAllTags] = useState([])
    const [notifications, setNotifications] = useState([]);
    const [activities, setActivities] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [createdDiscussions, setCreatedDiscussions] = useState([])
    const [joinedDiscussions, setJoinedDiscussions] = useState([])
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
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef()
    const dropDownCategory = useRef();
    const dropDownTags = useRef();
    const dropDownNotif = useRef();
    const [sortCD, setSortCD] = useState([])
    const [sortJD, setSortJD] = useState([])
    const filterDiscussionOptions = ['Most Recent', 'Most Viewed', 'Most Liked'].map(option => (
        {
            label: option,
            value: option.toLowerCase()
        }));

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

    useEffect(() => {
        const fetchForumNotifications = async () => {
            if (loading || !hasMore) return; // Don't fetch if already loading or no more data

            setLoading(true);
            try {
                const response = await axios.get(`/api/forum-notifications/?page=${page}&limit=${limit}`)
                const newNotification = response.data
                setNotifications((prevData) => {
                    const uniqueData = newNotification.filter(
                        (item) => !prevData.some((existingItem) => existingItem.id === item.id)
                    );
                    return [...prevData, ...uniqueData];
                });
                setHasMore(newNotification.length > 0);
            } catch (err) {
                console.log('Error fetching forum notifications:', err)
            } finally {
                setLoading(false);
            }
        }
        fetchForumNotifications()
    }, [page, limit])


    // Intersection Observer callback
    const lastElementRef = (node) => {
        if (loading) return; // Don't observe if loading

        if (observer.current) observer.current.disconnect(); // Disconnect previous observer

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prevPage) => prevPage + 1); // Load next page
            }
        });

        if (node) observer.current.observe(node); // Observe the last element
    };


    const sortDiscussionsByDate = (a, b) => new Date(b.created_at) - new Date(a.created_at);

    const sortDiscussionsByViews = (a, b) => {
        const viewsA = a.post.reduce((acc, post) => acc + (post.views || 0), 0);
        const viewsB = b.post.reduce((acc, post) => acc + (post.views || 0), 0);
        return viewsB - viewsA;
    };

    const sortDiscussionsByLikes = (a, b) => {
        const likesA = a.post.reduce((acc, post) => acc + (post.likes ? post.likes.length : 0), 0);
        const likesB = b.post.reduce((acc, post) => acc + (post.likes ? post.likes.length : 0), 0);
        return likesB - likesA;
    };

    const mostRecentCD = [...createdDiscussions].sort(sortDiscussionsByDate);
    const mostViewedCD = [...createdDiscussions].sort(sortDiscussionsByViews);
    const mostLikedCD = [...createdDiscussions].sort(sortDiscussionsByLikes);



    const mostRecentJD = [...joinedDiscussions].sort(sortDiscussionsByDate);
    const mostViewedJD = [...joinedDiscussions].sort(sortDiscussionsByViews);
    const mostLikedJD = [...joinedDiscussions].sort(sortDiscussionsByLikes);

    const handleOptionSelect = (option) => {
        const discussionSets = activeTab === 0
            ? {
                'most recent': mostRecentCD,
                'most viewed': mostViewedCD,
                'most liked': mostLikedCD
            }
            : {
                'most recent': mostRecentJD,
                'most viewed': mostViewedJD,
                'most liked': mostLikedJD
            };

        const selectedDiscussions = discussionSets[option.value];
        if (selectedDiscussions) {
            if (activeTab === 0) {
                setSortCD(selectedDiscussions);
            } else {
                setSortJD(selectedDiscussions);
            }
        }
    };


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

    return (
        <>
            {loginModalOpen && <LoginModal onClick={toggleLoginModal} />}
            <div className='forum-page-container'>
                <Header authUser={user} />
                <div className="forum-profile-container">
                    <FilterNavigation
                        authUser={user}
                        paramsUserData={setParamsUser}
                        createdDiscussionsTab={() => openContent(0)}
                        joinedDiscussionsTab={() => openContent(1)}
                        userActivityTab={() => openContent(2)}
                        forumNotificationsTab={() => openContent(3)}
                        addDiscussionsBtn={() => openContent(4)}
                        discussionFilter={discussionFilter}
                        onClick={loginModal}
                        categoriesData={setCategories}
                        createdDiscussionsData={setCreatedDiscussions}
                        joinedDiscussionsData={setJoinedDiscussions}
                        activitiesData={setActivities}
                        tagsData={setAllTags}
                        sortOptions={filterDiscussionOptions}
                        onOptionSelect={handleOptionSelect}
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
                                    <NewDiscussionBtn onClick={handleNewDiscussionClick} label='Start a discussion' />
                                </div>
                                {sortCD && sortCD.length > 0 ? (
                                    <ProfileDiscussionCard
                                        data={sortCD}
                                    />
                                ) : (
                                    <ProfileDiscussionCard
                                        data={createdDiscussions}
                                    />
                                )}
                            </div>
                            <div className='tab-content' style={{ display: activeTab === 1 ? 'flex' : 'none' }}>
                                <div className="forum-profile-tab-title">
                                    <h4>Joined Discussions ({joinedDiscussions?.length})</h4>
                                    <NewDiscussionBtn onClick={handleNewDiscussionClick} label='Start a discussion' />
                                </div>
                                {sortJD && sortJD.length > 0 ? (
                                    <ForumDiscussionCard
                                        data={sortJD}
                                    />
                                ) : (
                                    <ForumDiscussionCard
                                        data={joinedDiscussions}
                                    />
                                )}
                            </div>
                            <div className='tab-content' style={{ display: activeTab === 2 ? 'flex' : 'none' }}>
                                <div className='forum-profile-tab-title'>
                                    <h4>Latest Activity</h4>
                                    <NewDiscussionBtn onClick={handleNewDiscussionClick} label='Start a discussion' />
                                </div>
                                {activities?.length === 0 ? (
                                    <div className='no-activity'>{paramsUser?.display_name} don't have any activity</div>
                                ) : (
                                    <ul>
                                        {activities?.map(activity => (
                                            <li key={activity?.id}>
                                                <div className='activity-container'>
                                                    <div className="user-avatar">
                                                        <img src={activity?.SubjectUser?.profile_pic || DefaultAvatar} alt="" />
                                                    </div>
                                                    <div className="activity-info">
                                                        <div><span dangerouslySetInnerHTML={{ __html: activity.message }} /></div>
                                                        <div className="date">{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true, locale: enUS })}</div>
                                                    </div>

                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className='tab-content' style={{ display: activeTab === 3 ? 'flex' : 'none' }}>
                                <div className='forum-profile-tab-title'>
                                    <h4>Notifications</h4>
                                    <NewDiscussionBtn onClick={handleNewDiscussionClick} label='Start a discussion' />
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
                                            {notifications.map((notification) => (
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
                                        {/* Trigger for the next page */}
                                        {hasMore && !loading && (
                                            <div ref={lastElementRef} style={{ height: '20px', backgroundColor: 'transparent' }}></div>
                                        )}
                                        {loading && <div className='infinite-scroll-loading-spinner'><LoadingSpinner /></div>}
                                        {!hasMore && <div className='no-more-data'>No more data to load</div>}
                                    </div>
                                )}
                                {unreadNotifications.length === 0 ? (
                                    <div className='no-notif' style={{ display: activeNotifTab === 1 ? 'block' : 'none' }}>You don't have unread notifications</div>
                                ) : (
                                    <div style={{ display: activeNotifTab === 1 ? 'block' : 'none' }}>
                                        <ul>
                                            {unreadNotifications.map((notification) => (
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