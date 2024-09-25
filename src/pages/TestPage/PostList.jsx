import Post from "./Post";

const PostList = ({ posts, discussionId }) => {
    return (
      <div>
        {posts.map(post => (
          <Post key={post.post_id} post={post} discussionId={discussionId} />
        ))}
      </div>
    );
  };


  export default PostList