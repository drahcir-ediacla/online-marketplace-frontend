

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import io from 'socket.io-client';
import axios from '../../apicalls/axios';
import useAuthentication from '../../hooks/authHook'
import './style.scss'

function App() {
  const { chat_id } = useParams();
  const { user } = useAuthentication();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [receiverInfo, setReceiverInfo] = useState(null); // State to store receiver information
  const sender_id = user?.id.toString();
  const [receiver_id, setReceiverId] = useState(null); // State to store receiver_id


  useEffect(() => {
    // Connect to the WebSocket server
    const socket = io(process.env.REACT_APP_BASE_URL);

    // Listen for the 'receive_message' event
    socket.on('receive_message', (data) => {
      console.log('Received message:', data);
      const isMessageExists = messages.some(msg => msg.id === data.id);

      if (!isMessageExists) {
        setMessages(prevMessages => [...prevMessages, data]);
      }
    });

    // Cleanup: Disconnect the socket when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array to run the effect only once






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
        const chatMessage = response.data[0];

        // Check conditions and set receiver_id accordingly
        if (chatMessage) {
          if (chatMessage.sender_id !== sender_id) {
            // If sender_id is not equal to user?.id.toString()
            setReceiverId(chatMessage.sender_id);
          } else {
            // If sender_id is equal to user?.id.toString()
            setReceiverId(chatMessage.receiver_id);
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessagesAndSetReceiver();
  }, [chat_id, sender_id]);







  const sendMessage = async () => {
    const socket = io(process.env.REACT_APP_BASE_URL); // Initialize the socket connection

    // Emit the send_message event with the message details
    socket.emit('send_message', {
      sender_id,
      receiver_id,
      content: input
    });

    // Send the message to the server using Axios
    await axios.post('/api/send/messages', {
      sender_id,
      receiver_id,
      content: input
    });

    // Clear the input field after sending the message
    setInput('');
  };



  // const sendMessage = async () => {
  //   const socket = io('http://localhost:8081'); // Initialize the socket connection

  //   // Emit the send_message event with the message details
  //   socket.emit('send_message', {
  //     sender_id,
  //     receiver_id,
  //     content: input
  //   });

  //   setInput(''); // Clear the input field after sending the message
  // };


  return (
    <div className="App">
      <h1>Chat Messenger</h1>
      <div className="chat-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={message.sender_id === sender_id ? 'sent-message' : 'received-message'}
          >
            <strong>{message.sender_id === sender_id ? 'You' : receiverInfo?.display_name}: </strong>
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
