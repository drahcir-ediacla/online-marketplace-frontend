import React, { useState, useEffect } from 'react'
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



const ForumHomePage = () => {

    const { user } = useAuthentication();
    const [loginModalOpen, setLoginModalOpen] = useState(false)
    const [forumCategories, setForumCategories] = useState([])
    const navigate = useNavigate();


    useEffect(() => {
        const fetchForumCategories = async () => {
            try {
                const response = await axios.get('/api/fetchforumcategories')
                setForumCategories(response.data)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchForumCategories();
    }, [])


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
            </div>
            <Footer className='home-footer' />
        </>
    )
}

export default ForumHomePage;