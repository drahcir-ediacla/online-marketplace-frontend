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
    const [categoryData, setCategoryData] = useState({})
    const [discussionFilter, setDiscussionFilter] = useState(false)
    const [loginModalOpen, setLoginModalOpen] = useState(false)
    const navigate = useNavigate();


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
    }, [])

    const subcategories = Array.isArray(categoryData?.subcategories) ? categoryData?.subcategories : [];
    const discussions = Array.isArray(categoryData?.allDiscussions) ? categoryData?.allDiscussions : [];


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
            <Header authUser={user} />
            <div className='language-selector-container'>
                <GTranslate />
            </div>
            <div>
                <div className="forum-category-page-container">
                    <FilterNavigation authUser={user} discussionFilter={discussionFilter} onClick={loginModal} />
                    <div className='forum-category-page-col2'>
                        <SearchDiscussionBox />
                        <div className="discussions-container">
                            <div className="category-container">
                                <div className="category-name">
                                    <h4>{categoryData.name}</h4>
                                    <NewDiscussionBtn onClick={handleNewDiscussionClick} />
                                </div>
                                {subcategories && subcategories.length > 0 && (
                                    <ForumSubCategory
                                        data={subcategories}
                                        replies='102k'
                                        views='27.9M'
                                        lastActivity='1h ago'
                                    />
                                )}
                            </div>
                            <div className='discussion-list'>
                                {discussions && discussions.length > 0 && (
                                    <ForumDiscussionCard
                                        data={discussions}
                                        date='3 hours ago'
                                        like='4.5k'
                                        replies='4.5k'
                                        views='1.2M'
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}


export default ForumSubCategoryPage;