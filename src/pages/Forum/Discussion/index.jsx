import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
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
import SearchDiscussionBox from '../../../components/SearchDiscussionBox'
import BtnReply from '../../../components/Button/BtnReply';
import { Setloader } from '../../../redux/reducer/loadersSlice';
import QuillEditor from '../../../components/QuillEditor';
import { ReactComponent as Like } from '../../../assets/images/like-icon.svg'
import { ReactComponent as MsgIcon } from '../../../assets/images/message-icon.svg'
import { ReactComponent as EyeIcon } from '../../../assets/images/eye-solid.svg'
import DefaultAvatar from '../../../assets/images/avatar-icon.png'
import BtnGreen from '../../../components/Button/BtnGreen';
import BtnClear from '../../../components/Button/BtnClear';



const Discussion = () => {

    const { discussionId } = useParams();
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
    const [allPost, setAllPost] = useState([]);
    const [loginModalOpen, setLoginModalOpen] = useState(false)


    useEffect(() => {
        const fetchDiscussionData = async () => {
            dispatch(Setloader(true))
            try {
                const response = await axios.get(`/api/discussions/${discussionId}/posts`);
                setAllPost(response.data)
                const firstPostId = response.data.length > 0 ? response.data[0].post_id : null;
                setPostId(firstPostId)
                console.log("First post ID:", firstPostId);
                dispatch(Setloader(false))
            } catch (error) {
                dispatch(Setloader(false))
                if (error.response && error.response.status === 404) {
                    // If the product is not found, navigate to the "Page Not Found" page
                    navigate('/404');
                } else {
                    console.error("Error fetching data:", error);
                }

            }
        }
        fetchDiscussionData()
    }, [discussionId])

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


    const handleLikeChange = async (postId) => {
        if (!user) {
            setLoginModalOpen(true); // Open login modal if the user is not authenticated
            return;
        }
    
        // Save the current scroll position
        const currentScrollY = window.scrollY;
    
        try {
            await axios.post('/api/forum/post/like', { post_id: postId });
    
            // Fetch the updated posts
            const response = await axios.get(`/api/discussions/${discussionId}/posts`);
            setAllPost(response.data);
           
    
            // Restore the scroll position after updating the state
            window.scrollTo(0, currentScrollY);
        } catch (error) {
            console.error('Error updating likes:', error);
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

    const handleSubmit = async () => {

        try {
            await axios.post('/api/post/create', {
                content: contentValue,
                discussion_id: discussionId,
                parent_post_id: parentPostId,
            });

            // Optionally, refetch posts here if needed
            const response = await axios.get(`/api/discussions/${discussionId}/posts`);
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
                        {allPost.map(post => (
                            <>
                                <div className="started-discussion-container" key={post?.post_id}>
                                    <div className='started-discussion-container-row1'>
                                        <img src={post?.postCreator?.profile_pic || DefaultAvatar} alt="" />
                                        <div className='started-forum-discussion-info'>
                                            <label>{post?.discussion?.title}</label>
                                            <small>by {post?.postCreator?.display_name || 'Unknown'} &nbsp;&nbsp;&nbsp;&nbsp; Posted: {getFormattedDate(post.created_at)}</small>
                                        </div>
                                    </div>
                                    {!post?.parent_post_id && (
                                        <>
                                            <div className='started-discussion-container-row2' key={post?.post_id}>
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
                                                        <button className={(post?.likes?.some(like => like.user_id === user.id)) ? 'like-msg-icon-blue' : 'like-msg-icon'} onClick={() => handleLikeChange(post?.post_id)}>
                                                            <Like />
                                                        </button>
                                                        <span>{post?.likes?.length || 0} likes</span>
                                                    </div>
                                                    <div className='reply-counter'>
                                                        <div className='reply-msg-icon'><MsgIcon /></div>
                                                        <span>{totalReplies} replies</span>
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
                                            <BtnGreen label='Post Reply' onClick={handleSubmit} />
                                            <BtnClear label='Cancel' onClick={cancelReply} />
                                        </div>
                                    </>
                                )}
                                {post.replies && post.replies.length > 0 &&
                                    <div className="filter-replies">
                                        <span className='replies-counter'>{totalReplies} Replies</span>
                                        <div><span>Sort By</span></div>
                                    </div>
                                }
                                {post.replies.map(levelOneReply => (
                                    <>
                                        <div className="all-replies-container" key={levelOneReply.post_id}>
                                            <div className='reply-container'>
                                                <div className="reply-box">
                                                    <div className="reply-row1">
                                                        <img src={levelOneReply?.postCreator?.profile_pic || DefaultAvatar} alt="" />
                                                        <div className="post-creator-info">
                                                            <span>{levelOneReply.postCreator.display_name}</span>
                                                            <small>Posted: {getFormattedDate(levelOneReply.created_at)}</small>
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
                                                                <button className={levelOneReply.likes.some(like => like.user_id === user.id) ? 'like-msg-icon-blue' : 'like-msg-icon'} onClick={() => handleLikeChange(levelOneReply?.post_id)}><Like /></button>
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
                                                            <BtnGreen label='Post Reply' onClick={handleSubmit} />
                                                            <BtnClear label='Cancel' onClick={cancelReply} />
                                                        </div>
                                                    </>
                                                )}
                                                <div className="toggle-hide-show-replies">
                                                    {levelOneReply.replies.length === 0 ? (''
                                                    ) : (
                                                        <>
                                                            {!showMoreReplies[levelOneReply?.post_id] ? (
                                                                <button className='show-replies-btn' onClick={() => toggleShowMoreReplies(levelOneReply?.post_id)}>Show {levelOneReply.replies.length} replies</button>
                                                            ) : (
                                                                <button className='hide-replies-btn' onClick={() => toggleShowMoreReplies(levelOneReply?.post_id)}>Hide replies</button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                {showMoreReplies[levelOneReply?.post_id] && (
                                                    <>
                                                        {
                                                            levelOneReply.replies.map(levelTwoReply => (
                                                                <div className="level2-replies-container" key={levelTwoReply.post_id}>
                                                                    <div className="reply-box">
                                                                        <div className="reply-row1">
                                                                            <img src={levelTwoReply?.postCreator?.profile_pic || DefaultAvatar} alt="" />
                                                                            <div className="post-creator-info">
                                                                                <span>{levelTwoReply.postCreator.display_name}</span>
                                                                                <small>Posted: {getFormattedDate(levelTwoReply.created_at)}</small>
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
                                                                                    <button className={levelTwoReply.likes.some(like => like.user_id === user.id) ? 'like-msg-icon-blue' : 'like-msg-icon'} onClick={() => handleLikeChange(levelTwoReply?.post_id)}><Like /></button>
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
                                                                                <BtnGreen label='Post Reply' onClick={handleSubmit} />
                                                                                <BtnClear label='Cancel' onClick={cancelReply} />
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                    <div className="toggle-hide-show-replies">
                                                                        {levelTwoReply.replies.length === 0 ? (''
                                                                        ) : (
                                                                            <>
                                                                                {!showMoreReplies[levelTwoReply?.post_id] ? (
                                                                                    <button className='show-replies-btn' onClick={() => toggleShowMoreReplies(levelTwoReply?.post_id)}>Show {levelTwoReply.replies.length} replies</button>
                                                                                ) : (
                                                                                    <button className='hide-replies-btn' onClick={() => toggleShowMoreReplies(levelTwoReply?.post_id)}>Hide replies</button>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    {showMoreReplies[levelTwoReply?.post_id] && (
                                                                        <>
                                                                            {levelTwoReply.replies.map(levelThreeReply => (
                                                                                <div className="level2-replies-container last-reply-container">
                                                                                    <div className="reply-box">
                                                                                        <div className="reply-row1">
                                                                                            <img src={levelThreeReply?.postCreator?.profile_pic || DefaultAvatar} alt="" />
                                                                                            <div className="post-creator-info">
                                                                                                <span>{levelThreeReply.postCreator.display_name}</span>
                                                                                                <small>Posted: {getFormattedDate(levelThreeReply.created_at)}</small>
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
                                                                                                    <button className={levelThreeReply.likes.some(like => like.user_id === user.id) ? 'like-msg-icon-blue' : 'like-msg-icon'} onClick={() => handleLikeChange(levelThreeReply?.post_id)}><Like /></button>
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
                                                                                                <BtnGreen label='Post Reply' onClick={handleSubmit} />
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
                                            </div>
                                        </div>
                                    </>
                                ))}
                            </>
                        ))}
                    </div>
                </div>
                <Footer className='forum-discussion-page-footer' />
            </div>
        </>
    )
}

export default Discussion;