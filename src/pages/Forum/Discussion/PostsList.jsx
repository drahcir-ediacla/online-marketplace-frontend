import Post from "./Post";


const PostList = ({ posts, discussionId }) => {
    return (
        <>
        {posts.map(post => (
            <Post key={post.post_id} post={post} discussionId={discussionId} />
        ))}
        </>
    )
}


export default PostList