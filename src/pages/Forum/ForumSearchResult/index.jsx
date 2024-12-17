import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../../apicalls/axios';
import './style.scss'
import Header from '../../../layouts/Forum/Header'
import Footer from '../../../layouts/Forum/Footer'
import GTranslate from '../../../components/GTranslate';
import NewDiscussionBtn from '../../../components/Button/NewDiscussionBtn'
import ForumSearchResultCard from '../../../components/Forum/ForumSearchResultCard'
import FilterNavigation from '../../../layouts/Forum/FilterNavigation'
import SearchDiscussionBox from '../../../components/SearchDiscussionBox'
import LoginModal from '../../../components/Modal/LoginModal';


const ForumSearchResult = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.user.data);
    const searchTerm = new URLSearchParams(location.search).get('keyword');
    const [searchResultsData, setSearchResultsData] = useState([])
    const [discussionFilter] = useState(false)
    const [loginModalOpen, setLoginModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalDiscussions, setTotalDiscussions] = useState(null)
    const [limit] = useState(15);


    useEffect(() => {
        fetchSearchResults(currentPage);
    }, [currentPage, location.search, searchTerm])


    const fetchSearchResults = async (page = 1) => {
        setSearchResultsData([])
        try {
            const params = {
                page,
                limit
            }
            const response = await axios.get(`/api/search-post?keyword=${searchTerm}`, { params })
            setTotalDiscussions(response.data.totalDiscussions);
            setTotalPages(response.data.totalPages);
            setSearchResultsData(response.data.discussions)
        } catch (err) {
            console.error('Error fetching search results:', err);
        }
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
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
                                            <span>({totalDiscussions} {totalDiscussions > 1 ? 'posts found' : 'post found'})</span>
                                        </div>
                                        <NewDiscussionBtn onClick={handleNewDiscussionClick} label='Start a discussion' />
                                    </div>
                                </div>
                                <div className='discussion-list'>
                                    <ForumSearchResultCard data={searchResultsData} />
                                </div>
                                {totalDiscussions > 15 &&
                                    <div className="pagination">
                                        <li className='page-item'>
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className='page-link'
                                            >
                                                Previous
                                            </button>
                                        </li>
                                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                            <li key={page} className='page-item'>
                                                <button
                                                    onClick={() => handlePageChange(page)}
                                                    className={page === currentPage ? 'active page-link' : 'page-link'}
                                                >
                                                    {page}
                                                </button>
                                            </li>
                                        ))}
                                        <li className='page-item'>
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className='page-link'
                                            >
                                                Next
                                            </button>
                                        </li>
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