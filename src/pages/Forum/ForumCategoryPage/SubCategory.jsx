import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../apicalls/axios';
import './style.scss'
import useAuthentication from '../../../hooks/authHook'
import Header from '../../../layouts/Forum/Header'
import Footer from '../../../layouts/Forum/Footer'
import GTranslate from '../../../components/GTranslate';
import NewDiscussionBtn from '../../../components/Button/NewDiscussionBtn'
import ForumSubCategory from '../../../components/Forum/ForumSubCategoryCard'
import ForumDiscussionCard from '../../../components/Forum/ForumDiscussionCard'
import FilterNavigation from '../../../layouts/Forum/FilterNavigation'
import SearchDiscussionBox from '../../../components/SearchDiscussionBox'
import LoginModal from '../../../components/Modal/LoginModal';



const ForumSubCategoryPage = () => {

    const { user } = useAuthentication();
    const { id, name } = useParams()
    const navigate = useNavigate();
    const [categoryData, setCategoryData] = useState({})
    const [discussionFilter] = useState(true)
    const [loginModalOpen, setLoginModalOpen] = useState(false)
    const [sortDiscussions, setSortDiscussions] = useState([])
    const filterDiscussionOptions = ['Most Recent', 'Most Viewed', 'Most Liked'].map(option => (
        {
            label: option,
            value: option.toLowerCase()
        }));

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const response = await axios.get(`/api/forumcategory/${id}/${name}`);
                setCategoryData(response.data)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchCategoryData()
    }, [id, name])

    const subcategories = Array.isArray(categoryData?.subcategories) ? categoryData?.subcategories : [];
    const discussions = Array.isArray(categoryData?.allDiscussions) ? categoryData?.allDiscussions : [];
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
                        />
                        <div className='forum-category-page-col2'>
                            <div className='language-selector-container'>
                                <GTranslate />
                            </div>
                            <SearchDiscussionBox />
                            <div className="discussions-container">
                                <div className="category-container">
                                    <div className="category-name">
                                        <h4>{categoryData.name}</h4>
                                        <NewDiscussionBtn onClick={handleNewDiscussionClick} />
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