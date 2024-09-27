import React, { useState } from 'react';
import axios from '../../apicalls/axios';

const Post = ({ post, discussionId }) => {
  const [openReply, setOpenReply] = useState({});
  const [inputValue, setInputValue] = useState('');
  console.log('inputValue:', inputValue)
  const [parentPostId, setParentPostId] = useState(null);
  console.log('parentPostId:', parentPostId)

  const toggleReply = (postId) => {
    setOpenReply((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));

    if (!openReply[postId]) {
      // Only set the parentPostId and clear input when opening
      setInputValue('');
      setParentPostId(postId);
    } else {
      // Clear input and reset parentPostId when closing
      setInputValue('');
      setParentPostId(null);
    }
  };

  const handleContentChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    if (inputValue.trim() === '') return; // Prevent empty submissions

    try {
      await axios.post('/api/post/create', {
        content: inputValue,
        discussion_id: discussionId,
        parent_post_id: parentPostId,
      });
      // Clear input and reset parentPostId after successful submission
      setInputValue('');
      setParentPostId(null);
      // Optionally, refetch posts here if needed
    } catch (error) {
      console.error("Error submitting the reply:", error);
    }
  };

  return (
    <div style={{ marginLeft: `${post.level * 20}px`, borderLeft: '2px solid #ccc', paddingLeft: '10px', marginTop: '10px' }}>
      <div>
        {post.level === 0 && <p>Starter</p>}
        <strong>{post.postCreator.display_name}</strong> (Level {post.level}) says:
      </div>
      {post.level >= 3 && (
        <div>
          <b>Replied to: {post.parentPostCreator.display_name}</b>
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <div style={{ fontSize: 'small', color: 'gray' }}>{new Date(post.created_at).toLocaleString()}</div>
      <button onClick={() => toggleReply(post.post_id)}>Reply</button>
      {openReply[post.post_id] && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={handleContentChange}
            placeholder="Reply to this message"
          />
          <button type="submit">Post Reply</button>
        </form>
      )}

      {/* Render replies recursively */}
      <div>
        {post.replies.map(reply => (
          <Post key={reply.post_id} post={reply} discussionId={discussionId} />
        ))}
      </div>
    </div>
  );
};

export default Post;
