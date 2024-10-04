import './style.scss'
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ReactComponent as Like } from '../../../assets/images/like-icon.svg'
import { ReactComponent as MsgIcon } from '../../../assets/images/message-icon.svg'
import { ReactComponent as EyeIcon } from '../../../assets/images/eye-solid.svg'
import DefaultAvatar from '../../../assets/images/avatar-icon.png'

const ForumDiscussionCard = ({ data }) => {
    console.log('Data:', data);

    // Function to safely parse and format the date
    const getFormattedDate = (dateString) => {
        if (typeof dateString !== 'string') {
            return 'Invalid date';
        }

        const date = new Date(dateString);
        return isNaN(date.getTime())
            ? 'Invalid date'
            : formatDistanceToNow(date, { addSuffix: true, locale: enUS });
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

    return (
        <>
            {data?.map(discussion => (
                <div className="forum-discussion-card" key={discussion?.discussion_id}>
                    <div className='forum-discussion-card-row1'>
                        <img src={discussion?.discussionStarter?.profile_pic || DefaultAvatar} alt='' />
                        <div className='forum-discussion-info'>
                            <Link to={`/forum/discussion/${discussion?.discussion_id}`}>
                                <h6>{discussion?.title}</h6>
                            </Link>
                            <small>
                                by {discussion?.discussionStarter?.display_name} {getFormattedDate(discussion?.created_at)}
                            </small>
                        </div>
                    </div>
                    {discussion?.post?.map(post => (
                        <div className='forum-discussion-card-row2' key={post?.post_id}>
                            <div dangerouslySetInnerHTML={{ __html: post?.content }} />
                        </div>
                    ))}
                    <div className='forum-discussion-card-row3'>
                        <div className="view-reply-like-counter">
                            <div className="like-counter">
                                <div className='like-msg-icon'><Like /></div>
                                <span>{discussion?.like || 0}</span>
                            </div>
                            <div className="reply-counter">
                                <div className='reply-msg-icon'><MsgIcon /></div>
                                <span>{getTotalReplies(discussion?.post)} replies</span>
                            </div>
                            <div className="view-counter">
                                <div className='view-msg-icon'><EyeIcon /></div>
                                <span>{discussion?.views || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default ForumDiscussionCard;
