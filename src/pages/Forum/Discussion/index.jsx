import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import './style.scss'
import axios from '../../../apicalls/axios'
import useAuthentication from '../../../hooks/authHook'
import { enUS } from 'date-fns/locale';
import Header from '../../../layouts/Forum/Header'
import Footer from '../../../layouts/Forum/Footer';
import FilterNavigation from '../../../layouts/Forum/FilterNavigation'
import GTranslate from '../../../components/GTranslate';
import LoginModal from '../../../components/Modal/LoginModal';
import { Setloader } from '../../../redux/reducer/loadersSlice';
import QuillEditor from '../../../components/QuillEditor';
import { ReactComponent as Like } from '../../../assets/images/like-icon.svg'
import { ReactComponent as MsgIcon } from '../../../assets/images/message-icon.svg'
import { ReactComponent as EyeIcon } from '../../../assets/images/eye-solid.svg'
import { ReactComponent as ThreeDots } from '../../../assets/images/three-dots.svg';
import { ReactComponent as LinkIcon } from '../../../assets/images/link-icon.svg';
import DefaultAvatar from '../../../assets/images/avatar-icon.png'
import SearchDiscussionBox from '../../../components/SearchDiscussionBox'
import CustomSelect from '../../../components/FormField/CustomSelect';
import NewDiscussionBtn from '../../../components/Button/NewDiscussionBtn'
import BtnGreen from '../../../components/Button/BtnGreen';
import BtnClear from '../../../components/Button/BtnClear';
import BtnReply from '../../../components/Button/BtnReply';
import AlertMessage from '../../../components/AlertMessage';
import SmallScreenNavMenu from '../../../components/Forum/SmallScreenNavMenu';



