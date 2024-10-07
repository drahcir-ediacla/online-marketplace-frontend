import './style.scss'
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ReactComponent as Like } from '../../../assets/images/like-icon.svg'
import { ReactComponent as MsgIcon } from '../../../assets/images/message-icon.svg'
import { ReactComponent as EyeIcon } from '../../../assets/images/eye-solid.svg'
import DefaultAvatar from '../../../assets/images/avatar-icon.png'

const FilterTagDiscussionCard = ({ data, replies }) => {



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
            {data?.map(discussion => (
                <div className="forum-discussion-card" key={discussion?.discussion_id}>
                    <div className='forum-discussion-card-row1'>
                        <img src={discussion?.discussionStarter?.profile_pic || DefaultAvatar} alt='' />
                        <div className='forum-discussion-info'>
                            <Link to={`/forum/discussion/${discussion?.discussion_id}`}><h6>{discussion?.allDiscussionsInTag?.title}</h6></Link>
                            <small>
                                by {discussion?.allDiscussionsInTag?.discussionStarter?.display_name} {getFormattedDate(discussion?.allDiscussionsInTag?.created_at)}
                            </small>
                        </div>
                    </div>
                    {discussion?.allDiscussionsInTag?.post?.map(post => (
                        <>
                            <div className='forum-discussion-card-row2' key={post?.post_id}>
                                <div dangerouslySetInnerHTML={{ __html: post?.content }} />
                            </div>
                            <div className='forum-discussion-card-row3'>
                                <div className="view-reply-like-counter">
                                    <div className="like-counter">
                                        <div className='like-msg-icon'><Like /></div>
                                        <span>{post?.likes?.length} likes</span>
                                    </div>
                                    <div className="reply-counter">
                                        <div className='reply-msg-icon'><MsgIcon /></div>
                                        <span>{replies}</span>
                                    </div>
                                    <div className="view-counter">
                                        <div className='view-msg-icon'><EyeIcon /></div>
                                        <span>{post?.views} views</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ))}
                </div>
            ))}
        </>
    )
}

export default FilterTagDiscussionCard
