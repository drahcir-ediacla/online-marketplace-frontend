// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from '../../apicalls/axios'
// import PostList from './PostList';


// const App = () => {
//   const { discussionId } = useParams();
//   const [posts, setPosts] = useState([]);


//   useEffect(() => {
//     // Fetch posts for this discussion from API
//     const fetchPosts = async () => {
//       const response = await axios.get(`/api/discussions/${discussionId}/posts`);
//       setPosts(response.data);
//     };

//     fetchPosts();
//   }, [discussionId]);





//   return (
//     <div>
//       <h1>Community Forum</h1>
//       <PostList posts={posts} discussionId={discussionId} />
//     </div>
//   );
// };

// export default App;

import { useState } from "react"

const Test = () => {
  const initialPosts = [
    { id: 1, content: 'This is a reply 1', replies: [{ id: 4, content: 'This is a reply to 1' }] },
    { id: 2, content: 'This is a reply 2', replies: [{ id: 5, content: 'This is a reply to 2' }] },
    { id: 3, content: 'This is a reply 3', replies: [{ id: 6, content: 'This is a reply to 3' }] },
  ]
  console.log('initialPosts:', initialPosts)

  const [posts, setPosts] = useState(initialPosts)
  console.log('posts:', posts)
  const [contentValue, setContentValue] = useState('') // Keeps track of the current input
  const [activePostId, setActivePostId] = useState(null) // Stores the currently active post id
  const [localValues, setLocalValues] = useState({}) // Keeps track of each input value
  const [openReplies, setOpenReplies] = useState({}) // Keeps track of reply toggles for each post

  const handleOnChange = (id, value) => {
    setActivePostId(id) // Set the currently active post's id
    setContentValue(value) // Update the content value for the active input
    setLocalValues(prev => ({
      ...prev,
      [id]: value, // Update the specific post's value in the localValues object
    }))
  }

  const toggleReply = (id) => {
    setOpenReplies(prev => ({
      ...prev,
      [id]: !prev[id], // Toggle the reply input for the specific post id
    }))
  }

  const handlePostReply = (postId) => {
    const newReply = {
      id: Math.max(...posts.flatMap(p => p.replies.map(r => r.id))) + 1, // Incrementing the ID
      content: localValues[postId] || '', // Get the content from the input field
    }

    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, replies: [...post.replies, newReply] } // Add new reply to the correct post
          : post
      )
    )

    // Clear the input for the current post
    setLocalValues(prev => ({
      ...prev,
      [postId]: '', // Reset the input value for the current post
    }))
    setContentValue('') // Clear the contentValue state
    setActivePostId(null) // Reset the active post
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "auto", height: "100vh", gap: "20px", alignItems: "center", justifyContent: "center" }}>
      {posts.map(post => (
        <div key={post.id} style={{ display: "flex", flexDirection: 'column', gap: '10px' }}>
          <div>
            {post.content}
            <button onClick={() => toggleReply(post.id)}>Reply</button>
          </div>

          {openReplies[post.id] && (
            <div>
              <input
                type="text"
                value={activePostId === post.id ? contentValue : (localValues[post.id] || '')} // Show contentValue for the active input or retrieve the stored value from localValues
                onChange={(e) => handleOnChange(post.id, e.target.value)}
              />
              <button onClick={() => handlePostReply(post.id)}>Post</button>
            </div>
          )}

          {/* Display replies */}
          <div>
            {post.replies.map(reply => (
              <div key={reply.id} style={{ marginLeft: '20px' }}>
                {reply.content}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Test
