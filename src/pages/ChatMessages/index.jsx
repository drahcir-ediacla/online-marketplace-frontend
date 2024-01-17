import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client'
import axios from '../../apicalls/axios';
import useAuthentication from '../../hooks/authHook'
import { NavLink, Link } from 'react-router-dom'
import './style.scss'
import Header from '../../layouts/Header'
import BtnGreen from '../../components/Button/BtnGreen'
import FilterBy from '../../components/Button/FilterBy'
import Input from '../../components/FormField/Input'
import UserChatImage from '../../assets/images/review-1_icon.png';
import { ReactComponent as ThreeDots } from '../../assets/images/three-dots.svg'
import { ReactComponent as UploadImgIcon } from '../../assets/images/upload-img-icon.svg'
import { ReactComponent as SmileyIcon } from '../../assets/images/smiley-icon.svg'
import { ReactComponent as SendIcon } from '../../assets/images/send-icon.svg'
import AvatarIcon from '../../assets/images/profile-avatar.png'



const ChatMessages = () => {

    const { chat_id } = useParams();
    const socketRef = useRef(null);
    const { user } = useAuthentication();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [chatInfo, setChatInfo] = useState(null);
    const [allChats, setAllChats] = useState([]);
    const [productInfo, setProductInfo] = useState(null);
    const [receiverInfo, setReceiverInfo] = useState(null); // State to store receiver information
    const [messengerState, setMessengerState] = useState({}); // State to store messenger for each chat
    const sender_id = user?.id;
    const product_id = chatInfo?.product_id;
    const [receiver_id, setReceiverId] = useState(null); // State to store receiver_id
    console.log('receiverInfo:', receiverInfo)





    const scrollRef = useRef(null);


    const handleKeyPress = (e) => {
        // Check if the pressed key is Enter
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]); // Add other dependencies as needed

    const limitCharacters = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };


    // Function to format price with commas and decimals
    const formatPrice = (price) => {
        const formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'PHP', // Change to your desired currency code
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);

        return formattedPrice.replace(/\.00$/, ''); // Remove '.00' if the fractional part is zero
    };

    useEffect(() => {
        // Connect to the WebSocket server
        socketRef.current = io(process.env.REACT_APP_BASE_URL);

        // Join the chat room based on chat_id when component mounts
        socketRef.current.emit('joinChat', chat_id);

        // Listen for the 'receive_message' event
        socketRef.current.on('receive_message', (data) => {
            // Ensure that the message is from the specific chat room by checking chat_id
            if (data.chat_id === chat_id) {
                const isMessageExists = messages.some(msg => msg.id === data.id);
                if (!isMessageExists) {
                    data.timestamp = new Date().toISOString();
                    setMessages(prevMessages => [...prevMessages, data]);
                }
            }
        });

        return () => {
            // Disconnect the socket when the component unmounts
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [chat_id]); // Dependencies updated to include chat_id





    useEffect(() => {
        const fetchAllUserChat = async () => {
            try {
                const response = await axios.get('/api/get-all/user-chat');

                setAllChats(response.data);
            } catch (error) {
                console.error('Error fetching all chats:', error);
            }
        };



        fetchAllUserChat();
    }, []); // Include sender_id in dependency array if it can change




    useEffect(() => {
        const fetchChatById = async () => {
            try {
                const response = await axios.get(`/api/get/chat/${chat_id}`);
                setChatInfo(response.data); // Update receiverInfo state with fetched data
            } catch (error) {
                console.error('Error fetching chat information:', error);
            }
        };

        if (chat_id) {
            fetchChatById(); // Fetch receiver information only if receiver_id is available
        }
    }, [chat_id]);



    useEffect(() => {
        const fetchProductInfo = async () => {
            try {
                const response = await axios.get(`/api/getproductbyid/${product_id}`);
                setProductInfo(response.data); // Update receiverInfo state with fetched data
            } catch (error) {
                console.error('Error fetching receiver information:', error);
            }
        };

        if (product_id) {
            fetchProductInfo(); // Fetch receiver information only if receiver_id is available
        }
    }, [product_id]);



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
        // Emit the send_message event with the message details
        socketRef.current.emit('send_message', {
            chat_id,
            sender_id,
            receiver_id,
            product_id,
            content: input
        });

        // Send the message to the server using Axios
        await axios.post('/api/send/messages', {
            chat_id,
            sender_id,
            receiver_id,
            product_id,
            content: input
        });

        // Clear the input field after sending the message
        setInput('');
    };


    // Function to format the timestamp to '0:00 PM' format
    function formatTime(timestamp) {
        // Check if timestamp is valid
        if (!timestamp) {
            return 'Invalid Timestamp';
        }

        // Parse the timestamp using Date constructor
        const date = new Date(timestamp);

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }

        // Extract hours, minutes, and AM/PM
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const period = hours >= 12 ? 'PM' : 'AM';

        // Convert hours to 12-hour format
        const formattedHours = hours % 12 || 12;

        return `${formattedHours}:${minutes} ${period}`;
    }



    const getLastMessageContent = (messages) => {
        return messages && messages.length > 0 ? messages[0].content : '';
    };

    const getLastMessageTime = (messages) => {
        return messages && messages.length > 0 ? messages[0].timestamp : '';
    };


    return (
        <>
            <Header />
            <div className="container">
                <div className="chat-container">
                    <div className="chat-left">
                        <div className="chat-left-row1">
                            <div className='chat-left-row1-header'>
                                <h3>Chat</h3>
                                <FilterBy label='Inbox' className='message-collections-btn' />
                            </div>
                            <div className='chat-search-box-container'>
                                <Input className='chat-search-box' placeholder='Search name..' />
                            </div>
                        </div>

                        {allChats.map((chat, index) => {
                            const isActive = chat?.chat_id === chat_id;
                            return (
                                <NavLink to={`/messages/${chat?.chat_id}`} className='user-chat-list' key={index}>
                                    <div className={`select-user-conversation ${isActive ? "active" : ""}`}>
                                        <div className='user-chat-info-container'>
                                            <img src={chat?.otherParticipant?.profile_pic || AvatarIcon} alt="User Chat" />
                                            <div className='chat-user-name-messages'>
                                                <span className='chat-user-name'>
                                                    {chat?.otherParticipant?.display_name || 'Unknown'}
                                                </span>
                                                <span className='chat-product-name'>
                                                    {limitCharacters(chat?.chat?.product?.product_name, 25) || 'Unknown'}
                                                </span>
                                                <span className='chat-user-messages'>
                                                    {getLastMessageContent(chat?.chat?.messages)}
                                                </span>
                                            </div>
                                        </div>
                                        <small className='last-message-time'>{formatTime(getLastMessageTime(chat?.chat?.messages))}</small>
                                    </div>
                                </NavLink>
                            )

                        })}
                    </div>
                    <div className="chat-right">
                        <div className="chat-right-row1">
                            <div className='user-chat-info-container'>
                                <Link to={`/profile/${receiverInfo?.id}`}>
                                    <img src={receiverInfo?.profile_pic || AvatarIcon} alt="" />
                                </Link>
                                <div className='chat-user-name-messages'>
                                    <Link to={`/profile/${receiverInfo?.id}`} className='chat-user-name'>
                                        {receiverInfo?.display_name}
                                    </Link>
                                    <span className='chat-user-status'>Online</span>
                                </div>
                            </div>
                            <div className='three-dots-chat'>
                                <ThreeDots />
                            </div>
                        </div>
                        <div className="chat-right-row2">
                            <div className='selling-item-container'>
                                <Link to={`/productdetails/${productInfo?.id}/${encodeURIComponent(productInfo?.product_name)}`} className='chat-item-name'>
                                    <img src={productInfo?.images && productInfo.images.length > 0 ? productInfo.images[0].image_url : 'default_image_url_or_placeholder'} alt="" />
                                </Link>
                                <div className='chat-item-info'>
                                    <Link to={`/productdetails/${productInfo?.id}/${encodeURIComponent(productInfo?.product_name)}`} className='chat-item-name'>
                                        {productInfo?.product_name}
                                    </Link>
                                    <span className='chat-item-price'>{formatPrice(productInfo?.price)}</span>
                                </div>
                            </div>

                            <div className='three-dots-chat'>
                                <BtnGreen label='Make Offer' />
                            </div>
                        </div>
                        <div className="chat-right-row3" ref={scrollRef}>
                            <div className="date-messages">
                                <span>22/05 9:45 AM</span>
                            </div>
                            {messages.map((message, index) => {
                                // Format the timestamp for each message
                                const formattedTime = formatTime(message.timestamp);

                                return message.sender_id === sender_id ? (
                                    <div className="chat-sent-messages" key={index}>
                                        <div className='chat-sent-message-info-container'>
                                            <div className='row1'>
                                                <div className="chat-sent-message-box">
                                                    {message.content}
                                                </div>
                                                <img src={user?.profile_pic || AvatarIcon} alt="" />
                                            </div>
                                            <small className='chat-time-sent-message'>{formattedTime}</small>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="chat-received-messages" key={index}>
                                        <div className='chat-received-message-info-container'>
                                            <div className='row1'>
                                                <img src={receiverInfo?.profile_pic || AvatarIcon} alt="" />
                                                <div className="chat-received-message-box">
                                                    {message.content}
                                                </div>
                                            </div>
                                            <small className='chat-time-received-message'>{formattedTime}</small>
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                        <div className="chat-right-row4">
                            <div className='chat-icon-buttons'>
                                <div className='chat-upload-img-btn'>
                                    <UploadImgIcon />
                                </div>
                                <div className='chat-emote-btn'>
                                    <SmileyIcon />
                                </div>
                            </div>
                            <Input
                                type="text"
                                className='chat-input-message-box'
                                placeholder='Type your message'
                                value={input}
                                onKeyDown={handleKeyPress}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button onClick={sendMessage} className='chat-send-icon-btn'>
                                <div className='chat-send-icon'>
                                    <SendIcon />
                                </div>
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatMessages
