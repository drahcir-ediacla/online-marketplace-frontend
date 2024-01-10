

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import io from 'socket.io-client';
import axios from '../../apicalls/axios';
import useAuthentication from '../../hooks/authHook'

function App() {
  const { chat_id } = useParams();
  const { user } = useAuthentication();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [receiverInfo, setReceiverInfo] = useState(null); // State to store receiver information
  const sender_id = user?.id.toString();
  const [receiver_id, setReceiverId] = useState(null); // State to store receiver_id


  useEffect(() => {
    const socket = io('http://localhost:8081'); // Connect to your WebSocket server

    socket.on('receive_message', (data) => {
      // Check if the message already exists in the state to prevent duplicates
      const isMessageExists = messages.some(msg => msg.id === data.id); // Assuming each message has a unique 'id' property

      if (!isMessageExists) {
        setMessages(prevMessages => [...prevMessages, data]); // Update messages state with received message
      }
    });


    return () => {
      socket.disconnect(); // Cleanup on component unmount
    };
  }, [messages]);



  useEffect(() => {
    const fetchReceiverInfo = async () => {
      try {
        const response = await axios.get(`/api/user/${receiver_id}`);
        setReceiverInfo(response.data); // Update receiverInfo state with fetched data
      } catch (error) {
        console.error('Error fetching receiver information:', error);
      }
    };

    if (receiver_id) {
      fetchReceiverInfo(); // Fetch receiver information only if receiver_id is available
    }
  }, [receiver_id]);




  // Fetch messages on component mount or when sender or receiver changes
  useEffect(() => {
    const fetchMessagesAndSetReceiver = async () => {
      try {
        const response = await axios.get(`/api/get/messages/${chat_id}`);
        setMessages(response.data);
        
        // Find the first message
        const firstMessage = response.data[0];
        
        // Check conditions and set receiver_id accordingly
        if (firstMessage) {
          if (firstMessage.sender_id !== sender_id) {
            // If sender_id is not equal to user?.id.toString()
            setReceiverId(firstMessage.sender_id);
          } else {
            // If sender_id is equal to user?.id.toString()
            setReceiverId(firstMessage.receiver_id);
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
  
    fetchMessagesAndSetReceiver();
  }, [chat_id, sender_id]);
  





  const sendMessage = async () => {
    await axios.post('/api/send/messages', {
      sender_id,
      receiver_id,
      content: input
    });

    const newMessage = {
      sender_id,
      receiver_id,
      content: input
    };

    setMessages([...messages, newMessage]); // Update messages state with new message
    setInput('');
  };

  return (
    <div className="App">
      <h1>Chat Messenger</h1>
      <div className="chat-container">
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.sender_id === sender_id ? 'You' : receiverInfo?.display_name }: </strong>
            {message.content}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
