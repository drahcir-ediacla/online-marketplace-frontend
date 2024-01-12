import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client'
import axios from '../../apicalls/axios';
import useAuthentication from '../../hooks/authHook'
import './style.scss'
import Header from '../../layouts/Header'
import BtnGreen from '../../components/Button/BtnGreen'
import FilterBy from '../../components/Button/FilterBy'
import Input from '../../components/FormField/Input'
import UserChatImage from '../../assets/images/review-1_icon.png';
import ItemThumbnail from '../../assets/images/cap-5.jpg'
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
    const [productInfo, setProductInfo] = useState(null);
    const [receiverInfo, setReceiverInfo] = useState(null); // State to store receiver information
    const sender_id = user?.id.toString();
    const product_id = chatInfo?.product_id.toString();
    const [receiver_id, setReceiverId] = useState(null); // State to store receiver_id

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
                        <div className="chat-left-row2">
                            <div className="select-user-conversation">
                                <div className='user-chat-info-container'>
                                    <img src={UserChatImage} alt="" />
                                    <div className='chat-user-name-messages'>
                                        <span className='chat-user-name'>Asi Paolo</span>
                                        <span className='chat-user-messages'>Yes!! I received the product, Thanks </span>
                                    </div>
                                </div>
                                <small className='last-message-time'>5:31 PM</small>
                            </div>
                        </div>
                        <div className="chat-left-row2 green-bkgrnd">
                            <div className="select-user-conversation">
                                <div className='user-chat-info-container'>
                                    <img src={UserChatImage} alt="" />
                                    <div className='chat-user-name-messages'>
                                        <span className='chat-user-name'>Asi Paolo</span>
                                        <span className='chat-user-messages'>Yes!! I received the product, Thanks</span>
                                    </div>
                                </div>
                                <small className='last-message-time'>5:31 PM</small>
                            </div>
                        </div>
                        <div className="chat-left-row2">
                            <div className="select-user-conversation">
                                <div className='user-chat-info-container'>
                                    <img src={UserChatImage} alt="" />
                                    <div className='chat-user-name-messages'>
                                        <span className='chat-user-name'>Asi Paolo</span>
                                        <span className='chat-user-messages'>Yes!! I received the product, Thanks</span>
                                    </div>
                                </div>
                                <small className='last-message-time'>5:31 PM</small>
                            </div>
                        </div>
                        <div className="chat-left-row2">
                            <div className="select-user-conversation">
                                <div className='user-chat-info-container'>
                                    <img src={UserChatImage} alt="" />
                                    <div className='chat-user-name-messages'>
                                        <span className='chat-user-name'>Asi Paolo</span>
                                        <span className='chat-user-messages'>Yes!! I received the product, Thanks</span>
                                    </div>
                                </div>
                                <small className='last-message-time'>5:31 PM</small>
                            </div>
                        </div>
                    </div>
                    <div className="chat-right">
                        <div className="chat-right-row1">
                            <div className='user-chat-info-container'>
                                <img src={receiverInfo?.profile_pic || AvatarIcon} alt="" />
                                <div className='chat-user-name-messages'>
                                    <span className='chat-user-name'>{receiverInfo?.display_name}</span>
                                    <span className='chat-user-status'>Online</span>
                                </div>
                            </div>
                            <div className='three-dots-chat'>
                                <ThreeDots />
                            </div>
                        </div>
                        <div className="chat-right-row2">
                            <div className='selling-item-container'>
                                <img src={productInfo?.images && productInfo.images.length > 0 ? productInfo.images[0].image_url : 'default_image_url_or_placeholder'} alt="" />
                                <div className='chat-item-info'>
                                    <span className='chat-item-name'>{productInfo?.product_name}</span>
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
