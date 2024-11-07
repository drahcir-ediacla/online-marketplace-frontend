import { Link } from 'react-router-dom'
import './style.scss'
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ReactComponent as GroupMsgIcon } from '../../../assets/images/group-message-icon.svg'
import { ReactComponent as MsgIcon } from '../../../assets/images/message-icon.svg'
import { ReactComponent as EyeIcon } from '../../../assets/images/eye-solid.svg'

const HomePageSubCategoryCard = ({ subcategories }) => {

    const getFormattedDate = (dateString) => {
        if (typeof dateString !== 'string') {
            return 'Invalid date';
        }

        const date = new Date(dateString);
        return isNaN(date.getTime())
            ? 'Invalid date'
            : formatDistanceToNow(date, { addSuffix: true, locale: enUS });
    };

    return (
        <>
            {subcategories.map(item => (
                <div className="forum-sub-category" key={item.id}>
                    <div className='forum-sub-category-col1'>
                        <div className='forum-sub-category-info'>
                            <div className='forum-sub-category-icon'><GroupMsgIcon /></div>
                            <div className='forum-sub-category-title-desc'>
                                <Link to={`/forum/subcategory/${item.id}/${item.name}`}><h5>{item.name}</h5></Link>
                                <span>{item.description}</span>
                            </div>
                        </div>
                    </div>
                    <div className='forum-sub-category-col2'>
                        <div className="view-reply-counter">
                            <div className="reply-counter">
                                <div className='reply-msg-icon'><MsgIcon /></div>
                                <span>{item.totalPosts}</span>
                            </div>
                            <div className="view-counter">
                                <div className='view-msg-icon'><EyeIcon /></div>
                                <span>{item.totalViews}</span>
                            </div>
                        </div>
                        <span className="last-activity-time">
                            {item.latestPost ? (getFormattedDate(item.latestPost)) : 'no activity'}
                        </span>
                    </div>
                </div>
            ))}
        </>
    );
};


export default HomePageSubCategoryCard
