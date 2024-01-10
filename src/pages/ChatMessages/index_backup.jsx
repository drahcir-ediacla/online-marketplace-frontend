import React, { useState, useEffect } from 'react';
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



const ChatMessages = () => {

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
                                <img src={UserChatImage} alt="" />
                                <div className='chat-user-name-messages'>
                                    <span className='chat-user-name'>Asi Paolo</span>
                                    <span className='chat-user-status'>Online</span>
                                </div>
                            </div>
                            <div className='three-dots-chat'>
                                <ThreeDots />
                            </div>
                        </div>
                        <div className="chat-right-row2">
                            <div className='selling-item-container'>
                                <img src={ItemThumbnail} alt="" />
                                <div className='chat-item-info'>
                                    <span className='chat-item-name'>Plain Black Cap</span>
                                    <span className='chat-item-price'>$200</span>
                                </div>
                            </div>
                            <div className='three-dots-chat'>
                                <BtnGreen label='Make Offer' />
                            </div>
                        </div>
                        <div className="chat-right-row3">
                            <div className="chat-sent-messages">
                                <div className='chat-sent-message-info-container'>
                                    <div className='row1'>
                                        <div className="chat-sent-message-box">
                                            <span>Hi, I’m Interested</span>
                                        </div>
                                        <img src={UserChatImage} alt="" />
                                    </div>

                                    <small className='chat-time-sent-message'>9:45 AM</small>
                                </div>

                                <div className='chat-sent-message-info-container'>
                                    <div className='row1'>
                                        <div className="chat-sent-message-box">
                                            <span>Are there pictures from other angles? Are there pictures from other angles? Are there pictures from other angles? Are there pictures from other angles?</span>
                                        </div>
                                        <img src={UserChatImage} alt="" />
                                    </div>

                                    <small className='chat-time-sent-message'>9:45 AM</small>
                                </div>
                            </div>
                            <div className="date-messages">
                                <span>22/05 9:45 AM</span>
                            </div>
                            <div className="chat-received-messages">
                                <div className='chat-received-message-info-container'>
                                    <div className='row1'>
                                        <img src={UserChatImage} alt="" />
                                        <div className="chat-received-message-box">
                                            <span>Hi, I’m Interested</span>
                                        </div>
                                    </div>
                                    <small className='chat-time-received-message'>9:45 AM</small>
                                </div>

                                <div className='chat-received-message-info-container'>
                                    <div className='row1'>
                                        <img src={UserChatImage} alt="" />
                                        <div className="chat-received-message-box">
                                            <span>Are there pictures from other angles? Are there pictures from other angles? Are there pictures from other angles? Are there pictures from other angles?</span>
                                        </div>
                                    </div>
                                    <small className='chat-time-received-message'>9:45 AM</small>
                                </div>
                            </div>
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
                            <Input className='chat-input-message-box' placeholder='Type your message' />
                            <button className='chat-send-icon-btn'>
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
