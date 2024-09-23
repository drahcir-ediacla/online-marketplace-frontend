// src/components/MessageList.js
import React from 'react';
import Message from './Message';

const MessageList = ({ messages, addReply }) => {
  return (
    <div>
      {messages.map((message) => (
        <Message key={message.id} message={message} addReply={addReply} level={0} />
      ))}
    </div>
  );
};

export default MessageList;
