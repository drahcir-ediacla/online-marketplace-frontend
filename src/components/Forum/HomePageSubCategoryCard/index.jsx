import { Link } from 'react-router-dom'
import './style.scss'
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ReactComponent as GroupMsgIcon } from '../../../assets/images/group-message-icon.svg'
import { ReactComponent as MsgIcon } from '../../../assets/images/message-icon.svg'
import { ReactComponent as EyeIcon } from '../../../assets/images/eye-solid.svg'

const HomePageSubCategoryCard = ({ subcategories, allDiscussions }) => {

    const combinedData = subcategories?.map((subcategory) => {
        // Find matching discussions based on forum_category_id
        const matchingDiscussions = allDiscussions.filter(
            (discussion) => discussion.forum_category_id === subcategory.id
        );

        // Function to find the latest post in a discussion, including replies
        const findLatestPost = (posts) => {
            let latestPost = null;

            const checkPost = (post) => {
                if (!latestPost || new Date(post?.created_at) > new Date(latestPost?.created_at)) {
                    latestPost = post;
                }

                post?.replies?.forEach(checkPost);
            };

            posts?.forEach(checkPost);

            return latestPost;
        };

        let allPosts = [];

        matchingDiscussions?.forEach((discussion) => {
            allPosts = [...allPosts, ...discussion.post]; 
            discussion?.post?.forEach((post) => {
                allPosts = [...allPosts, ...post.replies];
            });
        });

        const latestPost = findLatestPost(allPosts);

        const getTotalReplies = (posts) => {
            let totalReplies = 0;

            const countReplies = (post) => {
                totalReplies += post?.replies?.length || 0;
                post?.replies?.forEach(countReplies);
            };

            posts?.forEach(countReplies);
            return totalReplies;
        };

        const totalPosts = matchingDiscussions?.reduce((count, discussion) => {
            const topLevelPostsCount = discussion.post?.length || 0;
            const repliesCount = getTotalReplies(discussion.post);
            return count + topLevelPostsCount + repliesCount;
        }, 0);

        const totalViews = matchingDiscussions?.reduce((count, discussion) => {
            return count + (discussion?.post?.[0]?.views || 0);
        }, 0);

        return {
            ...subcategory,
            discussions: matchingDiscussions,
            totalPosts,
            totalViews,
            latestPost,
        };
    }) ?? [];

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
            {combinedData.map(item => (
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
                            {item.discussions.length > 0 ? (getFormattedDate(item.latestPost?.created_at)) : 'no activity'}
                        </span>
                    </div>
                </div>
            ))}
        </>
    );
};


export default HomePageSubCategoryCard
