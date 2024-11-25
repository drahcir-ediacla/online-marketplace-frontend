import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../apicalls/axios';
import './style.scss'
import useAuthentication from '../../../hooks/authHook'
import Header from '../../../layouts/Forum/Header'
import Footer from '../../../layouts/Forum/Footer'
import GTranslate from '../../../components/GTranslate';
import NewDiscussionBtn from '../../../components/Button/NewDiscussionBtn'
import ForumSubCategoryCard from '../../../components/Forum/ForumSubCategoryCard'
import ForumDiscussionCard from '../../../components/Forum/ForumDiscussionCard'
import FilterNavigation from '../../../layouts/Forum/FilterNavigation'
import SearchDiscussionBox from '../../../components/SearchDiscussionBox'
import LoginModal from '../../../components/Modal/LoginModal';
import CustomSelect from '../../../components/FormField/CustomSelect';
import ForumCardSkeleton from '../../../components/Forum/SkeletonLoading/ForumCardSkeleton';
import { ReactComponent as LoadingSpinner } from '../../../assets/images/loading-spinner.svg'
import SmallScreenNavMenu from '../../../components/Forum/SmallScreenNavMenu';



const ForumCategoryPage = () => {

    const { user } = useAuthentication();
    const { id, name } = useParams()
    const navigate = useNavigate();
    const [categoryData, setCategoryData] = useState({})
    const [discussionFilter] = useState(true)
    const [loginModalOpen, setLoginModalOpen] = useState(false)
    const [sortDiscussions, setSortDiscussions] = useState([])
    const [loadingData, setLoadingData] = useState(true)
    const filterDiscussionOptions = ['Most Recent', 'Most Viewed', 'Most Liked'].map(option => (
        {
            label: option,
            value: option.toLowerCase()
        }));


    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setLoadingData(true)
                const response = await axios.get(`/api/forumcategory/${id}/${name}`);
                setCategoryData(response.data)
                setLoadingData(false)
            } catch (error) {
                setLoadingData(false)
                console.error("Error fetching data:", error);
            }
        }
        fetchCategoryData()
    }, [id, name])

    const subcategories = Array.isArray(categoryData?.subcategories) ? categoryData?.subcategories : [];
    const discussions = Array.isArray(categoryData?.allDiscussions) ? categoryData?.allDiscussions.slice(0, 10) : [];
    const descendingDiscussions = [...discussions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const mostRecent = [...discussions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    // Sort by most viewed (descending by total views)
    const mostViewed = [...discussions].sort((a, b) => {
        const viewsA = a.post.reduce((acc, post) => acc + (post.views || 0), 0);
        const viewsB = b.post.reduce((acc, post) => acc + (post.views || 0), 0);
        return viewsB - viewsA;
    });

    // Sort by most liked (descending by total likes)
    const mostLiked = [...discussions].sort((a, b) => {
        const likesA = a.post.reduce((acc, post) => acc + (post.likes ? post.likes.length : 0), 0);
        const likesB = b.post.reduce((acc, post) => acc + (post.likes ? post.likes.length : 0), 0);
        return likesB - likesA;
    });

    const handleOptionSelect = (option) => {

        if (option.value === 'most recent') {
            setSortDiscussions(mostRecent);
        }

        if (option.value === 'most viewed') {
            setSortDiscussions(mostViewed);
        }

        if (option.value === 'most liked') {
            setSortDiscussions(mostLiked);
        }
    };

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

    const loginModal = () => {
        setLoginModalOpen(true)
    }



    return (
        <>
            {loginModalOpen && <LoginModal onClick={toggleLoginModal} />}
            <div className='forum-page-container'>
                <Header authUser={user} />
                <div>
                    <div className="forum-category-page-container">
                        <FilterNavigation
                            authUser={user}
                            sortOptions={filterDiscussionOptions}
                            discussionFilter={discussionFilter}
                            onClick={loginModal}
                            onOptionSelect={handleOptionSelect}
                            emptySortDiscussions={setSortDiscussions}
                        />
                        <div className='forum-category-page-col2'>
                            <div className='language-selector-container'>
                                <GTranslate />
                            </div>
                            <SearchDiscussionBox className='custom-forum-search-box' />
                            <SmallScreenNavMenu />
                            <div className="discussions-container">
                                <div className="category-container">
                                    <div className="category-name">
                                        <h4>{categoryData.name}</h4>
                                        <div className='start-discussion-btn-container'>
                                            <NewDiscussionBtn onClick={handleNewDiscussionClick} label='Start a discussion' />
                                        </div>
                                        <CustomSelect 
                                        data={filterDiscussionOptions}
                                        onOptionSelect={handleOptionSelect}
                                        className='discussion-sortby-dropdown-select' 
                                        />
                                    </div>
                                    {loadingData && <ForumCardSkeleton menus={2} />}
                                    {subcategories && subcategories.length > 0 && (
                                        <ForumSubCategoryCard
                                            data={categoryData}
                                        />
                                    )}
                                </div>
                                <div className='recent-discussion'>
                                    {discussions.length > 0 && <h6>Recent Discussions</h6>}
                                    {loadingData && <div className='infinite-scroll-loading-spinner'><LoadingSpinner /></div>}
                                    {sortDiscussions && sortDiscussions.length > 0 ? (
                                        <ForumDiscussionCard
                                            data={sortDiscussions}
                                        />
                                    ) : (
                                        <ForumDiscussionCard
                                            data={descendingDiscussions}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer className='forum-category-footer' />
            </div>
        </>
    )
}


export default ForumCategoryPage;