import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../apicalls/axios'

const Discussion = () => {
  const { discussionId } = useParams();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [parentPostId, setParentPostId] = useState(null);

  useEffect(() => {
    // Fetch posts for this discussion from API
    const fetchPosts = async () => {
      const response = await axios.get(`/api/discussions/${discussionId}`);
      setPosts(response.data);
    };

    fetchPosts();
  }, [discussionId]);

  const handleReply = async (postId) => {
    setParentPostId(postId);
  };

  const handleSubmit = async () => {
    await axios.post('/api/post/create', {
      content,
      discussion_id: discussionId,
      parent_post_id: parentPostId
    });
    setContent('');
    setParentPostId(null);
    // Refetch posts after submitting
    const response = await axios.get(`/api/discussions/${discussionId}`);
    setPosts(response.data);
  };

  // Recursive function to render nested posts up to 3 levels
  const renderPosts = (post, level = 0) => {
    return (
      <div key={post.post_id} style={{ marginLeft: level * 20 }}>
        <p><strong>{post.postCreator.display_name}:</strong> {post.content}</p>
        {level < 3 && (
          post.replies?.map(reply => renderPosts(reply, level + 1))
        )}
        {level >= 3 && (
          <div style={{ marginTop: '10px', marginLeft: '20px', borderLeft: '2px solid #ccc', paddingLeft: '10px' }}>
            <strong>Replies (flat view):</strong>
            {post?.replies?.replies?.replies.map(reply => (
              <div key={reply.post_id}>
                <p>
                  <strong>{reply.postCreator.display_name}:</strong> {reply.content}
                  <br />
                  <em>(in reply to {post.postCreator.display_name}'s comment)</em>
                </p>
              </div>
            ))}
          </div>
        )}
        {post.level < 3 && (
          <button onClick={() => handleReply(post.post_id)}>Reply</button>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2>Discussion</h2>
      {posts.filter(post => post.level === 0).map(post => renderPosts(post))}
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Discussion;
