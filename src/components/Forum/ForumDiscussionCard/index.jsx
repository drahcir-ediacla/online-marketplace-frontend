import './style.scss'
import { ReactComponent as Like } from '../../../assets/images/like-icon.svg'
import { ReactComponent as MsgIcon } from '../../../assets/images/message-icon.svg'
import { ReactComponent as EyeIcon } from '../../../assets/images/eye-solid.svg'
import DefaultAvatar from '../../../assets/images/avatar-icon.png'

const ForumDiscussionCard = ({ data, title, postedMessage, author, date, like, replies, views }) => {
    console.log('Data:', data)

    const avatar = data?.discussionStarter?.profile_pic || DefaultAvatar;

    return (
        <>
            {data?.map(discussion => (
                <div className="forum-discussion-card" key={discussion?.discussion_id}>
                    <div className='forum-discussion-card-row1'>
                        <img src={avatar} alt='' />
                        <div className='forum-discussion-info'>
                            <label>{discussion?.title}</label>
                            <small>by {discussion?.discussionStarter?.display_name} {date}</small>
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
                                <span>{like}</span>
                            </div>
                            <div className="reply-counter">
                                <div className='reply-msg-icon'><MsgIcon /></div>
                                <span>{replies}</span>
                            </div>
                            <div className="view-counter">
                                <div className='view-msg-icon'><EyeIcon /></div>
                                <span>{views}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default ForumDiscussionCard
