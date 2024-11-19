import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../apicalls/axios'
import './style.scss'
import useAuthentication from '../../hooks/authHook'
import Header from '../../layouts/Forum/Header'
import Footer from '../../layouts/Forum/Footer'
import NewDiscussionBtn from '../../components/Button/NewDiscussionBtn'
import SearchDiscussionBox from '../../components/SearchDiscussionBox'
import HomePageSubCategoryCard from '../../components/Forum/HomePageSubCategoryCard'
import LoginModal from '../../components/Modal/LoginModal';
import GTranslate from '../../components/GTranslate';
import HomeCategoriesSkeleton from '../../components/Forum/SkeletonLoading/HomeCategoriesSkeleton'
import HomeSubCategoriesSkeleton from '../../components/Forum/SkeletonLoading/HomeSubCategoriesSkeleton'
import ForumDiscussionCard from '../../components/Forum/ForumDiscussionCard'
import CustomSelect from '../../components/FormField/CustomSelect';
import { ReactComponent as LoadingSpinner } from '../../assets/images/loading-spinner.svg'



const ForumHomePage = () => {

    const { user } = useAuthentication();
    const navigate = useNavigate();
    const observer = useRef();
    const [loginModalOpen, setLoginModalOpen] = useState(false)
    const [forumCategories, setForumCategories] = useState([])
    const [loading, setLoading] = useState(true);
    const [loadingRecent, setLoadingRecent] = useState(false);
    const [recentDiscussions, setRecentDiscussions] = useState([])
    const [sortRecentDiscussions, setSortRecentDiscussions] = useState([])
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const filterDiscussionOptions = ['Most Recent', 'Most Viewed', 'Most Liked'].map(option => (
        {
            label: option,
            value: option.toLowerCase()
        }));


    useEffect(() => {
        const fetchForumCategories = async () => {
            try {
                setLoading(true)
                const response = await axios.get('/api/fetchforumcategories')
                setForumCategories(response.data)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.error("Error fetching data:", error);
            }
        }
        fetchForumCategories();
    }, [])

    useEffect(() => {
        const fetchRecentDiscussions = async () => {
            if (loadingRecent || !hasMore) return; // Don't fetch if already loading or no more data

            setLoadingRecent(true);
            try {
                const response = await axios.get(`/api/get-all-discussions/?page=${page}&limit=${limit}`)
                const newDiscussion = response.data
                setRecentDiscussions((prevData) => {
                    const uniqueData = newDiscussion.filter(
                        (item) => !prevData.some((existingItem) => existingItem.discussion_id === item.discussion_id)
                    );
                    return [...prevData, ...uniqueData];
                });
                setHasMore(newDiscussion.length > 0);
            } catch (err) {
                console.error("Error fetching recent discussions:", err);
            } finally {
                setLoadingRecent(false);
            }
        }
        fetchRecentDiscussions()
    }, [page, limit])

    // Intersection Observer callback
    const lastElementRef = (node) => {
        if (loadingRecent) return; // Don't observe if loading

        if (observer.current) observer.current.disconnect(); // Disconnect previous observer

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prevPage) => prevPage + 1); // Load next page
            }
        });

        if (node) observer.current.observe(node); // Observe the last element
    };

    const mostRecentDiscussions = [...recentDiscussions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    // Sort by most viewed (descending by total views)
    const mostViewed = [...recentDiscussions].sort((a, b) => {
        const viewsA = a.post.reduce((acc, post) => acc + (post.views || 0), 0);
        const viewsB = b.post.reduce((acc, post) => acc + (post.views || 0), 0);
        return viewsB - viewsA;
    });

    const mostLiked = [...recentDiscussions].sort((a, b) => {
        // Find the maximum likes for any single post in discussion A
        const maxLikesA = Math.max(...a.post.map(post => post.likes ? post.likes.length : 0));
    
        // Find the maximum likes for any single post in discussion B
        const maxLikesB = Math.max(...b.post.map(post => post.likes ? post.likes.length : 0));
    
        // Sort in descending order by the maximum likes
        return maxLikesB - maxLikesA;
    });
    
    console.log(mostLiked);
    

    const handleOptionSelect = (option) => {

        if (option.value === 'most recent') {
            setSortRecentDiscussions(mostRecentDiscussions);
        }

        if (option.value === 'most viewed') {
            setSortRecentDiscussions(mostViewed);
        }

        if (option.value === 'most liked') {
            setSortRecentDiscussions(mostLiked);
        }
    };


    const goToCategoryPage = (id, name) => {
        navigate(`/forum/category/${id}/${name}`);
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
            <SearchDiscussionBox />
            <div className="forum-categories-container">
                <h1>Welcome to Yogeek Community</h1>
                <div className='browse-by-category'>
                    <div className='browse-by-category-container'>
                        <div className="browse-by-category-row1"><h5>Browse by Category </h5></div>
                        <div className="browse-by-category-row2">
                            <div className='browse-by-category-row2-col1'>
                                {loading && <HomeCategoriesSkeleton menus={8} />}
                                {forumCategories?.categories?.map(category => (
                                    <button className='forum-categories-nav-menu' onClick={() => goToCategoryPage(category.id, category.name)} key={category.id}>
                                        <div className='category-general-discussion-icon'>
                                            <img
                                                src={category.icon}
                                                alt=''
                                            /></div>
                                        {category.name.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="forum-container">
                    <div className='start-discussion-btn-container'>
                        <NewDiscussionBtn onClick={handleNewDiscussionClick} />
                    </div>
                    <div className="listed-category-container">
                        {loading &&
                            <>
                                <HomeSubCategoriesSkeleton menus={10} />
                            </>
                        }
                        {forumCategories?.categories?.map(category => (
                            <div className="listed-category" key={category.id}>
                                <div className='listed-category-title'><h4>{category.name}</h4></div>

                                <HomePageSubCategoryCard
                                    subcategories={category.subcategories}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="home-recent-discussions">
                    <div className='recent-discussions'>
                        <h5>Recent Discussions</h5>
                        <div className='replies-sortby-container'>
                            <span style={{ flexShrink: '0', fontWeight: 500}}>Sort By:</span>
                            <CustomSelect
                                data={filterDiscussionOptions}
                                onOptionSelect={handleOptionSelect}
                                className='forum-sortby-dropdown-select'
                            />
                        </div>
                    </div>
                    <ForumDiscussionCard data={sortRecentDiscussions.length > 0 ? sortRecentDiscussions :  mostRecentDiscussions} />
                </div>
                {/* Trigger for the next page */}
                {hasMore && !loadingRecent && (
                    <div ref={lastElementRef} style={{ height: '20px', backgroundColor: 'transparent' }}></div>
                )}
                {loadingRecent && <div className='infinite-scroll-loading-spinner'><LoadingSpinner /></div>}
                {!hasMore && <div className='no-more-data'>No more data to load</div>}
            </div>
            <Footer className='home-footer' />
        </>
    )
}

export default ForumHomePage;