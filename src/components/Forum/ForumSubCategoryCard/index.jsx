import { Link } from 'react-router-dom'
import './style.scss'
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ReactComponent as GroupMsgIcon } from '../../../assets/images/group-message-icon.svg'
import { ReactComponent as MsgIcon } from '../../../assets/images/message-icon.svg'
import { ReactComponent as EyeIcon } from '../../../assets/images/eye-solid.svg'

const ForumSubCategory = ({ data }) => {

    const combinedData = data.subcategories.map((subcategory) => {
        // Find matching discussions based on forum_category_id
        const matchingDiscussions = data.allDiscussions.filter(discussion => discussion.forum_category_id === subcategory.id);

        // Function to find the latest post in a discussion, including replies
        const findLatestPost = (posts) => {
            let latestPost = null;

            const checkPost = (post) => {
                // Compare current post's created_at with the latest post found
                if (!latestPost || new Date(post?.created_at) > new Date(latestPost?.created_at)) {
                    latestPost = post;
                }

                // Recursively check replies
                post.replies.forEach(checkPost);
            };

            // Start the search for latest post from all top-level posts
            posts.forEach(checkPost);

            return latestPost;
        };

        // Gather all posts (including replies) across all discussions
        let allPosts = [];

        matchingDiscussions.forEach(discussion => {
            allPosts = [...allPosts, ...discussion.post]; // Add top-level posts
            discussion.post.forEach(post => {
                allPosts = [...allPosts, ...post.replies]; // Add replies
            });
        });

        // Find the latest post across all posts in this subcategory
        const latestPost = findLatestPost(allPosts); 

        // Function to calculate total replies
        const getTotalReplies = (posts) => {
            let totalReplies = 0;

            const countReplies = (post) => {
                totalReplies += post.replies.length;
                post.replies.forEach(countReplies); // Recursively count replies
            };

            posts.forEach(countReplies);
            return totalReplies;
        };

        // Calculate total posts for all discussions (top-level posts + replies)
        const totalPosts = matchingDiscussions.reduce((count, discussion) => {
            const topLevelPostsCount = discussion.post ? discussion.post.length : 0; // Count top-level posts
            const repliesCount = getTotalReplies(discussion.post); // Count replies
            return count + topLevelPostsCount + repliesCount; // Total posts = top-level + replies
        }, 0);

        // Calculate total views of all posts for each subcategory
        const totalViews = matchingDiscussions.reduce((count, discussion) => {
            return count + (discussion.post[0]?.views || 0);  // Access views from the first post
        }, 0);

        // Return the subcategory with the matching discussions and total counts
        return {
            ...subcategory,               // Keep subcategory data
            discussions: matchingDiscussions, // Add discussions with latest post
            totalPosts,                   // Add total post count
            totalViews,
            latestPost                    // Add latest post info
        };
    });

    console.log(combinedData);
    
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
                        <span className="last-activity-time">{item.discussions.length > 0 ? (getFormattedDate(item.latestPost?.created_at)) : 'no activity'}</span>
                    </div>
                </div>
            ))}
        </>
    )
}

export default ForumSubCategory
