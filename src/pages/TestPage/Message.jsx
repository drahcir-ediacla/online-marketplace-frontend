// src/components/Message.js
import React, { useState } from 'react';
// import './style.scss'

const Message = ({ message, addReply, level }) => {
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      addReply(message.id, replyText, message.text);
      setReplyText('');
    }
  };

  return (
    <div style={{ marginLeft: level * 20, borderLeft: '1px solid #ddd', padding: '10px' }}>
      <p><strong>Message:</strong> {message.text}</p>
      {message.repliedTo && (
        <div style={{ marginLeft: '20px', fontStyle: 'italic', color: '#555' }}>
          <strong>In Reply To:</strong> {message.repliedTo}
        </div>
      )}
      {message.replies.map((reply) => (
        <Message key={reply.id} message={reply} addReply={addReply} level={level + 1} />
      ))}
      <form onSubmit={handleReplySubmit}>
        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Reply to this message"
        />
        <button type="submit">Reply</button>
      </form>
    </div>
  );
};

export default Message;
