import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../apicalls/axios'
import PostList from './PostList';


const App = () => {
  const { discussionId } = useParams();
  const [posts, setPosts] = useState([]);


  useEffect(() => {
    // Fetch posts for this discussion from API
    const fetchPosts = async () => {
      const response = await axios.get(`/api/discussions/${discussionId}`);
      setPosts(response.data);
    };

    fetchPosts();
  }, [discussionId]);





  return (
    <div>
      <h1>Community Forum</h1>
      <PostList posts={posts} discussionId={discussionId} />
    </div>
  );
};

export default App;
