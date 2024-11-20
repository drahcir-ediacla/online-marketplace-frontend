import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../../apicalls/axios';
import './style.scss'
import useAuthentication from '../../../hooks/authHook'
import Header from '../../../layouts/Forum/Header'
import Footer from '../../../layouts/Forum/Footer'
import GTranslate from '../../../components/GTranslate';
import NewDiscussionBtn from '../../../components/Button/NewDiscussionBtn'
import ForumSearchResultCard from '../../../components/Forum/ForumSearchResultCard'
import FilterNavigation from '../../../layouts/Forum/FilterNavigation'
import SearchDiscussionBox from '../../../components/SearchDiscussionBox'
import LoginModal from '../../../components/Modal/LoginModal';
import Pagination from '../../../components/Pagination/Pagination'


let postsPerPage = 15;
const ForumSearchResult = () => {

    const { user } = useAuthentication();
    const navigate = useNavigate();
    const location = useLocation();
    const searchTerm = new URLSearchParams(location.search).get('keyword');
    const [searchResultsData, setSearchResultsData] = useState([])
    const [discussionFilter] = useState(false)
    const [loginModalOpen, setLoginModalOpen] = useState(false)

    useEffect(() => {
        const fetchSearchResults = async () => {
            setSearchResultsData([])
            try {
                const response = await axios.get(`/api/search-post?keyword=${searchTerm}`)
                setSearchResultsData(response.data)
            } catch (err) {
                console.error('Error fetching search results:', err);
            }
        }
        fetchSearchResults()
    }, [searchTerm])

    const [currentPage, setCurrentPage] = useState(1);

    // Get current posts
    const currentSearchResultsData = useMemo(() => {
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        // // const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
        return searchResultsData.slice(indexOfFirstPost, indexOfLastPost);
    }, [currentPage, searchResultsData]);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

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
                    <div className="forum-search-result-page-container">
                        <FilterNavigation
                            authUser={user}
                            discussionFilter={discussionFilter}
                            onClick={loginModal}
                        />
                        <div className='forum-search-result-page-col2'>
                            <div className='language-selector-container'>
                                <GTranslate />
                            </div>
                            <SearchDiscussionBox />
                            <div className="search-result-list-container">
                                <div className="search-query-result-info">
                                    <div className='search-query-result-info-row1'>
                                        <div className="used-search-keyword">
                                            <h4>Search results for "{searchTerm}"</h4>
                                            <span>({searchResultsData.length} {searchResultsData.length > 1 ? 'posts found' : 'post found'})</span>
                                        </div>
                                        <NewDiscussionBtn onClick={handleNewDiscussionClick} label='Start a discussion' />
                                    </div>
                                </div>
                                <div className='discussion-list'>
                                    <ForumSearchResultCard data={currentSearchResultsData} />
                                </div>
                                {searchResultsData.length > 15 &&
                                    <div className='pagination-container'>
                                        <Pagination paginate={paginate} postsPerPage={postsPerPage} totalPosts={searchResultsData.length} currentPage={currentPage} />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Footer className='forum-search-results-footer' />
            </div>
        </>
    )
}


export default ForumSearchResult;