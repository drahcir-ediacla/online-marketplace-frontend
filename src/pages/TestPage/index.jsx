// import React, { useState } from 'react';

// // Sample data structure for categories and subcategories
// const categoriesData = [
//   {
//     id: 1,
//     name: 'Electronics',
//     subcategories: [
//       {
//         label: 'Mobile Phones'
//       },
//       {
//         label: 'Laptops'
//       },
//       {
//         label: 'Cameras'
//       }
//     ]
//   },
//   {
//     id: 2,
//     name: 'Clothing',
//     subcategories: [
//       {
//         label: 'Men'
//       },
//       {
//         label: 'Women'
//       },
//       {
//         label: 'Kids'
//       }
//     ]
//   },
//   {
//     id: 3,
//     name: 'Books',
//     subcategories: [
//       {
//         label: 'Fiction'
//       },
//       {
//         label: 'Non Fiction'
//       },
//       {
//         label: 'Children'
//       }
//     ]
//   }
// ];

// const SearchFilter = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredCategories, setFilteredCategories] = useState(categoriesData);

//   const handleSearchChange = (e) => {
//     const searchTerm = e.target.value;
//     setSearchTerm(searchTerm);

//     if (searchTerm === '') {
//       setFilteredCategories(categoriesData); // Reset to all categories when searchTerm is empty
//       return;
//     }

//     const filtered = categoriesData.filter(category => {
//       return category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       category.subcategories.some(sub => sub.label.toLowerCase().includes(searchTerm.toLowerCase()))

//     });

//     setFilteredCategories(filtered);
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Search categories and subcategories..."
//         value={searchTerm}
//         onChange={handleSearchChange}
//       />

//       <ul>
//         {filteredCategories.map((category) => (
//           <li key={category.id}>
//             <strong>{category.name}</strong>
//             <ul>
//               {category.subcategories.map((subcategory, index) => (
//                 subcategory.label.toLowerCase().includes(searchTerm.toLowerCase()) && (
//                   <li key={index}>{subcategory.label}</li>
//                 )
//               ))}
//             </ul>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SearchFilter;




// import React, { useState, useEffect } from 'react';
// import axios from '../../apicalls/axios';

// function App() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const sender = '2'; // Replace with actual user
//   const receiver = '1'; // Replace with actual user

//   // Fetch messages on component mount
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await axios.get(`/api/messages/${sender}/${receiver}`);
//         setMessages(response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();
//   }, [sender, receiver]); // Dependency array to re-fetch messages when sender or receiver changes

//   // Function to send a message
//   const sendMessage = async () => {
//     try {
//       await axios.post('/api/messages', {
//         sender,
//         receiver,
//         message: input
//       });

//       // Update messages state with the new message
//       const newMessage = {
//         sender,
//         receiver,
//         message: input
//       };
//       setMessages([...messages, newMessage]); // Add the new message to the messages state

//       setInput(''); // Clear the input field
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   return (
//     <div className="App">
//       <h1>Chat Messenger</h1>
//       <div>
//         {messages.map((message, index) => (
//           <div key={index}>
//             <strong>{message.sender}: </strong>
//             {message.message}
//           </div>
//         ))}
//       </div>
//       <div>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Enter message..."
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// }

// export default App;



import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from '../../apicalls/axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const sender = '2';
  const receiver = '1';
  
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



    // Fetch messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/messages/${sender}/${receiver}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []); // Dependency array to re-fetch messages when sender or receiver changes




  const sendMessage = async () => {
    await axios.post('/api/messages', {
      sender,
      receiver,
      message: input
    });

    const newMessage = {
      sender,
      receiver,
      message: input
    };
    
    setMessages([...messages, newMessage]); // Update messages state with new message
    setInput('');
  };

  return (
    <div className="App">
      <h1>Chat Messenger</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.sender}: </strong>
            {message.message}
          </div>
        ))}
      </div>
      <div>
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
