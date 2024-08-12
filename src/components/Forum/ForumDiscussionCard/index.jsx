import './style.scss'
import { ReactComponent as Like } from '../../../assets/images/like-icon.svg'
import { ReactComponent as MsgIcon } from '../../../assets/images/message-icon.svg'
import { ReactComponent as EyeIcon } from '../../../assets/images/eye-solid.svg'
import DefaultAvatar from '../../../assets/images/avatar-icon.png'

const ForumDiscussionCard = ({ title, postedMessage, author, date, like, replies, views }) => {
    return (
        <>
            <div className="forum-discussion-card">
                <div className='forum-discussion-card-row1'>
                    <img src={DefaultAvatar} alt='' />
                    <div className='forum-discussion-info'>
                        <label>{title}</label>
                        <small>by {author} {date}</small>
                    </div>
                </div>
                <div className='forum-discussion-card-row2'>
                    <p>{postedMessage}</p>
                </div>
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
        </>
    )
}

export default ForumDiscussionCard
