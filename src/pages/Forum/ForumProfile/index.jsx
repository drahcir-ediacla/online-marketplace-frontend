import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import './style.scss'
import useAuthentication from '../../../hooks/authHook'
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

const availableTags = [
    'React',
    'JavaScript',
    'NodeJS',
    'ExpressJS',
    'MySQL',
    'Sequelize',
    'CSS',
    'HTML',
    'TypeScript',
    'Redux',
];


const ForumProfile = () => {

    const { user } = useAuthentication()
    const [categories, setCategories] = useState([])
    const [activeTab, setActiveTab] = useState(0);
    const [discussionFilter, setDiscussionFilter] = useState(true)
    const [loginModalOpen, setLoginModalOpen] = useState(false)
    const [selectCategoryOpen, setSelectCategoryOpen] = useState(false)
    const dropDownCategory = useRef();
    const [tags, setTags] = useState([]);
    const [inputTags, setInputTags] = useState('');
    const [filteredTags, setFilteredTags] = useState(availableTags);
    const [showDropdownTags, setShowDropdownTags] = useState(false);
    const dropDownTags = useRef();
    const location = useLocation();
    const navigate = useNavigate()

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
        };

        document.addEventListener('click', handleGlobalClick);

        return () => {
            document.removeEventListener('click', handleGlobalClick);
        };
    }, []);

    const openContent = (tabIndex) => {
        setActiveTab(tabIndex);
    };

    const handleNewDiscussionClick = () => {
        if (!user) {
            setLoginModalOpen(true)
        } else {
            navigate(`/forum/profile/${user.id}/add_discussions`);
        }
    };

    const handleTagInputChange = (e) => {
        const inputValue = e.target.value;
        setInputTags(inputValue);

        // Filter available tags based on the input and exclude already selected tags
        if (inputValue.trim() !== '') {
            setFilteredTags(
                availableTags.filter(
                    (tag) =>
                        tag.toLowerCase().includes(inputValue.toLowerCase()) &&
                        !tags.includes(tag)
                )
            );
            setShowDropdownTags(true); // Show dropdown when input is not empty
        } else {
            setFilteredTags([]);
            setShowDropdownTags(false); // Hide dropdown when input is empty
        }
    };

    const handleTagClick = (tag) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
            setInputTags(''); // Clear input after tag selection
            setShowDropdownTags(false);
        }
    };

    // Handle removing a tag
    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const toggleSelectCategory = () => {
        setSelectCategoryOpen(!selectCategoryOpen)
    }

    const toggleLoginModal = () => {
        setLoginModalOpen((prevLoginModalOpen) => !prevLoginModalOpen)
    }

    const loginModal = () => {
        setLoginModalOpen(true)
    }

    return (
        <>
            {loginModalOpen && <LoginModal onClick={toggleLoginModal} />}
            <Header authUser={user} />
            <div className='language-selector-container'>
                <GTranslate />
            </div>
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
                    userData={setCategories}
                />
                <div className='forum-profile-page-col2'>
                    {activeTab !== 4 && <SearchDiscussionBox />}
                    <div className="discussions-container">
                        <div className="tab-content" style={{ display: activeTab === 0 ? 'flex' : 'none' }}>
                            <div className="forum-profile-tab-title">
                                <h4>Created Discussions (29)</h4>
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
                        <div className='tab-content' style={{ display: activeTab === 1 ? 'flex' : 'none' }}>
                            <div className="forum-profile-tab-title">
                                <h4>Joined Discussions (29)</h4>
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
                        </div>
                        <div className='tab-content' style={{ display: activeTab === 4 ? 'flex' : 'none' }}>
                            <div className='forum-profile-tab-title'>
                                <h4>Add New Discussions</h4>
                            </div>
                            <form className='add-discussion-form'>
                                <div className='add-discussion-form-field-container'>
                                    <label htmlFor="">Title</label>
                                    <Input className="discussion-title-box" placeholder='Type discussion title' />
                                </div>
                                <div className='add-discussion-form-field-container'>
                                    <label htmlFor="">Category</label>
                                    <div className="wrapper" ref={dropDownCategory}>
                                        <div className={`drop-down-arrow ${selectCategoryOpen && 'active'}`} onClick={toggleSelectCategory}></div>
                                        <div className="drop-down-forum-category">
                                            <input type="text" className="discussion-select-box" placeholder='Select category' readOnly />
                                        </div>
                                        {selectCategoryOpen &&
                                            <div className="drop-down-forum-category-container">
                                                <ul className='drop-down-forum-category-options'>
                                                    <li className='forum-main-category'>
                                                        <div className="parent-forum-category">GENERAL DISCUSSIONS</div>
                                                        <ul className='forum-subcategory'>
                                                            <li>
                                                                <div className="first-level-forum-subcategory">Welcome and Introductions</div>
                                                            </li>
                                                            <li>
                                                                <div className="first-level-forum-subcategory">Marketplace Announcements</div>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                    <li className='forum-main-category'>
                                                        <div className="parent-forum-category">PRODUCT CATEGORIES</div>
                                                        <ul className='forum-subcategory'>
                                                            <li>
                                                                <div className="first-level-forum-subcategory">Product Reviews</div>
                                                            </li>
                                                            <li>
                                                                <div className="first-level-forum-subcategory">Buying Advice</div>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                    <li className='forum-main-category'>
                                                        <div className="parent-forum-category">PRODUCT CATEGORIES</div>
                                                        <ul className='forum-subcategory'>
                                                            <li>
                                                                <div className="first-level-forum-subcategory">Product Reviews</div>
                                                            </li>
                                                            <li>
                                                                <div className="first-level-forum-subcategory">Buying Advice</div>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                    <li className='forum-main-category'>
                                                        <div className="parent-forum-category">PRODUCT CATEGORIES</div>
                                                        <ul className='forum-subcategory'>
                                                            <li>
                                                                <div className="first-level-forum-subcategory">Product Reviews</div>
                                                            </li>
                                                            <li>
                                                                <div className="first-level-forum-subcategory">Buying Advice</div>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                    <li className='forum-main-category'>
                                                        <div className="parent-forum-category">PRODUCT CATEGORIES</div>
                                                        <ul className='forum-subcategory'>
                                                            <li>
                                                                <div className="first-level-forum-subcategory">Product Reviews</div>
                                                            </li>
                                                            <li>
                                                                <div className="first-level-forum-subcategory">Buying Advice</div>
                                                            </li>
                                                        </ul>
                                                    </li>
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
                                    />
                                </div>
                                <div className='add-discussion-form-field-container'>
                                    <label htmlFor="">Tags</label>
                                    <div className="tags-input-container" ref={dropDownTags}>
                                        <ul className="tags-list">
                                            {tags.map((tag, index) => (
                                                <li key={index} className="tag">
                                                    {tag}
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
                                                    <li key={index} onClick={() => handleTagClick(tag)}>
                                                        {tag}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <div className='add-discussion-button-container'>
                                    <BtnGreen label='Post Discussion' />
                                    <BtnClear label='Cancel' />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ForumProfile;