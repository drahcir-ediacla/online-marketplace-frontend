import { Link } from 'react-router-dom'
import './style.scss'
import { ReactComponent as GroupMsgIcon } from '../../../assets/images/group-message-icon.svg'
import { ReactComponent as MsgIcon } from '../../../assets/images/message-icon.svg'
import { ReactComponent as EyeIcon } from '../../../assets/images/eye-solid.svg'

const ForumSubCategory = ({ replies, views, lastActivity, data }) => {


    return (
        <>
            {data.map(subcategory => (
                <div className="forum-sub-category" key={subcategory.id}>
                    <div className='forum-sub-category-col1'>
                        <div className='forum-sub-category-info'>
                            <div className='forum-sub-category-icon'><GroupMsgIcon /></div>
                            <div className='forum-sub-category-title-desc'>
                                <Link to={`/forum/subcategory/${subcategory.id}/${subcategory.name}`}><h5>{subcategory.name}</h5></Link>
                                <span>{subcategory.description}</span>
                            </div>
                        </div>
                    </div>
                    <div className='forum-sub-category-col2'>
                        <div className="view-reply-counter">
                            <div className="reply-counter">
                                <div className='reply-msg-icon'><MsgIcon /></div>
                                <span>{replies}</span>
                            </div>
                            <div className="view-counter">
                                <div className='view-msg-icon'><EyeIcon /></div>
                                <span>{views}</span>
                            </div>
                        </div>
                        <span className="last-activity-time">{lastActivity}</span>
                    </div>
                </div>
            ))}

        </>
    )
}

export default ForumSubCategory
