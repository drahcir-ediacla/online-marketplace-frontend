import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../apicalls/axios';

const TagFilter = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  console.log('selectedTags:', selectedTags)
  const [discussions, setDiscussions] = useState([]);
  console.log('discussions:', discussions)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('/api/fetchforumtags');
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

 

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await axios.get('/api/filtertags', {
          params: {
            tag_id: selectedTags.join(','),
          },
        });

        const newDiscussions = response.data;

        setDiscussions((prevDiscussions) => {
          const existingDiscussionIds = new Set(prevDiscussions.map(d => d.discussion_id));

          const uniqueNewDiscussions = newDiscussions.filter(
            (newDiscussion) => !existingDiscussionIds.has(newDiscussion.discussion_id)
          );

          return [...prevDiscussions, ...uniqueNewDiscussions];
        });
      } catch (error) {
        console.error('Error fetching discussions:', error);
      }
    };

    if (selectedTags.length > 0) {
      fetchDiscussions();
    } else {
      setDiscussions([]); // Reset discussions when no tags are selected
    }
  }, [selectedTags]);
  

   // Toggle tag selection
   const toggleTag = (tag_id) => {
    setSelectedTags((prevSelectedTags) => {
      const updatedTags = prevSelectedTags.includes(tag_id)
        ? prevSelectedTags.filter((t) => t !== tag_id)
        : [...prevSelectedTags, tag_id];

      navigate('/test'); // Navigate after updating the state

      return updatedTags;
    });
  };

  return (
    <div>
      <h3>Select Tags to Filter Discussions</h3>
      <div>
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => toggleTag(tag.id)}
            style={{
              backgroundColor: selectedTags.includes(tag.id) ? 'lightgreen' : 'lightgray',
              margin: '5px',
              padding: '10px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {tag.name}
          </button>
        ))}
      </div>

      <h3>Filtered Discussions</h3>
      <ul>
        {discussions.length > 0 ? (
          discussions.map((discussion) => (
            <li key={discussion.id}>
              {discussion.allDiscussionsInTag.title} (ID: {discussion.discussion_id})
            </li>
          ))
        ) : (
          <p>No discussions found</p>
        )}
      </ul>
    </div>
  );
};

export default TagFilter;
