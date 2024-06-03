import React, { useEffect, useState } from 'react'
import axios from '../../apicalls/axios';
import useAuthentication from '../../hooks/authHook'
import './style.scss'
import { ReactComponent as MessageIcon } from '../../assets/images/message-regular.svg';
import io from 'socket.io-client';



const ChatMessageIcon = ({ className, counterStyle}) => {

    const [allChats, setAllChats] = useState([]);
    const { user } = useAuthentication();


    useEffect(() => {
        // Connect to WebSocket server
        const socket = io(process.env.REACT_APP_BASE_URL);

        // Fetch all user chats initially
        fetchAllUserChats();

        // Listen for changes from WebSocket server
        socket.on('updateChats', () => {
            fetchAllUserChats(); // Fetch updated chats
        });

        return () => {
            socket.disconnect(); // Disconnect from WebSocket server on unmount
        };
    }, []);

    // Function to fetch all user chats
    const fetchAllUserChats = async () => {
        try {
            const response = await axios.get('/api/get-all/user-chat');
            setAllChats(response.data);
        } catch (error) {
            console.error('Error fetching all chats:', error);
        }
    };

    const unreadChat = allChats
        .filter(chat =>
            chat?.chat?.messages.some(
                message =>
                    message.receiver_id === user?.id && // Check if the message is received by the user
                    !message.read // Check if the message is not read
            )
        )
        .map(chat => chat.chat_id);


    return (
        <div className='message-notif'>
            <div className={`message-icon ${className}`}>
                <MessageIcon />
            </div>
            {unreadChat.length > 0 && (
                <div className={`unread-chat-counter ${counterStyle}`}>
                    {unreadChat.length}
                </div>
            )}
        </div>
    )
}

export default ChatMessageIcon;
