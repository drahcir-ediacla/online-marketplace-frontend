// src/App.js
import React, { useState } from 'react';
import MessageList from './MessageList';

const App = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'This is the first message', replies: [], repliedTo: null },
    { id: 2, text: 'This is the second message', replies: [], repliedTo: null },
  ]);

  const addReply = (messageId, replyText, repliedToText) => {
    const addReplyToMessage = (messages, messageId, replyText, repliedToText) => {
      return messages.map((message) => {
        if (message.id === messageId) {
          return {
            ...message,
            replies: [
              ...message.replies,
              { id: Date.now(), text: replyText, replies: [], repliedTo: repliedToText },
            ],
          };
        } else {
          return {
            ...message,
            replies: addReplyToMessage(message.replies, messageId, replyText, repliedToText),
          };
        }
      });
    };

    setMessages((prevMessages) => addReplyToMessage(prevMessages, messageId, replyText, repliedToText));
  };

  return (
    <div>
      <h1>Community Forum</h1>
      <MessageList messages={messages} addReply={addReply} />
    </div>
  );
};

export default App;
