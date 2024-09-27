import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import './style.scss'
import axios from '../../apicalls/axios'
import useAuthentication from '../../hooks/authHook'
import { enUS } from 'date-fns/locale';
import Header from '../../layouts/Forum/Header'
import FilterNavigation from '../../layouts/Forum/FilterNavigation'
import GTranslate from '../../components/GTranslate';
import LoginModal from '../../components/Modal/LoginModal';
import SearchDiscussionBox from '../../components/SearchDiscussionBox'
import BtnReply from '../../components/Button/BtnReply';
import { Setloader } from '../../redux/reducer/loadersSlice';
import QuillEditor from '../../components/QuillEditor';
import { ReactComponent as Like } from '../../assets/images/like-icon.svg'
import { ReactComponent as MsgIcon } from '../../assets/images/message-icon.svg'
import { ReactComponent as EyeIcon } from '../../assets/images/eye-solid.svg'
import DefaultAvatar from '../../assets/images/avatar-icon.png'
import BtnGreen from '../../components/Button/BtnGreen';
import BtnClear from '../../components/Button/BtnClear';



const Discussion = () => {

    const { discussionId } = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { user } = useAuthentication()
    const [openReply, setOpenReply] = useState({});
    const [contentValue, setContentValue] = useState('')
    console.log('contentValue:', contentValue)
    const [parentPostId, setParentPostId] = useState(null);
    console.log('parentPostId:', parentPostId)
    const [allPost, setAllPost] = useState([]);
    const [loginModalOpen, setLoginModalOpen] = useState(false)

    useEffect(() => {
        const fetchDiscussionData = async () => {
            dispatch(Setloader(true))
            try {
                const response = await axios.get(`/api/discussions/${discussionId}/posts`);
                setAllPost(response.data)
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

    const toggleLoginModal = () => {
        setLoginModalOpen((prev) => !prev)
    }

    const loginModal = () => {
        setLoginModalOpen(true)
    }

    const toggleReply = (postId, parentPostId) => {
        setOpenReply((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));

        if (!openReply[postId]) {
            // Only set the parentPostId and clear input when opening
            setContentValue('');
            setParentPostId(parentPostId);
        } else {
            // Clear input and reset parentPostId when closing
            setContentValue('');
            setParentPostId(null);
        }
    };

    const handleContentChange = (value) => {
        setContentValue(value);
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the form from refreshing the page

        try {
            await axios.post('/api/post/create', {
                content: contentValue,
                discussion_id: discussionId,
                parent_post_id: parentPostId,
            });
            // Clear input and reset parentPostId after successful submission
            setContentValue('');
            setParentPostId(null);
            // Optionally, refetch posts here if needed
        } catch (error) {
            console.error("Error submitting the reply:", error);
        }
    };


    return (
        <>
            {loginModalOpen && <LoginModal onClick={toggleLoginModal} />}
            <Header authUser={user} />
            <div className='language-selector-container'>
                <GTranslate />
            </div>
            <div className="forum-discussion-page-container">
                <FilterNavigation
                    authUser={user}
                    onClick={loginModal}
                />
                <div className='forum-discussion-page-container-col2'>
                    <SearchDiscussionBox />
                    {allPost.map(post => (
                        <>
                            <div className="started-discussion-container" key={post?.post_id}>
                                <div className='started-discussion-container-row1'>
                                    <img src={post?.postCreator?.profile_pic || DefaultAvatar} alt="" />
                                    <div className='started-forum-discussion-info'>
                                        <label>{post?.discussion?.title}</label>
                                        <small>by {post?.postCreator?.display_name || 'Unknown'} {getFormattedDate(post.created_at)}</small>
                                    </div>
                                </div>
                                {!post?.parent_post_id && (
                                    <div className='started-discussion-container-row2' key={post?.post_id}>
                                        <div dangerouslySetInnerHTML={{ __html: post?.content }} />
                                    </div>
                                )}
                                <div className='started-discussion-container-row3'>
                                    <div className='view-reply-like-counter'>
                                        <div className='like-counter'>
                                            <div className='like-msg-icon'><Like /></div>
                                            <span>4.5k</span>
                                        </div>
                                        <div className='reply-counter'>
                                            <div className='reply-msg-icon'><MsgIcon /></div>
                                            <span>4.5k</span>
                                        </div>
                                        <div className='view-counter'>
                                            <div className='view-msg-icon'><EyeIcon /></div>
                                            <span>1.2M</span>
                                        </div>
                                    </div>
                                    <BtnReply label='Reply' />
                                </div>
                            </div>

                            <div className="filter-replies">
                                <span>12 Replies</span>
                                <div><span>Sort By</span></div>
                            </div>
                            {post.replies.map(levelOneReply => (
                                <>
                                    <div className="all-replies-container" key={levelOneReply.post_id}>
                                        <div className='reply-container'>
                                            <div className="reply-box">
                                                <div className="reply-row1">
                                                    <img src={levelOneReply?.postCreator?.profile_pic || DefaultAvatar} alt="" />
                                                    <div className="post-creator-info">
                                                        <span>{levelOneReply.postCreator.display_name}</span>
                                                        <small>{getFormattedDate(levelOneReply.created_at)}</small>
                                                        <span>Level: {levelOneReply.level}</span>
                                                    </div>
                                                </div>
                                                <div className="reply-row2">
                                                    <div dangerouslySetInnerHTML={{ __html: levelOneReply?.content }} />
                                                </div>
                                                <div className='reply-row3'>
                                                    <div className='view-reply-like-counter'>
                                                        <div className='like-counter'>
                                                            <div className='like-msg-icon'><Like /></div>
                                                            <span>4.5k</span>
                                                        </div>
                                                        <div className='reply-counter'>
                                                            <div className='reply-msg-icon'><MsgIcon /></div>
                                                            <span>4.5k</span>
                                                        </div>
                                                        <div className='view-counter'>
                                                            <div className='view-msg-icon'><EyeIcon /></div>
                                                            <span>1.2M</span>
                                                        </div>
                                                    </div>
                                                    <BtnReply label='Reply' onClick={() => toggleReply(levelOneReply.post_id, levelOneReply.post_id)} />
                                                </div>
                                            </div>
                                            {openReply[levelOneReply.post_id] && (
                                                <>
                                                    <QuillEditor
                                                        id='replyLevelOne'
                                                        name='replyLevelOne'
                                                        className='new-discussion-message'
                                                        value={contentValue}
                                                        onChange={(e) => handleContentChange(e)}
                                                    />

                                                    <div className='add-discussion-button-container'>
                                                        <BtnGreen label='Post Discussion' onClick={handleSubmit} />
                                                        <BtnClear label='Clear' />
                                                    </div>
                                                </>
                                            )}
                                            <div className="toggle-hide-show-replies">Show more replies</div>
                                            {levelOneReply.replies.map(levelTwoReply => (
                                                <div className="level2-replies-container" key={levelTwoReply.post_id}>
                                                    <div className="reply-box">
                                                        <div className="reply-row1">
                                                            <img src={levelTwoReply?.postCreator?.profile_pic || DefaultAvatar} alt="" />
                                                            <div className="post-creator-info">
                                                                <span>{levelTwoReply.postCreator.display_name}</span>
                                                                <small>{getFormattedDate(levelTwoReply.created_at)}</small>
                                                                <span>Level: {levelTwoReply.level}</span>
                                                            </div>
                                                        </div>
                                                        <div className="reply-row2">
                                                            <div dangerouslySetInnerHTML={{ __html: levelTwoReply?.content }} />
                                                        </div>
                                                        <div className='reply-row3'>
                                                            <div className='view-reply-like-counter'>
                                                                <div className='like-counter'>
                                                                    <div className='like-msg-icon'><Like /></div>
                                                                    <span>4.5k</span>
                                                                </div>
                                                                <div className='reply-counter'>
                                                                    <div className='reply-msg-icon'><MsgIcon /></div>
                                                                    <span>4.5k</span>
                                                                </div>
                                                                <div className='view-counter'>
                                                                    <div className='view-msg-icon'><EyeIcon /></div>
                                                                    <span>1.2M</span>
                                                                </div>
                                                            </div>
                                                            <BtnReply label='Reply' onClick={() => toggleReply(levelTwoReply.post_id, levelTwoReply.post_id)} />
                                                        </div>
                                                    </div>
                                                    {openReply[levelTwoReply.post_id] && (
                                                        <>
                                                            <QuillEditor
                                                                id='replyLevelTwo'
                                                                name='replyLevelTwo'
                                                                className='new-discussion-message'
                                                                value={contentValue}
                                                                onChange={(e) => handleContentChange(e)}
                                                            />

                                                            <div className='add-discussion-button-container'>
                                                                <BtnGreen label='Post Discussion' />
                                                                <BtnClear label='Clear' />
                                                            </div>
                                                        </>
                                                    )}
                                                    <div className="toggle-hide-show-replies">Show Replies</div>
                                                    {levelTwoReply.replies.map(levelThreeReply => (
                                                        <div className="level2-replies-container">
                                                            <div className="reply-box">
                                                                <div className="reply-row1">
                                                                    <img src={levelThreeReply?.postCreator?.profile_pic || DefaultAvatar} alt="" />
                                                                    <div className="post-creator-info">
                                                                        <span>{levelThreeReply.postCreator.display_name}</span>
                                                                        <small>{getFormattedDate(levelThreeReply.created_at)}</small>
                                                                        <span>Level: {levelThreeReply.level}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="reply-row2">
                                                                    <div dangerouslySetInnerHTML={{ __html: levelThreeReply?.content }} />
                                                                </div>
                                                                <div className='reply-row3'>
                                                                    <div className='view-reply-like-counter'>
                                                                        <div className='like-counter'>
                                                                            <div className='like-msg-icon'><Like /></div>
                                                                            <span>4.5k</span>
                                                                        </div>
                                                                        <div className='reply-counter'>
                                                                            <div className='reply-msg-icon'><MsgIcon /></div>
                                                                            <span>4.5k</span>
                                                                        </div>
                                                                        <div className='view-counter'>
                                                                            <div className='view-msg-icon'><EyeIcon /></div>
                                                                            <span>1.2M</span>
                                                                        </div>
                                                                    </div>
                                                                    <BtnReply label='Reply' onClick={() => toggleReply(levelThreeReply.post_id, levelTwoReply.post_id)} />
                                                                </div>
                                                            </div>
                                                            {openReply[levelThreeReply.post_id] && (
                                                                <>
                                                                    <QuillEditor
                                                                        id='replyLevelThree'
                                                                        name='replyLevelThree'
                                                                        className='new-discussion-message'
                                                                        value={contentValue}
                                                                        onChange={(e) => handleContentChange(e)}
                                                                    />

                                                                    <div className='add-discussion-button-container'>
                                                                        <BtnGreen label='Post Discussion' />
                                                                        <BtnClear label='Clear' />
                                                                    </div>
                                                                </>
                                                            )}
                                                            <div className="toggle-hide-show-replies">Show Replies</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ))}
                        </>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Discussion;