import { useState } from 'react'
import './style.scss'
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';


import BtnReply from '../../../components/Button/BtnReply';
import { ReactComponent as Like } from '../../../assets/images/like-icon.svg'
import { ReactComponent as MsgIcon } from '../../../assets/images/message-icon.svg'
import { ReactComponent as EyeIcon } from '../../../assets/images/eye-solid.svg'
import DefaultAvatar from '../../../assets/images/avatar-icon.png'



const Post = ({ post, discussionId }) => {

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
            <div className="started-discussion-container">
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
                        <div>
        
                    </div>
                    {post.replies.map(reply => (
          <Post key={reply.post_id} post={reply} discussionId={discussionId} />
        ))}
      </div>
        </>
    )
}

export default Post;