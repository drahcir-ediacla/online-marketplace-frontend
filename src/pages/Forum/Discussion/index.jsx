import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import './style.scss'
import axios from '../../../apicalls/axios'
import useAuthentication from '../../../hooks/authHook'
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Header from '../../../layouts/Forum/Header'
import FilterNavigation from '../../../layouts/Forum/FilterNavigation'
import GTranslate from '../../../components/GTranslate';
import LoginModal from '../../../components/Modal/LoginModal';
import SearchDiscussionBox from '../../../components/SearchDiscussionBox'
import BtnReply from '../../../components/Button/BtnReply';
import { Setloader } from '../../../redux/reducer/loadersSlice';
import { ReactComponent as Like } from '../../../assets/images/like-icon.svg'
import { ReactComponent as MsgIcon } from '../../../assets/images/message-icon.svg'
import { ReactComponent as EyeIcon } from '../../../assets/images/eye-solid.svg'
import DefaultAvatar from '../../../assets/images/avatar-icon.png'



const AddDiscussion = () => {

    const { discussionId } = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { user } = useAuthentication()
    const [discussionData, setDiscussionData] = useState({})
    const [loginModalOpen, setLoginModalOpen] = useState(false)
    console.log('discussionData:', discussionData)

    useEffect(() => {
        const fetchDiscussionData = async () => {
            dispatch(Setloader(true))
            try {
                const response = await axios.get(`/api/getdiscussion/${discussionId}`);
                setDiscussionData(response.data)
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
                    <div className="started-discussion-container">
                        <div className='started-discussion-container-row1'>
                            <img src={DefaultAvatar} alt="" />
                            <div className='started-forum-discussion-info'>
                                <label>{discussionData.title}</label>
                                <small>by {discussionData.discussionStarter?.display_name || 'Unknown'} {getFormattedDate(discussionData.created_at)}</small>
                            </div>
                        </div>
                        {discussionData.post && discussionData.post.length > 0 ? (
                            discussionData.post.map(post => (
                                !post?.parent_post_id && (
                                    <div className='started-discussion-container-row2' key={post.post_id}>
                                        <div dangerouslySetInnerHTML={{ __html: post?.content }} />
                                    </div>
                                )
                            ))
                        ) : (
                            <div>No posts available.</div>
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
                </div>
            </div>

        </>
    )
}

export default AddDiscussion;