const Discussion = () => {

    const { discussionId } = useParams();
    const location = useLocation();
    const repliedPostId = new URLSearchParams(location.search).get('repliedPostId');
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { user } = useAuthentication()
    const [openReply, setOpenReply] = useState({});
    const [showMoreContent, setShowMoreContent] = useState({})
    const [showMoreReplies, setShowMoreReplies] = useState({})
    const [contentValue, setContentValue] = useState('')
    const [activePostId, setActivePostId] = useState(null)
    const [parentPostId, setParentPostId] = useState(null);
    const [postId, setPostId] = useState(null)
    const [discussionStarter, setDiscussionStarter] = useState(null)
    const [allPost, setAllPost] = useState([]);
    const [firstLevelReplies, setFirstLevelReplies] = useState([])
    const [loginModalOpen, setLoginModalOpen] = useState(false)
    const [threeDotsOption, setThreeDotsOption] = useState({})
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [selectedSort, setSelectedSort] = useState('')
    const [sortDiscussions, setSortDiscussions] = useState([])
    const filterDiscussionOptions = ['Most Recent', 'Most Liked'].map(option => (
        {
            label: option,
            value: option.toLowerCase()
        }));


    useEffect(() => {
        const fetchDiscussionData = async () => {
            if (!discussionId) return;  // Prevent API call if discussionId is falsy

            dispatch(Setloader(true));
            try {
                const response = await axios.get(`/api/discussions/${discussionId}/posts`);
                setAllPost(response.data);

                const replies = response.data[0].replies.length > 0 ? response.data[0].replies : [];
                setFirstLevelReplies(replies)

                const firstPostId = response.data.length > 0 ? response.data[0].post_id : null;
                setPostId(firstPostId);

                if (response.data[0].parent_post_id === null) {
                    const discussionStarterUserId = response.data.length > 0 ? response.data[0].user_id : null;
                    setDiscussionStarter(discussionStarterUserId)
                }

            } catch (error) {
                if (error.response && error.response.status === 404) {
                    navigate('/404'); // Navigate to "Page Not Found" if 404
                } else {
                    console.error("Error fetching data:", error);
                }
            } finally {
                dispatch(Setloader(false));  // Ensure loader is turned off
            }
        }

        fetchDiscussionData();

    }, [discussionId, dispatch, navigate]);  // Added dispatch and navigate to dependencies

    useEffect(() => {
        const handleGlobalClick = (event) => {
            if (event.target.closest('.three-dots') || event.target.closest('.three-dots-option')) {
                return;
            }

            // Close the options for all products
            setThreeDotsOption({});
        };

        document.addEventListener('click', handleGlobalClick);

        return () => {
            document.removeEventListener('click', handleGlobalClick);
        };
    }, []);


    // Set openReply based on totalReplies
    useEffect(() => {
        const newOpenReply = {};
        allPost.forEach(post => {
            if (post.replies.length === 0) {
                newOpenReply[post.post_id] = true; // Set to true if no replies
            }
        });
        setOpenReply(newOpenReply);
    }, [allPost]); // Run when allPost changes


    useEffect(() => {
        const incrementViews = async () => {
            try {
                await axios.post(`/api/post/${postId}/view`);
            } catch (error) {
                console.error('Error updating post views:', error);
            }
        };

        incrementViews();
    }, [postId]);

    useEffect(() => {
        if (repliedPostId && allPost.length > 0) {
            expandRepliesToPost(repliedPostId); // Expand replies on initial load
        }
    }, [repliedPostId, allPost]); // Ensure this runs when allPost and repliedPostId are ready



    const expandRepliesToPost = (repliedPostId) => {
        allPost.forEach(post => {
            post?.replies?.forEach(levelOneReply => {
                if (levelOneReply?.post_id === repliedPostId) {
                    scrollToPostAfterExpand(levelOneReply.post_id); // Scroll to this reply
                } else if (levelOneReply?.replies?.some(levelTwoReply =>
                    levelTwoReply?.post_id === repliedPostId ||
                    levelTwoReply?.replies?.some(levelThreeReply => levelThreeReply?.post_id === repliedPostId))) {

                    // Expand levelOne replies only if they haven't been expanded yet
                    if (!showMoreReplies[levelOneReply?.post_id]) {
                        toggleShowMoreReplies(levelOneReply?.post_id); // Expand level 1 replies
                    }

                    // Expand levelTwo replies
                    levelOneReply?.replies?.forEach(levelTwoReply => {
                        if (levelTwoReply?.post_id === repliedPostId) {
                            scrollToPostAfterExpand(levelTwoReply?.post_id); // Scroll to this reply
                        } else if (levelTwoReply?.replies?.some(levelThreeReply => levelThreeReply?.post_id === repliedPostId)) {

                            // Expand levelTwo replies only if they haven't been expanded yet
                            if (!showMoreReplies[levelTwoReply?.post_id]) {
                                toggleShowMoreReplies(levelTwoReply?.post_id); // Expand level 2 replies
                            }

                            levelTwoReply?.replies?.forEach(levelThreeReply => {
                                if (levelThreeReply?.post_id === repliedPostId) {
                                    scrollToPostAfterExpand(levelThreeReply?.post_id); // Scroll to level 3 reply
                                }
                            });
                        }
                    });
                }
            });
        });
    };


    const scrollToPostAfterExpand = (repliedPostId) => {
        setTimeout(() => {
            const postElement = document.getElementById(repliedPostId);
            if (postElement) {
                window.scrollTo(0, postElement.offsetTop);
            }
        }, 500); // Small delay to ensure DOM update after expanding
    };

    const handleLikeChange = async (postId, userId, discussionTitle, postCreatorName) => {
        if (!user) {
            setLoginModalOpen(true); // Open login modal if the user is not authenticated
            return;
        }

        // Save the current scroll position
        const currentScrollY = window.scrollY;


        try {
            await axios.post('/api/forum/post/like', {
                post_id: postId,
                discussion_id: discussionId,
                user_id: userId,
                title: discussionTitle,
                postCreatorName: postCreatorName,
            });

            // Fetch the updated posts
            const response = await axios.get(`/api/discussions/${discussionId}/posts`);
            setAllPost(response.data);

            const replies = response.data[0].replies || [];
            setFirstLevelReplies(replies)

            setSortDiscussions(handleOptionSelect(selectedSort))

            // Get the element of the liked post
            const postElement = document.getElementById(`post-${postId}`);
            if (postElement) {
                // Calculate the vertical center position
                const elementPosition = postElement.getBoundingClientRect().top + window.scrollY;
                const offset = (window.innerHeight / 2) - (postElement.offsetHeight / 2);

                // Scroll to the post, centered in the viewport
                window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth' // Optional for smooth scrolling
                });
            } else {
                // If the post element is not found, restore the previous scroll position
                window.scrollTo(0, currentScrollY);
            }

        } catch (error) {
            console.error('Error updating likes:', error);
        }
    };

    const descendingReplies = [...firstLevelReplies].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const mostRecent = [...firstLevelReplies].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const allReplies = sortDiscussions && sortDiscussions.length > 0 ? sortDiscussions : descendingReplies || [];

    // Another method to set allReplies value
    // let allReplies;
    // if (sortDiscussions && sortDiscussions.length > 0) {
    //     allReplies = sortDiscussions;
    // } else {
    //     allReplies = descendingReplies;
    // }


    // Sort by most liked (descending by total likes)
    const mostLiked = [...firstLevelReplies].sort((a, b) => {
        const likesA = a.likes ? a.likes.length : 0; // Get the number of likes for post a
        const likesB = b.likes ? b.likes.length : 0; // Get the number of likes for post b
        return likesB - likesA; // Sort in descending order
    });

    const handleOptionSelect = async (option) => {

        if (option.value === 'most recent') {
            setSortDiscussions(mostRecent);
            setSelectedSort('most recent')
        }

        if (option.value === 'most liked') {
            setSortDiscussions(mostLiked);
            setSelectedSort('most liked')
        }
    };


    const toggleLoginModal = () => {
        setLoginModalOpen((prev) => !prev)
    }

    const loginModal = () => {
        setLoginModalOpen(true)
    }

    const toggleShowMoreReplies = (postId) => {
        setShowMoreReplies((prev => ({ ...prev, [postId]: !prev[postId] })))
    }


    const toggleContent = (postId) => {
        setShowMoreContent((prev => ({ ...prev, [postId]: !prev[postId] })))
    }

    const toggleThreeDotsOption = (postId) => {
        setThreeDotsOption({})
        setThreeDotsOption((prev => ({ ...prev, [postId]: true })))
    }

    const toggleReply = (postId) => {
        // Close the previous open reply editor 
        setOpenReply({});
        // Open the specific reply editor
        setOpenReply((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));

        if (!openReply[postId]) {
            // Only set the parentPostId and clear input when opening
            setContentValue('');
            setParentPostId(postId);
        }
    };

    const copyPostURL = async (postId) => {
        try {
            // Hide any existing alert
            setAlert({ show: false, type: '', message: '' });

            const postURL = `${window.location.origin}/forum/discussion/${discussionId}?repliedPostId=${postId}`;
            await navigator.clipboard.writeText(postURL);

            // Show success alert
            setAlert({ show: true, type: 'success', message: 'URL copied to clipboard!' });
        } catch (error) {
            console.error('Failed to copy URL: ', error);

            // Show error alert
            setAlert({ show: true, type: 'error', message: 'Failed to copy the URL. Please try again.' });
        }
    };


    const cancelReply = () => {
        setOpenReply({});
        setContentValue('');
        setParentPostId(null);
        setActivePostId(null)
    }

    const handleContentChange = (id, value) => {
        setActivePostId(id)
        setContentValue(value);
        setParentPostId(id);
    };


    const getTotalReplies = (posts) => {
        let totalReplies = 0;

        const countReplies = (post) => {
            totalReplies += post.replies.length;
            post.replies.forEach(countReplies); // Recursively count replies
        };

        posts.forEach(countReplies);
        return totalReplies;
    };

    // Usage
    const totalReplies = getTotalReplies(allPost);


    // Function to safely parse and format the date
    const getFormattedDate = (dateString) => {
        // Ensure dateString is a valid ISO string
        if (typeof dateString !== 'string') {
            return 'Invalid date';
        }

        const date = new Date(dateString);

        // Check if date is valid
        return isNaN(date.getTime())
            ? 'Invalid date'
            : formatDistanceToNow(date, { addSuffix: true, locale: enUS });
    };

    const handleNewDiscussionClick = () => {
        if (!user) {
            setLoginModalOpen(true)
        } else {
            navigate(`/forum/profile/${user.id}/add_discussions`);
        }
    };

    const handleSubmitReply = async (postUserId, discussionTitle, postCreatorName) => {
        if (!user) {
            setLoginModalOpen(true)
        }
        try {
            await axios.post('/api/post/create', {
                user_id: postUserId,
                title: discussionTitle,
                content: contentValue,
                discussion_id: discussionId,
                parent_post_id: parentPostId,
                postCreatorName: postCreatorName
            });

            // Optionally, refetch posts here if needed
            const response = await axios.get(`/api/discussions/${discussionId}/posts`);
            const replies = response.data[0].replies || [];
            setFirstLevelReplies(replies)
            setOpenReply({});
            setContentValue('');
            setParentPostId(null);
            setAllPost(response.data)
        } catch (error) {
            console.error("Error submitting the reply:", error);
        }
    };


    return (
        <>
            {loginModalOpen && <LoginModal onClick={toggleLoginModal} />}
            {alert.show && <AlertMessage type={alert.type} message={alert.message} />}
            <div className='discussion-container'>
                <Header authUser={user} />
                <div className="forum-discussion-page-container">
                    <FilterNavigation
                        authUser={user}
                        onClick={loginModal}
                        className='sticky-filter-nav'
                    />
                    <div className='forum-discussion-page-container-col2'>
                        <div className='language-selector-container'>
                            <GTranslate />
                        </div>
                        <SearchDiscussionBox />
                        <SmallScreenNavMenu />
                        <div className="new-discussion-container">
                            <NewDiscussionBtn onClick={handleNewDiscussionClick} label='Start a discussion' />
                        </div>
                        {allPost.map(post => (
                            <>
                                <div className="started-discussion-container" key={post?.post_id}>
                                    <div className='started-discussion-container-row1'>
                                        <div className='started-discussion-info'>
                                            <Link to={`/forum/profile/${post?.postCreator?.id}/created_discussions`}>
                                                <img src={post?.postCreator?.profile_pic || DefaultAvatar} alt="" />
                                            </Link>
                                            <div className='started-forum-discussion-info'>
                                                <div className='user-started-discussion'>
                                                    <Link to={`/forum/profile/${post?.postCreator?.id}/created_discussions`}>
                                                        {post?.postCreator?.display_name || 'Unknown'}
                                                    </Link>
                                                    <span className='started-discussion'>Started Discussion</span>
                                                </div>
                                                <small>Posted: {getFormattedDate(post.created_at)}</small>
                                            </div>
                                        </div>
                                        <div className="post-action-option">
                                            <div className='three-dots'>
                                                <ThreeDots onClick={() => toggleThreeDotsOption(post.post_id)} />
                                            </div>
                                            {threeDotsOption[post.post_id] &&
                                                <div className='three-dots-option'>
                                                    <ul>
                                                        <li onClick={() => copyPostURL(post.post_id)}>
                                                            <div className='link-icon'>
                                                                <LinkIcon />
                                                            </div>
                                                            <span>Copy URL</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    {!post?.parent_post_id && (
                                        <>
                                            <div className='started-discussion-container-row2' key={post?.post_id}>
                                                <label>{post?.discussion?.title}</label>
                                                <div className={showMoreContent[post?.post_id] ? 'show-all-content' : 'show-less-content'} dangerouslySetInnerHTML={{ __html: post?.content }} />
                                                {post?.content.length > 340 && (
                                                    <div style={{ textAlign: 'center' }}>
                                                        <div style={{ textAlign: 'center' }}>
                                                            <button className='toggle-content-btn' onClick={() => toggleContent(post?.post_id)}>
                                                                {showMoreContent[post?.post_id] ? 'Show less...' : 'Show more...'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className='started-discussion-container-row3'>
                                                <div className='view-reply-like-counter'>
                                                    <div className='like-counter'>
                                                        <button className={(post?.likes?.some(like => like.user_id === user?.id)) ? 'like-msg-icon-blue' : 'like-msg-icon'} onClick={() => handleLikeChange(post?.post_id, post?.user_id, post?.discussion?.title, post?.postCreator?.display_name)}>
                                                            <Like />
                                                        </button>
                                                        <span>{post?.likes?.length || 0} likes</span>
                                                    </div>
                                                    <div className='reply-counter'>
                                                        <div className='reply-msg-icon'><MsgIcon /></div>
                                                        <span>{totalReplies > 1 ? `${totalReplies} replies` : `${totalReplies} reply`}</span>
                                                    </div>
                                                    <div className='view-counter'>
                                                        <div className='view-msg-icon'><EyeIcon /></div>
                                                        <span>{post.views} views</span>
                                                    </div>
                                                </div>
                                                <BtnReply label='Reply' onClick={!user ? loginModal : () => toggleReply(post.post_id)} />
                                            </div>
                                        </>
                                    )}
                                </div>
                                {openReply[post.post_id] && (
                                    <>
                                        <QuillEditor
                                            id='replyLevelZero'
                                            name='replyLevelZero'
                                            className='new-reply-message'
                                            placeholder="Type your reply here..."
                                            value={activePostId === post?.post_id ? contentValue : ''}
                                            onChange={(content) => handleContentChange(post?.post_id, content)}
                                        />

                                        <div className='add-reply-button-container'>
                                            <BtnGreen label='Post Reply' onClick={() => handleSubmitReply(post?.user_id, post?.discussion?.title, post?.postCreator?.display_name)} />
                                            <BtnClear label='Cancel' onClick={cancelReply} />
                                        </div>
                                    </>
                                )}
                                {post.replies && post.replies.length > 0 &&
                                    <div className="filter-replies">
                                        <span className='replies-counter'>{totalReplies > 1 ? `${totalReplies} Replies` : `${totalReplies} Reply`}</span>
                                        <div className='replies-sortby-container' style={{ display: 'flex' }}>
                                            <span style={{ flexShrink: '0' }}>Sort By:</span>
                                            <CustomSelect
                                                data={filterDiscussionOptions}
                                                onOptionSelect={handleOptionSelect}
                                                className='forum-sortby-dropdown-select'
                                            />
                                        </div>
                                    </div>
                                }
                                {allReplies.map(levelOneReply => (
                                    <>
                                        <div id={levelOneReply.post_id} className="all-replies-container" key={levelOneReply.post_id}>
                                            <div className='reply-container'>
                                                <div className="reply-box">
                                                    <div className="reply-row1">
                                                        <div className='posted-reply-info'>
                                                            <Link to={`/forum/profile/${levelOneReply?.postCreator?.id}/created_discussions`}>
                                                                <img src={levelOneReply?.postCreator?.profile_pic || DefaultAvatar} alt="" />
                                                            </Link>
                                                            <div className="post-creator-info">
                                                                <div className='user-started-discussion'>
                                                                    <Link to={`/forum/profile/${levelOneReply?.postCreator?.id}/created_discussions`}>
                                                                        {levelOneReply.postCreator.display_name}
                                                                    </Link>
                                                                    {levelOneReply?.postCreator?.id === discussionStarter ? (
                                                                        <>
                                                                            <span className='started-discussion'>Started Discussion</span>
                                                                        </>
                                                                    ) : (
                                                                        null
                                                                    )}
                                                                </div>
                                                                <small>Posted: {getFormattedDate(levelOneReply.created_at)}</small>
                                                            </div>
                                                        </div>
                                                        <div className="post-action-option">
                                                            <div className='three-dots'>
                                                                <ThreeDots onClick={() => toggleThreeDotsOption(levelOneReply.post_id)} />
                                                            </div>
                                                            {threeDotsOption[levelOneReply.post_id] &&
                                                                <div className='three-dots-option'>
                                                                    <ul>
                                                                        <li onClick={() => copyPostURL(levelOneReply.post_id)}>
                                                                            <div className='link-icon'>
                                                                                <LinkIcon />
                                                                            </div>
                                                                            <span>Copy URL</span>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="reply-row2">
                                                        <div className={showMoreContent[levelOneReply?.post_id] ? 'show-all-content' : 'show-less-content'} dangerouslySetInnerHTML={{ __html: levelOneReply?.content }} />
                                                        {levelOneReply?.content.length > 340 && (
                                                            <div style={{ textAlign: 'center' }}>
                                                                <div style={{ textAlign: 'center' }}>
                                                                    <button className='toggle-content-btn' onClick={() => toggleContent(levelOneReply?.post_id)}>
                                                                        {showMoreContent[levelOneReply?.post_id] ? 'Show less...' : 'Show more...'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className='reply-row3'>
                                                        <div className='view-reply-like-counter'>
                                                            <div className='like-counter'>
                                                                <button className={levelOneReply.likes.some(like => like.user_id === user?.id) ? 'like-msg-icon-blue' : 'like-msg-icon'} onClick={() => handleLikeChange(levelOneReply?.post_id, levelOneReply?.user_id, post?.discussion?.title, levelOneReply?.postCreator?.display_name)}><Like /></button>
                                                                <span>{levelOneReply?.likes?.length || 0} likes</span>
                                                            </div>
                                                        </div>
                                                        <BtnReply label='Reply' onClick={!user ? loginModal : () => toggleReply(levelOneReply.post_id)} />
                                                    </div>
                                                </div>
                                                {openReply[levelOneReply.post_id] && (
                                                    <>
                                                        <QuillEditor
                                                            id='replyLevelOne'
                                                            name='replyLevelOne'
                                                            className='new-reply-message'
                                                            placeholder="Type your reply here..."
                                                            value={activePostId === levelOneReply?.post_id ? contentValue : ''}
                                                            onChange={(content) => handleContentChange(levelOneReply?.post_id, content)}
                                                        />

                                                        <div className='add-reply-button-container'>
                                                            <BtnGreen label='Post Reply' onClick={() => handleSubmitReply(levelOneReply?.user_id, post?.discussion?.title, levelOneReply?.postCreator?.display_name)} />
                                                            <BtnClear label='Cancel' onClick={cancelReply} />
                                                        </div>
                                                    </>
                                                )}
                                                <div className="toggle-hide-show-replies">
                                                    {levelOneReply.replies.length === 0 ? (''
                                                    ) : (
                                                        <>
                                                            {!showMoreReplies[levelOneReply?.post_id] ? (
                                                                <button className='show-replies-btn' onClick={() => toggleShowMoreReplies(levelOneReply?.post_id)}>Show {levelOneReply.replies.length > 1 ? `${levelOneReply.replies.length} replies` : `${levelOneReply.replies.length} reply`}</button>
                                                            ) : (
                                                                <button className='hide-replies-btn' onClick={() => toggleShowMoreReplies(levelOneReply?.post_id)}>{levelOneReply.replies.length > 1 ? 'Hide replies' : 'Hide reply'}</button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                {showMoreReplies[levelOneReply?.post_id] && (
                                                    <>
                                                        {
                                                            levelOneReply.replies.map(levelTwoReply => (
                                                                <div id={levelTwoReply.post_id} className="level2-replies-container" key={levelTwoReply.post_id}>
                                                                    <div className="reply-box">
                                                                        <div className="reply-row1">
                                                                            <div className='posted-reply-info'>
                                                                                <Link to={`/forum/profile/${levelTwoReply?.postCreator?.id}/created_discussions`}>
                                                                                    <img src={levelTwoReply?.postCreator?.profile_pic || DefaultAvatar} alt="" />
                                                                                </Link>
                                                                                <div className="post-creator-info">
                                                                                    <div className='user-started-discussion'>
                                                                                        <Link to={`/forum/profile/${levelTwoReply?.postCreator?.id}/created_discussions`}>
                                                                                            {levelTwoReply.postCreator.display_name}
                                                                                        </Link>
                                                                                        {levelTwoReply?.postCreator?.id === discussionStarter ? (
                                                                                            <>
                                                                                                <span className='started-discussion'>Started Discussion</span>
                                                                                            </>
                                                                                        ) : (
                                                                                            null
                                                                                        )}
                                                                                    </div>
                                                                                    <small>Posted: {getFormattedDate(levelTwoReply.created_at)}</small>
                                                                                </div>
                                                                            </div>
                                                                            <div className="post-action-option">
                                                                                <div className='three-dots'>
                                                                                    <ThreeDots onClick={() => toggleThreeDotsOption(levelTwoReply.post_id)} />
                                                                                </div>
                                                                                {threeDotsOption[levelTwoReply.post_id] &&
                                                                                    <div className='three-dots-option'>
                                                                                        <ul>
                                                                                            <li onClick={() => copyPostURL(levelTwoReply.post_id)}>
                                                                                                <div className='link-icon'>
                                                                                                    <LinkIcon />
                                                                                                </div>
                                                                                                <span>Copy URL</span>
                                                                                            </li>
                                                                                        </ul>
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="reply-row2">
                                                                            <div className={showMoreContent[levelTwoReply?.post_id] ? 'show-all-content' : 'show-less-content'} dangerouslySetInnerHTML={{ __html: levelTwoReply?.content }} />
                                                                            {levelTwoReply?.content.length > 340 && (
                                                                                <div style={{ textAlign: 'center' }}>
                                                                                    <div style={{ textAlign: 'center' }}>
                                                                                        <button className='toggle-content-btn' onClick={() => toggleContent(levelTwoReply?.post_id)}>
                                                                                            {showMoreContent[levelTwoReply?.post_id] ? 'Show less...' : 'Show more...'}
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className='reply-row3'>
                                                                            <div className='view-reply-like-counter'>
                                                                                <div className='like-counter'>
                                                                                    <button className={levelTwoReply.likes.some(like => like.user_id === user?.id) ? 'like-msg-icon-blue' : 'like-msg-icon'} onClick={() => handleLikeChange(levelTwoReply?.post_id, levelTwoReply?.user_id, post?.discussion?.title, levelTwoReply?.postCreator?.display_name)}><Like /></button>
                                                                                    <span>{levelTwoReply?.likes?.length || 0} likes</span>
                                                                                </div>
                                                                            </div>
                                                                            <BtnReply label='Reply' onClick={!user ? loginModal : () => toggleReply(levelTwoReply.post_id)} />
                                                                        </div>
                                                                    </div>
                                                                    {openReply[levelTwoReply.post_id] && (
                                                                        <>
                                                                            <QuillEditor
                                                                                id='replyLevelTwo'
                                                                                name='replyLevelTwo'
                                                                                className='new-reply-message'
                                                                                placeholder="Type your reply here..."
                                                                                value={activePostId === levelTwoReply?.post_id ? contentValue : ''}
                                                                                onChange={(content) => handleContentChange(levelTwoReply?.post_id, content)}
                                                                            />

                                                                            <div className='add-reply-button-container'>
                                                                                <BtnGreen label='Post Reply' onClick={() => handleSubmitReply(levelTwoReply?.user_id, post?.discussion?.title, levelTwoReply?.postCreator?.display_name)} />
                                                                                <BtnClear label='Cancel' onClick={cancelReply} />
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                    <div className="toggle-hide-show-replies">
                                                                        {levelTwoReply.replies.length === 0 ? (''
                                                                        ) : (
                                                                            <>
                                                                                {!showMoreReplies[levelTwoReply?.post_id] ? (
                                                                                    <button className='show-replies-btn' onClick={() => toggleShowMoreReplies(levelTwoReply?.post_id)}>Show {levelTwoReply.replies.length > 1 ? `${levelTwoReply.replies.length} replies` : `${levelTwoReply.replies.length} reply`}</button>
                                                                                ) : (
                                                                                    <button className='hide-replies-btn' onClick={() => toggleShowMoreReplies(levelTwoReply?.post_id)}>{levelTwoReply.replies.length > 1 ? 'Hide replies' : 'Hide reply'}</button>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    {showMoreReplies[levelTwoReply?.post_id] && (
                                                                        <>
                                                                            {levelTwoReply.replies.map(levelThreeReply => (
                                                                                <div id={levelThreeReply.post_id} className="level2-replies-container last-reply-container" key={levelThreeReply.post_id}>
                                                                                    <div className="reply-box">
                                                                                        <div className="reply-row1">
                                                                                            <div className='posted-reply-info'>
                                                                                                <Link to={`/forum/profile/${levelThreeReply?.postCreator?.id}/created_discussions`}>
                                                                                                    <img src={levelThreeReply?.postCreator?.profile_pic || DefaultAvatar} alt="" />
                                                                                                </Link>
                                                                                                <div className="post-creator-info">
                                                                                                    <div className='user-started-discussion'>
                                                                                                        <Link to={`/forum/profile/${levelThreeReply?.postCreator?.id}/created_discussions`}>
                                                                                                            {levelThreeReply.postCreator.display_name}
                                                                                                        </Link>
                                                                                                        {levelThreeReply?.postCreator?.id === discussionStarter ? (
                                                                                                            <>
                                                                                                                <span className='started-discussion'>Started Discussion</span>
                                                                                                            </>
                                                                                                        ) : (
                                                                                                            null
                                                                                                        )}
                                                                                                    </div>
                                                                                                    <small>Posted: {getFormattedDate(levelThreeReply.created_at)}</small>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="post-action-option">
                                                                                                <div className='three-dots'>
                                                                                                    <ThreeDots onClick={() => toggleThreeDotsOption(levelThreeReply.post_id)} />
                                                                                                </div>
                                                                                                {threeDotsOption[levelThreeReply.post_id] &&
                                                                                                    <div className='three-dots-option'>
                                                                                                        <ul>
                                                                                                            <li onClick={() => copyPostURL(levelThreeReply.post_id)}>
                                                                                                                <div className='link-icon'>
                                                                                                                    <LinkIcon />
                                                                                                                </div>
                                                                                                                <span>Copy URL</span>
                                                                                                            </li>
                                                                                                        </ul>
                                                                                                    </div>
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='parent-post-container'>
                                                                                            <div className='parent-post-container-row1'>
                                                                                                <Link>{levelThreeReply.parentPostCreator.display_name} said:</Link>
                                                                                                <div dangerouslySetInnerHTML={{ __html: levelThreeReply.parentPostContent }} />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="reply-row2">
                                                                                            <div className={showMoreContent[levelThreeReply?.post_id] ? 'show-all-content' : 'show-less-content'} dangerouslySetInnerHTML={{ __html: levelThreeReply?.content }} />
                                                                                            {levelThreeReply?.content.length > 340 && (
                                                                                                <div style={{ textAlign: 'center' }}>
                                                                                                    <div style={{ textAlign: 'center' }}>
                                                                                                        <button className='toggle-content-btn' onClick={() => toggleContent(levelThreeReply?.post_id)}>
                                                                                                            {showMoreContent[levelThreeReply?.post_id] ? 'Show less...' : 'Show more...'}
                                                                                                        </button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                        <div className='reply-row3'>
                                                                                            <div className='view-reply-like-counter'>
                                                                                                <div className='like-counter'>
                                                                                                    <button className={levelThreeReply.likes.some(like => like.user_id === user?.id) ? 'like-msg-icon-blue' : 'like-msg-icon'} onClick={() => handleLikeChange(levelThreeReply?.post_id, levelThreeReply?.user_id, post?.discussion?.title, levelThreeReply?.postCreator?.display_name)}><Like /></button>
                                                                                                    <span>{levelThreeReply?.likes?.length || 0} likes</span>
                                                                                                </div>
                                                                                            </div>
                                                                                            <BtnReply label='Reply' onClick={!user ? loginModal : () => toggleReply(levelThreeReply.post_id)} />
                                                                                        </div>
                                                                                    </div>
                                                                                    {openReply[levelThreeReply?.post_id] && (
                                                                                        <>
                                                                                            <QuillEditor
                                                                                                id='replyLevelThree'
                                                                                                name='replyLevelThree'
                                                                                                className='new-reply-message'
                                                                                                placeholder="Type your reply here..."
                                                                                                value={activePostId === levelThreeReply?.post_id ? contentValue : ''}
                                                                                                onChange={(content) => handleContentChange(levelThreeReply?.post_id, content)}
                                                                                            />

                                                                                            <div className='add-reply-button-container'>
                                                                                                <BtnGreen label='Post Reply' onClick={() => handleSubmitReply(levelThreeReply?.user_id, post?.discussion?.title, levelThreeReply?.postCreator?.display_name)} />
                                                                                                <BtnClear label='Cancel' onClick={cancelReply} />
                                                                                            </div>
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            ))
                                                        }
                                                    </>
                                                )}
                                            </div >
                                        </div >
                                    </>
                                ))}
                            </>
                        ))}
                    </div>
                </div >
                <Footer className='forum-discussion-page-footer' />
            </div >
        </>
    )
}

export default Discussion;