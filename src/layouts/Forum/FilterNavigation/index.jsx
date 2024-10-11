import React, { useState, useEffect } from 'react'
import axios from '../../../apicalls/axios'
import './style.scss'
import { Link, useParams, useNavigate, NavLink, useLocation } from 'react-router-dom'
import DefaultAvatar from '../../../assets/images/avatar-icon.png'
import CustomSelect from '../../../components/FormField/CustomSelect'
import BtnCategory from '../../../components/Button/BtnCategory'
import FilterTagModal from '../../../components/Modal/FilterTagModal'


const FilterNavigation = ({
    authUser,
    createdDiscussions,
    joinedDiscussions,
    likedDiscussions,
    forumNotifications,
    addDiscussions,
    discussionFilter,
    onClick,
    categoriesData,
    tagsData,
    className
}) => {

    const { userId, tab } = useParams();
    const navigate = useNavigate();
    const location = useLocation()
    const [showFilter, setShowFilter] = useState(discussionFilter)
    const [categories, setCategories] = useState([])
    const [activeCategory, setActiveCategory] = useState([])
    const [tags, setTags] = useState([])
    const [selectedTags, setSelectedTags] = useState(location.state || [])
    const [filterTagModalOpen, setFilterTagModalOpen] = useState(false);


    useEffect(() => {
        // If location.state is not null or undefined, update state
        if (location.state && location.state.selectedTags) {
            setSelectedTags(location.state.selectedTags);
        }
    }, [location.state]);


    useEffect(() => {
        const fetchForumCategories = async () => {
            try {
                const responseCategories = await axios.get('/api/fetchforumcategories')
                setCategories(responseCategories.data)

                const responseTags = await axios.get('/api/fetchforumtags')
                setTags(responseTags.data)

                // Check if 'categoriesData' is a function before calling it
                // 'categoriesData' is expected to be a function passed as a prop for handling the fetched data
                // If 'categoriesData' is not a function, it logs a message in the console
                if (typeof categoriesData === 'function') {
                    categoriesData(responseCategories.data);
                }
                if (typeof tagsData === 'function') {
                    tagsData(responseTags.data);
                } else {
                    console.log('categoriesData is not a function');
                }

            } catch (error) {
                console.log('Error fetching data:', error)
            }
        }
        fetchForumCategories()
    }, [])


    useEffect(() => {
        if (categories.length > 0 && activeCategory === null) {
            setActiveCategory(categories[0].id); // or categories[0].name based on your logic
        }
    }, [categories, activeCategory]);

    useEffect(() => {
        switch (tab) {
            case 'created_discussions':
                createdDiscussions();
                setShowFilter(true);
                break;
            case 'joined_discussions':
                joinedDiscussions();
                setShowFilter(true);
                break;
            case 'liked_discussions':
                likedDiscussions();
                setShowFilter(true);
                break;
            case 'notifications':
                forumNotifications();
                setShowFilter(false);
                break;
            case 'add_discussions':
                addDiscussions();
                setShowFilter(false);
                break;
            default:
                // Optional: Handle unknown tabs
                break;
        }
    }, [tab, navigate]);


    const handleCategoryClick = (categoryId, categoryName) => {
        navigate(`/forum/category/${categoryId}/${encodeURIComponent(categoryName)}`);
        setActiveCategory(categoryId);
    };


    const handleCreatedDiscussions = () => {
        navigate(`/forum/profile/${userId}/created_discussions`);
        createdDiscussions(); // Call the function
    };
    const handleJoinedDiscussions = () => {
        navigate(`/forum/profile/${userId}/joined_discussions`);
        joinedDiscussions(); // Call the function
    };
    const handleLikedDiscussions = () => {
        navigate(`/forum/profile/${userId}/liked_discussions`);
        likedDiscussions(); // Call the function
    };
    const handleForumNotifications = () => {
        navigate(`/forum/profile/${userId}/notifications`);
        forumNotifications(); // Call the function
    };
    const sortBy = [
        {
            label: 'Most Recent',
            value: 'Most Recent',
        },
        {
            label: 'Most Viewed',
            value: 'Most Viewed',
        },
        {
            label: 'Most Liked',
            value: 'Most Liked',
        },
    ];

    const toggleTag = (tag_id) => {
        setSelectedTags((prevSelectedTags) => {
            const updatedTags = prevSelectedTags.includes(tag_id)
                ? prevSelectedTags.filter((t) => t !== tag_id)
                : [...prevSelectedTags, tag_id];

            // Navigate with the updatedTags directly
            navigate('/forum/filtertags', { state: { selectedTags: updatedTags } });

            return updatedTags;
        });
    };

    const toggleTagModal = () => {
        setFilterTagModalOpen((prev) => !prev)
    }

    const clearAllTags = () => {
        const updatedTags = []; // No tags selected
        setSelectedTags(updatedTags);
        navigate('/forum/filtertags', { state: { selectedTags: updatedTags } });
    };
    


    const originalDate = authUser?.createdAt || '';
    const formattedDate = new Date(originalDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });



    return (
        <>
            {filterTagModalOpen && <FilterTagModal onClick={toggleTagModal} tagsData={tags} />}
            <div className={`forum-category-page-filter-nav ${className}`}>
                {!authUser ? (
                    <div className='forum-category-page-row1 not-authenticated'>
                        <p>Join our community, elevate your marketplace experience!</p>
                        <button type='button' className='forum-login-btn' onClick={onClick}>Sign In</button>
                        <p>Don’t have a Yogeek account? <Link to='/registerbyemail'>Sign up</Link></p>
                    </div>
                ) : (
                    <>
                        {userId && (
                            <div className='forum-category-page-row1'>
                                <div className='forum-category-page-row1-row1'>
                                    <img src={authUser?.profile_pic || DefaultAvatar} alt="" className='forum-profile-pic' />
                                    <div className='user-display-name'>
                                        <p>{authUser?.display_name}</p>
                                        <small>Joined in {formattedDate}</small>
                                    </div>
                                </div>
                                <ul className='forum-profile-menu'>
                                    <li onClick={handleCreatedDiscussions}>Created Discussions <span className='forum-activity-counter'>(29)</span></li>
                                    <li onClick={handleJoinedDiscussions}>Joined Discussions <span className='forum-activity-counter'>(82)</span></li>
                                    <li onClick={handleLikedDiscussions}>Likes <span className='forum-activity-counter'>(82)</span></li>
                                    <li onClick={handleForumNotifications} className='forum-notifications'>Notifications <div className='forum-notification-counter'>2</div></li>
                                </ul>
                            </div>
                        )}
                    </>
                )}
                {showFilter && (
                    <>
                        <div className='forum-sortby'>
                            <label>SORT BY</label>
                            <CustomSelect
                                id="genderID"
                                name="gender"
                                defaultOption='Please select your gender --'
                                data={sortBy}
                                className='forum-sortby-dropdown-select'
                            />
                        </div>
                        <div className='forum-last-updated'>
                            <label>LAST UPDATED</label>
                            <CustomSelect
                                id="genderID"
                                name="gender"
                                defaultOption='Please select your gender --'
                                data={sortBy}
                                className='forum-sortby-dropdown-select'
                            />
                        </div>
                    </>
                )}
                <div className='forum-category-page-row2'>
                    <div className='section-label-container'>
                        <label>CATEGORIES</label>
                    </div>
                    <div className="forum-category-btn-container">
                        {categories?.categories?.map(category => (
                            <NavLink activeclassname="active" className='forum-category-menu' to={`/forum/category/${category.id}/${category.name}`}>{category.name}</NavLink>
                        ))}
                    </div>

                </div>
                <div className='forum-category-page-row3'>
                    <div className='section-label-container'>
                        <label>POPULAR TAGS</label>
                    </div>
                    <div className="forum-category-btn-container">
                        {tags.slice(0, 10).map(tag => (
                            <BtnCategory
                                key={tag.id}
                                onClick={() => toggleTag(tag.id)}
                                label={tag.name}
                                className={`tag-btn ${selectedTags.includes(tag.id) ? 'active' : ''}`}
                            />
                        ))}
                        <div className='more-tags' style={{justifyContent: selectedTags.length > 0 ? ('space-between') : ('end') }}>
                            {selectedTags && selectedTags.length > 0 && <button onClick={clearAllTags}>Clear all</button>}
                            <button onClick={toggleTagModal}>Select more tags</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default FilterNavigation;