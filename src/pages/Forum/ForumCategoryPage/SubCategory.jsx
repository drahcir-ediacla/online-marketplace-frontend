import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom';
import axios from '../../../apicalls/axios';
import './style.scss'
import Header from '../../../layouts/Forum/Header'
import Footer from '../../../layouts/Forum/Footer'
import GTranslate from '../../../components/GTranslate';
import NewDiscussionBtn from '../../../components/Button/NewDiscussionBtn'
import ForumSubCategory from '../../../components/Forum/ForumSubCategoryCard'
import ForumDiscussionCard from '../../../components/Forum/ForumDiscussionCard'
import FilterNavigation from '../../../layouts/Forum/FilterNavigation'
import SearchDiscussionBox from '../../../components/SearchDiscussionBox'
import CustomSelect from '../../../components/FormField/CustomSelect';
import { ReactComponent as LoadingSpinner } from '../../../assets/images/loading-spinner.svg'
import SmallScreenNavMenu from '../../../components/Forum/SmallScreenNavMenu';



const ForumSubCategoryPage = () => {

    const { id, name } = useParams()
    const observer = useRef();
    const [categoryData, setCategoryData] = useState({})
    const [discussionFilter] = useState(true)
    const [sortDiscussions, setSortDiscussions] = useState([])
    const [discussions, setDiscussions] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const filterDiscussionOptions = ['Most Recent', 'Most Viewed', 'Most Liked'].map(option => (
        {
            label: option,
            value: option.toLowerCase()
        }));

    useEffect(() => {
        const fetchCategoryData = async () => {
            if (loading || !hasMore) return; // Don't fetch if already loading or no more data

            setLoading(true);
            try {
                const response = await axios.get(`/api/forumcategory/${id}/${name}?page=${page}&limit=${limit}`);
                setCategoryData(response.data);

                const newDiscussion = response.data.allDiscussions
                setDiscussions((prevData) => {
                    const uniqueData = newDiscussion.filter(
                        (item) => !prevData.some((existingItem) => existingItem.discussion_id === item.discussion_id)
                    );
                    return [...prevData, ...uniqueData];
                });
                setHasMore(newDiscussion.length > 0);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCategoryData()
    }, [id, name])

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

    const subcategories = Array.isArray(categoryData?.subcategories) ? categoryData?.subcategories : [];
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



    return (
        <>
            <div className='forum-page-container'>
                <Header />
                <div>
                    <div className="forum-category-page-container">
                        <FilterNavigation
                            sortOptions={filterDiscussionOptions}
                            discussionFilter={discussionFilter}
                            onOptionSelect={handleOptionSelect}
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
                                            <NewDiscussionBtn label='Start a discussion' />
                                        </div>
                                        <CustomSelect
                                            data={filterDiscussionOptions}
                                            onOptionSelect={handleOptionSelect}
                                            className='discussion-sortby-dropdown-select'
                                        />
                                    </div>
                                    {subcategories && subcategories.length > 0 && (
                                        <ForumSubCategory
                                            data={categoryData}
                                        />
                                    )}
                                </div>
                                <div className='discussion-list'>
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
                                {/* Trigger for the next page */}
                                {hasMore && !loading && (
                                    <div ref={lastElementRef} style={{ height: '20px', backgroundColor: 'transparent' }}></div>
                                )}
                                {loading && <div className='infinite-scroll-loading-spinner'><LoadingSpinner /></div>}
                                {!hasMore && <div className='no-more-data'>No more data to load</div>}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer className='forum-category-footer' />
            </div>
        </>
    )
}


export default ForumSubCategoryPage;