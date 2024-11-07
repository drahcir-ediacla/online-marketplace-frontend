import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './style.scss'
import axios from '../../../apicalls/axios';
import useAuthentication from '../../../hooks/authHook';
import FilterNavigation from '../../../layouts/Forum/FilterNavigation';
import Header from '../../../layouts/Forum/Header'
import Footer from '../../../layouts/Forum/Footer'
import GTranslate from '../../../components/GTranslate';
import NewDiscussionBtn from '../../../components/Button/NewDiscussionBtn'
import FilterTagDiscussionCard from '../../../components/Forum/FilterTagDiscussionCard'
import SearchDiscussionBox from '../../../components/SearchDiscussionBox'
import LoginModal from '../../../components/Modal/LoginModal';


const FilterDiscussionByTags = () => {

    const { user } = useAuthentication();
    const navigate = useNavigate()
    const location = useLocation();
    const [loginModalOpen, setLoginModalOpen] = useState(false)
    const [discussionFilter] = useState(true)
    const [discussions, setDiscussions] = useState([])
    const [selectedTags, setSelectedTags] = useState(location.state || []);
    const [sortDiscussions, setSortDiscussions] = useState([])
    const filterDiscussionOptions = ['Most Recent', 'Most Viewed', 'Most Liked'].map(option => (
        {
            label: option,
            value: option.toLowerCase()
        }));

    useEffect(() => {
        // If location.state is not null or undefined, update state
        if (location.state && location.state.selectedTags) {
            setSelectedTags(location.state.selectedTags);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchDiscussions = async () => {
            try {
                const response = await axios.get('/api/filtertags', {
                    params: {
                        tag_id: selectedTags.join(','),
                    },
                });

                const newDiscussions = response.data;

                setDiscussions((prevDiscussions) => {
                    const existingDiscussionIds = new Set(prevDiscussions.map(d => d.discussion_id));
                    const newDiscussionIds = new Set(newDiscussions.map(d => d.discussion_id));

                    // Filter out discussions that are in the previous state but not in the new discussions
                    const updatedDiscussions = prevDiscussions.filter(
                        (discussion) => newDiscussionIds.has(discussion.discussion_id)
                    );

                    // Add new discussions that are not already in the updated discussions
                    const uniqueNewDiscussions = newDiscussions.filter(
                        (newDiscussion) => !existingDiscussionIds.has(newDiscussion.discussion_id)
                    );

                    const combinedDiscussions = [...updatedDiscussions, ...uniqueNewDiscussions];

                    // Filter out duplicates based on discussion_id
                    const setFilteredDiscussions = Array.from(
                        new Map(combinedDiscussions.map(discussion => [discussion.discussion_id, discussion])).values()
                    );

                    return setFilteredDiscussions;
                });
            } catch (error) {
                console.error('Error fetching discussions:', error);
            }
        };

        if (selectedTags.length > 0) {
            fetchDiscussions();
        } else {
            setDiscussions([]); // Reset discussions when no tags are selected
        }
    }, [selectedTags]);

    
    const descendingDiscussions = [...discussions].sort((a, b) => new Date(b?.allDiscussionsInTag?.created_at) - new Date(a?.allDiscussionsInTag?.created_at));
    const mostRecent = [...discussions].sort((a, b) => new Date(b?.allDiscussionsInTag?.created_at) - new Date(a?.allDiscussionsInTag?.created_at));
    // Sort by most viewed (descending by total views)
    const mostViewed = [...discussions].sort((a, b) => {
        const viewsA = a.allDiscussionsInTag.post.reduce((acc, post) => acc + (post.views || 0), 0);
        const viewsB = b.allDiscussionsInTag.post.reduce((acc, post) => acc + (post.views || 0), 0);
        return viewsB - viewsA;
    });

    // Sort by most liked (descending by total likes)
    const mostLiked = [...discussions].sort((a, b) => {
        const likesA = a.allDiscussionsInTag.post.reduce((acc, post) => acc + (post.parent_post_id === null ? post.likes.length : 0), 0);
        const likesB = b.allDiscussionsInTag.post.reduce((acc, post) => acc + (post.parent_post_id === null ? post.likes.length : 0), 0);
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
                <div className='forum-filter-tags-page-container'>
                    <FilterNavigation
                        authUser={user}
                        sortOptions={filterDiscussionOptions}
                        discussionFilter={discussionFilter}
                        onClick={loginModal}
                        onOptionSelect={handleOptionSelect}
                        emptySortDiscussions={setSortDiscussions}
                        className='filter-discussion-tags-page'
                    />
                    <div className='forum-filter-tags-page-container-col2'>
                        <div className='language-selector-container'>
                            <GTranslate />
                        </div>
                        <SearchDiscussionBox />
                        <div className='discussions-container'>
                            <div className='discussions-container-row1'>
                                <h4>Filter Tagged Discussions</h4>
                                <NewDiscussionBtn onClick={handleNewDiscussionClick} />
                            </div>
                            <div className='discussion-list'>
                                {discussions && discussions.length > 0 ? (
                                    sortDiscussions && sortDiscussions.length > 0 ? (
                                        <FilterTagDiscussionCard
                                            data={sortDiscussions}
                                        />
                                    ) : (
                                        <FilterTagDiscussionCard
                                            data={descendingDiscussions}
                                        />
                                    )
                                ) : (
                                    <>
                                        No discussions found!
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer className='footer-filter-tags' />
            </div>
        </>
    )
}


export default FilterDiscussionByTags;