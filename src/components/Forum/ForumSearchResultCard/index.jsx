import './style.scss'
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ReactComponent as Like } from '../../../assets/images/like-icon.svg'
import { ReactComponent as MsgIcon } from '../../../assets/images/message-icon.svg'
import { ReactComponent as EyeIcon } from '../../../assets/images/eye-solid.svg'
import { ReactComponent as RepliedIcon } from '../../../assets/images/replied-icon.svg'
import DefaultAvatar from '../../../assets/images/avatar-icon.png'

const ForumSearchResultCard = ({ data }) => {

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
                <div className="forum-discussion-card" key={discussion?.post?.post_id}>
                    <div className='forum-discussion-card-row1'>
                        <Link to={`/forum/profile/${discussion?.user_id}/created_discussions`}>
                            <img src={discussion?.discussionStarter?.profile_pic || DefaultAvatar} alt='' />
                        </Link>
                        <div className='forum-discussion-info'>
                            <Link to={`/forum/discussion/${discussion?.discussion_id}?repliedPostId=${discussion?.post?.post_id}`}>
                                <h6>{discussion?.discussion_title}</h6>
                            </Link>
                            <small>
                                by&nbsp;
                                <Link to={`/forum/profile/${discussion?.discussion_user_id}/created_discussions`}>
                                    {discussion?.discussionStarter?.display_name}
                                </Link>
                                &nbsp;{getFormattedDate(discussion?.discussion_created_at)}
                            </small>
                        </div>
                    </div>
                    {discussion?.post?.level !== 0 && <div className='replied-icon'><RepliedIcon /> <small>Replied Post</small></div>}
                    <div className='forum-discussion-card-row2'>
                        <div dangerouslySetInnerHTML={{ __html: discussion?.post?.content }} />
                    </div>
                </div>
            ))}
        </>
    )
}

export default ForumSearchResultCard;
