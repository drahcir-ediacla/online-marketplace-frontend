import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client'
import axios from '../../apicalls/axios';
import useAuthentication from '../../hooks/authHook'
import { NavLink, Link } from 'react-router-dom'
import './style.scss'
import Header from '../../layouts/Header'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import BtnGreen from '../../components/Button/BtnGreen'
import FilterBy from '../../components/Button/FilterBy'
import Input from '../../components/FormField/Input'
import { ReactComponent as ThreeDots } from '../../assets/images/three-dots.svg'
import { ReactComponent as UploadImgIcon } from '../../assets/images/upload-img-icon.svg'
import { ReactComponent as SmileyIcon } from '../../assets/images/smiley-icon.svg'
import { ReactComponent as SendIcon } from '../../assets/images/send-icon.svg'
import { ReactComponent as ImageLoadingSpinner } from "../../assets/images/loading-spinner.svg";
import { ReactComponent as MagnifyingGlass } from '../../assets/images/magnifying-glass.svg';
import AvatarIcon from '../../assets/images/profile-avatar.png'
import NoImage from '../../assets/images/no-item-image-chat.png'
import BtnClear from '../../components/Button/BtnClear';
import MarkSoldModal from '../../components/Modal/MarkSoldModal'
import ReviewModal from '../../components/Modal/ReviewModal'



const ChatMessages = () => {

    const { chat_id } = useParams();
    const socketRef = useRef(null);
    const { user } = useAuthentication();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [soldModalOpen, setSoldModalOpen] = useState(false);
    const [sendOffer, setSendOffer] = useState(false);
    const [showEmotePicker, setShowEmotePicker] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false)
    const [lastImageMessageIndex, setLastImageMessageIndex] = useState(null);
    const [chatInfo, setChatInfo] = useState(null);
    const [allChats, setAllChats] = useState([]);
    console.log('allChats:', allChats)
    const [productInfo, setProductInfo] = useState(null);
    const [receiverInfo, setReceiverInfo] = useState(null); // State to store receiver information
    const sender_id = user?.id;
    const authUserDisplayName = user?.display_name;
    const profileImg = user?.profile_pic;
    console.log('profileImg:', profileImg)
    const product_id = chatInfo?.product_id;
    const offer = chatInfo?.offers?.[0]?.offer_price;
    const offerCurrentStatus = chatInfo?.offers?.[0]?.offer_status;
    const existingReview = chatInfo?.review;
    const [priceOffer, setPriceOffer] = useState('');
    const productStatus = productInfo?.status
    const sellerId = productInfo?.seller?.id
    const [receiver_id, setReceiverId] = useState(null); // State to store receiver_id
    const isImage = (url) => /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(url);


    const isOfferPrice = (content) => {
        const offerPricePattern = /Offered Price/;
        return offerPricePattern.test(content);
    };

    const isCancelledOffer = (content) => {
        const cancelledOfferPattern = /Offer Cancelled/;
        return cancelledOfferPattern.test(content);
    };

    const isAcceptedOffer = (content) => {
        const acceptedOfferPattern = /Offer Accepted/;
        return acceptedOfferPattern.test(content);
    };

    const isDeclinedOffer = (content) => {
        const declinedOfferPattern = /Offer Declined/;
        return declinedOfferPattern.test(content);
    };

    const [searchTerm, setSearchTerm] = useState('')
    const [filteredChat, setFilteredChat] = useState(allChats)

    const emojiPickerRef = useRef(null);
    const scrollRef = useRef(null);

    const [isMakeOfferBtn, setIsMakeOfferBtn] = useState(true);
    const [isChangeOfferBtn, setIsChangeOfferBtn] = useState(true);

    const toggleMakeOfferBtn = () => {
        setIsMakeOfferBtn(!isMakeOfferBtn);
    };


    const toggleChangeOfferBtn = () => {
        setIsChangeOfferBtn(!isChangeOfferBtn);
    };


    const toggleSoldModal = () => {
        setSoldModalOpen((prevSoldModalOpen) => !prevSoldModalOpen);
    };

    const toggleReviewModal = () => {
        setReviewModalOpen((prevReviewModalOpen) => !prevReviewModalOpen);
    };


    const handleKeyPress = (e) => {
        // Check if the pressed key is Enter
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    //This code will execute handleOfferOptions whenever offerStatus changes.
    // useEffect(() => {
    //     if (offerStatus) {
    //       handleOfferOptions();
    //     }
    //   }, [offerStatus]);


    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]); // Add other dependencies as needed


    useEffect(() => {
        // Update last image message index whenever messages change
        if (messages && messages.length > 0) {
            const lastIndex = messages.findIndex(message => isImage(message.content));
            setLastImageMessageIndex(lastIndex);
        }
    }, [messages]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmotePicker(false);
            }
        };

        // Attach the event listener to the document body
        document.body.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener when the component is unmounted
        return () => {
            document.body.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);



    const limitCharacters = (text, maxLength) => {
        return text?.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };


    // Function to format price with commas and decimals
    const formatPrice = (price) => {
        const numericValue = parseFloat(price);

        if (!isNaN(numericValue)) {
            const formattedPrice = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'PHP', // Change to your desired currency code
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(numericValue);

            return formattedPrice.replace(/\.00$/, ''); // Remove '.00' if the fractional part is zero
        } else if (typeof price === 'string' && isOfferPrice(price)) {
            // Extract the numeric value from the HTML string and format it
            const extractedValue = parseFloat(price.replace(/<.*?>/g, '').replace(/[^0-9.]/g, ''));
            return formatPrice(extractedValue);
        }

        return price;
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
            setFilteredChat(prevChats => prevChats.map(chat => {
                if (chat.chat_id === data.chat_id) {
                    return {
                        ...chat,
                        chat: {
                            ...chat.chat,
                            messages: [...chat.chat.messages, data]
                        }
                    };
                }
                return chat;
            }));
        }); 

        return () => {
            // Disconnect the socket when the component unmounts
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [chat_id,messages]); // Dependencies updated to include chat_id


    useEffect(() => {
        fetchAllUserChat();
    }, [])


    const fetchAllUserChat = async () => {
        try {
            const response = await axios.get('/api/get-all/user-chat');

            setAllChats(response.data);
            setFilteredChat(response.data);

        } catch (error) {
            console.error('Error fetching all chats:', error);
        }
    };


    useEffect(() => {
        const fetchChatById = async () => {
            try {
                const response = await axios.get(`/api/get/chat/${chat_id}/${sender_id}`);
                setChatInfo(response.data); // Update receiverInfo state with fetched data
            } catch (error) {
                console.error('Error fetching chat information:', error);
            }
        };

        if (chat_id) {
            fetchChatById(); // Fetch receiver information only if receiver_id is available
        }
    }, [chat_id, sendOffer, user?.id]);



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



    const handleChatImageClick = () => {
        document.getElementById('imageInput').click();
    };


    const handleImageUpload = async (e) => {
        console.log('handleImageUpload triggered');
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        try {
            setShowSpinner(true)
            if (file) {
                const formData = new FormData();
                formData.append('image', file);

                // Upload the image using Axios
                const response = await axios.post('/api/upload-chat-image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 200) {
                    // Handle the uploaded image URL from the response
                    const imageUrl = response.data.imageUrl;
                    console.log('imageUrl:', imageUrl)

                    socketRef.current.emit('send_message', {
                        chat_id,
                        sender_id,
                        receiver_id,
                        product_id,
                        content: imageUrl,
                    });

                    // Send the message to the server using Axios
                    await axios.post('/api/send/messages', {
                        chat_id,
                        sender_id,
                        receiver_id,
                        product_id,
                        content: imageUrl,
                    });
                    setShowSpinner(false);
                }
            }
        } catch (error) {
            setShowSpinner(false)
            console.error('Error uploading image:', error);
        }
    };


    const sendMessage = async () => {
        setSendOffer(true);
        if ((input.trim()) !== '') {
            socketRef.current.emit('send_message', {
                chat_id,
                sender_id,
                receiver_id,
                product_id,
                content: input,
            });

            try {
                // Send the message to the server using Axios
                await axios.post('/api/send/messages', {
                    chat_id,
                    sender_id,
                    receiver_id,
                    product_id,
                    content: input,
                });

                // Clear the input field after sending the message
                setInput('');
                setPriceOffer('');
                // fetchAllUserChat();

            } catch (error) {
                // Handle error
                console.error("Error sending message:", error);
            }
        }
    };


    const handleOfferOptions = async (offerStatus) => {
        const offerPriceToSend = priceOffer.trim() !== '' ? priceOffer : offer;
        console.log('offerPriceToSend:', offerPriceToSend)
        // const offerStatus = pendingStatus || cancelStatus;
        // console.log('offerStatus:', offerStatus)


        let messageContent;
        if (offerStatus === 'Pending') {
            messageContent = `<h6 style="color: #035956; font-weight: 500;">Offered Price</h6><span style="font-weight: 600;">${formatPrice(priceOffer)}</span>`;
        } else {
            if (offerStatus === 'Cancelled') {
                messageContent = `<h6 style="color: red; font-weight: 500;">Offer Cancelled</h6><span style="font-weight: 600;">${formatPrice(offer)}</span>`;
            }
            else if (offerStatus === 'Accepted') {
                messageContent = `<h6 style="color: green; font-weight: 500;">Offer Accepted</h6><span style="font-weight: 600;">${formatPrice(offer)}</span>`;
            }
            else if (offerStatus === 'Declined') {
                messageContent = `<h6 style="color: red; font-weight: 500;">Offer Declined</h6><span style="font-weight: 600;">${formatPrice(offer)}</span>`;
            }
        }

        socketRef.current.emit('send_message', {
            chat_id,
            sender_id,
            receiver_id,
            product_id,
            content: messageContent,
        });

        try {
            // Send the message to the server using Axios
            const response = await axios.post('/api/send-offer/messages', {
                chat_id,
                sender_id,
                receiver_id,
                product_id,
                content: priceOffer || formatPrice(offer),
                offer_price: offerPriceToSend,
                offer_status: offerStatus,
            });

            setSendOffer(false);

            // Clear the input field after sending the message
            if (response.status === 201) {

                setPriceOffer('');
                setSendOffer(true);
            }

        } catch (error) {
            // Handle error
            console.error("Error sending message:", error);
        }
    };




    const handleEmoteSelect = (emoji) => {
        // Append the selected emoji to the message input
        setInput(input + emoji.native);
        setShowEmotePicker(false);
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
        if (messages && messages.length > 0) {
            // Create a new array and sort it by timestamp in descending order
            const sortedMessages = [...messages].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            return sortedMessages[0].content;
        } else {
            return '';
        }
    };



    const getLastMessageTime = (messages) => {
        return messages && messages.length > 0 ? messages[0].timestamp : '';
    };


    const handleSearchChange = (e) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);

        if (searchTerm === '') {
            setFilteredChat(allChats);
            return;
        }

        const filtered = allChats.filter(chat => {
            const productNameMatch = chat?.chat?.product && chat.chat.product.product_name.toLowerCase().includes(searchTerm.toLowerCase());
            const sellerDisplayNameMatch = chat?.otherParticipant && chat?.otherParticipant?.display_name.toLowerCase().includes(searchTerm.toLowerCase());

            // Check if either product name or seller's display name matches the search term
            return productNameMatch || sellerDisplayNameMatch;

        });

        setFilteredChat(filtered);
    }


    const markMessageAsRead = async (chatId) => {
        try {
            await axios.put(`/api/read-message/${chatId}`, { read: true });

            setAllChats(filteredChat.map(chat =>
                chat.chat_id === chatId ? { ...filteredChat, read: true } : filteredChat
            ));
            fetchAllUserChat();
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    }


    return (
        <>
            {soldModalOpen && <MarkSoldModal onClick={toggleSoldModal} productId={product_id} productName={productInfo?.product_name} userId={user?.id} />}
            {reviewModalOpen && <ReviewModal onClick={toggleReviewModal} chatId={chat_id} productId={product_id} sellerId={sellerId} targetId={receiver_id} userId={user?.id} displayName={authUserDisplayName} profileImg={profileImg} />}
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
                                <Input
                                    className='chat-search-box'
                                    placeholder='Search user name or item name...'
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <div className='magnifying-glass'><MagnifyingGlass /></div>
                            </div>
                        </div>
                        <div className='user-chat-list-container'>
                            {Array.isArray(filteredChat) && filteredChat.length > 0 ? (
                                filteredChat.map((chat, index) => {
                                    const isActive = chat?.chat_id === chat_id;
                                    return (
                                        <NavLink to={`/messages/${chat?.chat_id}`} className='user-chat-list' key={index} >
                                            <div className={`select-user-conversation ${isActive ? "active" : ""}`} onClick={() => markMessageAsRead(chat.chat_id)}>
                                                <div className='user-chat-info-container'>
                                                    <img src={chat?.otherParticipant?.profile_pic || AvatarIcon} alt="User Chat" />
                                                    <div className='chat-user-name-messages'>
                                                        <span className='chat-user-name'>
                                                            {chat?.otherParticipant?.display_name || 'Unknown'}
                                                        </span>
                                                        <span className='chat-product-name'>
                                                            {!chat?.chat?.product?.product_name ? 'The item has been removed' : (limitCharacters(chat?.chat?.product?.product_name, 25))}
                                                        </span>
                                                        <span className='chat-user-messages'>
                                                            <span dangerouslySetInnerHTML={{ __html: getLastMessageContent(chat?.chat?.messages) }} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='chat-time-container'>
                                                    <small className='last-message-time'>{formatTime(getLastMessageTime(chat?.chat?.messages))}</small>
                                                    {chat?.chat?.messages.some(message => message.receiver_id === user?.id && !message.read) && (
                                                        <div className="circle-container">
                                                            <div className="circle"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </NavLink>
                                    );
                                })
                            ) : (
                                <div className='no-chat-messages'>
                                    <p>No Chats Available...</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="chat-right">
                        {!chat_id ? (
                            null
                        ) : (
                            <>
                                <div className='chat-right-row1'>
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
                                        <Link
                                            to={`/productdetails/${productInfo?.id}/${encodeURIComponent(productInfo?.product_name)}`}
                                            className='chat-selling-item-img-box'
                                            target="_blank"
                                            rel="noopener noreferrer" // Add these lines for security best practices
                                        >
                                            {productStatus === 'Sold' && (
                                                <div className='sold-ribbon-label'>
                                                    <span>SOLD</span>
                                                </div>
                                            )}
                                            <img src={productInfo?.images && productInfo.images.length > 0 ? productInfo.images[0].image_url : (NoImage)} alt="" />
                                        </Link>
                                        <div className='chat-item-info'>
                                            <Link
                                                to={`/productdetails/${productInfo?.id}/${encodeURIComponent(productInfo?.product_name)}`}
                                                className='chat-item-name'
                                                target="_blank"
                                                rel="noopener noreferrer" // Add these lines for security best practices
                                            >
                                                {!productInfo?.product_name ? 'The item has been removed' : productInfo?.product_name}
                                            </Link>
                                            <span className='chat-item-price'>{formatPrice(productInfo?.price || '')}</span>
                                        </div>
                                    </div>

                                    {!productInfo ?
                                        (
                                            null
                                        ) :
                                        (
                                            offerCurrentStatus === 'Pending' || offerCurrentStatus === 'Accepted' ?
                                                (
                                                    sellerId === sender_id ?
                                                        (
                                                            productStatus === 'Sold' ?
                                                                (
                                                                    <div className='offer-buttons'>
                                                                        <BtnClear className='item-sold-btn' label='Item Sold' disabled />
                                                                    </div>
                                                                ) :
                                                                (
                                                                    offerCurrentStatus === 'Pending' ?
                                                                        (
                                                                            <div className='offer-buttons'>
                                                                                <BtnGreen label='Accept Offer' onClick={() => { handleOfferOptions('Accepted'); }} />
                                                                                <BtnClear label='Decline Offer' onClick={() => { setSendOffer(false); handleOfferOptions('Declined'); }} />
                                                                                <BtnClear label='Mark as Sold' onClick={toggleSoldModal} />
                                                                            </div>
                                                                        ) :
                                                                        (
                                                                            <div className='offer-buttons'>
                                                                                {existingReview && existingReview.length === 0 ? (
                                                                                    <BtnGreen className='change-offer-btn' label='Leave Review' onClick={toggleReviewModal} />
                                                                                ) : (
                                                                                    <>
                                                                                        <span>Review Submitted &nbsp;&nbsp;</span>
                                                                                    </>
                                                                                )}
                                                                                <BtnClear label='Mark as Sold' onClick={toggleSoldModal} />
                                                                            </div>
                                                                        )
                                                                )
                                                        ) :
                                                        (
                                                            <div className='offer-buttons'>
                                                                {isChangeOfferBtn ?
                                                                    (
                                                                        productStatus === 'Sold' ?
                                                                            (
                                                                                <div className='offer-buttons'>
                                                                                    <BtnClear className='item-sold-btn' label='Item Sold' disabled />
                                                                                </div>
                                                                            ) :
                                                                            (
                                                                                offerCurrentStatus === 'Pending' ? (
                                                                                    <>
                                                                                        <BtnGreen className='change-offer-btn' label='Change Offer' onClick={toggleChangeOfferBtn} />
                                                                                        <BtnClear label='Cancel Offer' onClick={() => { setSendOffer(false); handleOfferOptions('Cancelled'); }} />
                                                                                    </>
                                                                                ) : (
                                                                                    existingReview && existingReview.length === 0 ? (
                                                                                        <BtnGreen className='change-offer-btn' label='Leave Review' onClick={toggleReviewModal} />
                                                                                    ) : (
                                                                                        <>
                                                                                            <span>Review Submitted</span>
                                                                                        </>
                                                                                    )
                                                                                )
                                                                            )
                                                                    ) :
                                                                    (
                                                                        <>
                                                                            <div className='input-offer-container'>
                                                                                <span className='php-symbol'>₱</span>
                                                                                <Input
                                                                                    type='number'
                                                                                    value={priceOffer || '0.00'}
                                                                                    className='input-offer'
                                                                                    onChange={(e) => { setPriceOffer(e.target.value); setSendOffer(false); }}
                                                                                />
                                                                            </div>
                                                                            <BtnGreen label='Send Offer' onClick={() => { handleOfferOptions('Pending'); toggleChangeOfferBtn(); }} disabled={!priceOffer?.trim()} />
                                                                            <BtnClear label='Cancel' onClick={toggleChangeOfferBtn} />
                                                                        </>
                                                                    )
                                                                }
                                                            </div>
                                                        )
                                                ) :
                                                (
                                                    sellerId === sender_id ?
                                                        (
                                                            productStatus === 'Sold' ?
                                                                (
                                                                    <div className='offer-buttons'>
                                                                        <BtnClear className='item-sold-btn' label='Item Sold' disabled />
                                                                    </div>
                                                                ) :
                                                                (
                                                                    <div className='offer-buttons'>
                                                                        <BtnClear label='Mark as Sold' onClick={toggleSoldModal} />
                                                                    </div>
                                                                )
                                                        ) :
                                                        (
                                                            productStatus === 'Sold' ?
                                                                (
                                                                    <div className='offer-buttons'>
                                                                        <BtnClear className='item-sold-btn' label='Item Sold' disabled />
                                                                    </div>
                                                                ) :
                                                                (
                                                                    <div className='offer-buttons'>
                                                                        {isMakeOfferBtn ?
                                                                            (
                                                                                <BtnGreen label='Make Offer' onClick={toggleMakeOfferBtn} />
                                                                            ) :
                                                                            (
                                                                                <>
                                                                                    <div className='input-offer-container'>
                                                                                        <span className='php-symbol'>₱</span>
                                                                                        <Input
                                                                                            type='number'
                                                                                            value={priceOffer || '0.00'}
                                                                                            className='input-offer'
                                                                                            onChange={(e) => setPriceOffer(e.target.value)}
                                                                                        />
                                                                                    </div>
                                                                                    <BtnGreen label='Send Offer' onClick={() => { handleOfferOptions('Pending'); }} disabled={!priceOffer?.trim()} />
                                                                                    <BtnClear label='Cancel' onClick={toggleMakeOfferBtn} />
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                )
                                                        )
                                                )
                                        )}
                                </div>
                            </>
                        )}
                        <div className="chat-right-row3" ref={scrollRef}>
                            {!chat_id ? (
                                <>
                                    <div className='no-chat-selected'>
                                        No Chat Selected
                                    </div>
                                </>
                            ) : (
                                <>
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
                                                        <div className='chat-sent-message-data'>
                                                            {isImage(message.content) && (
                                                                <div>
                                                                    <img src={message.content} className='chat-uploaded-image' alt="" />
                                                                </div>
                                                            )}

                                                            {!isImage(message.content) && (
                                                                <div className="chat-sent-message-box">
                                                                    {isOfferPrice(message.content) ? (
                                                                        <>
                                                                            <div className='offered-price-label'><h6>Offered Price</h6></div>
                                                                            <span dangerouslySetInnerHTML={{ __html: formatPrice(message.content) }} />
                                                                        </>
                                                                    ) : isCancelledOffer(message.content) ? (
                                                                        <span dangerouslySetInnerHTML={{ __html: message.content }} />
                                                                    ) : isAcceptedOffer(message.content) ? (
                                                                        <span dangerouslySetInnerHTML={{ __html: message.content }} />
                                                                    ) : isDeclinedOffer(message.content) ? (
                                                                        <span dangerouslySetInnerHTML={{ __html: message.content }} />
                                                                    ) : (
                                                                        <span className='normal-chat-text'>{message.content}</span>
                                                                    )}
                                                                </div>
                                                            )}

                                                            <img src={user?.profile_pic || AvatarIcon} alt="" />
                                                        </div>
                                                        <small className='chat-time-sent-message'>{formattedTime}</small>
                                                        {index === messages.length - 1 && showSpinner && (
                                                            <div className='loading-spinner-container'>
                                                                <ImageLoadingSpinner />
                                                            </div>
                                                        )}
                                                        {messages.length === 0 && showSpinner && (
                                                            <ImageLoadingSpinner />
                                                        )}
                                                    </div>

                                                </div>
                                            </div>
                                        ) : (
                                            <div className="chat-received-messages" key={index}>
                                                <div className='chat-received-message-info-container'>
                                                    <div className='row1'>
                                                        <div className='chat-received-message-data'>
                                                            <img src={receiverInfo?.profile_pic || AvatarIcon} alt="" />
                                                            {isImage(message.content) && (
                                                                <img src={message.content} className='chat-uploaded-image' alt="" />
                                                            )}
                                                            {!isImage(message.content) && (
                                                                <div className="chat-received-message-box">
                                                                    {isOfferPrice(message.content) ? (
                                                                        <>
                                                                            <div className='offered-price-label'><h6>Offered Price</h6></div>
                                                                            <span dangerouslySetInnerHTML={{ __html: formatPrice(message.content) }} />
                                                                        </>
                                                                    ) : isCancelledOffer(message.content) ? (
                                                                        <span dangerouslySetInnerHTML={{ __html: message.content }} />
                                                                    ) : isAcceptedOffer(message.content) ? (
                                                                        <span dangerouslySetInnerHTML={{ __html: message.content }} />
                                                                    ) : isDeclinedOffer(message.content) ? (
                                                                        <span dangerouslySetInnerHTML={{ __html: message.content }} />
                                                                    ) : (
                                                                        <span className='normal-chat-text'>{message.content}</span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <small className='chat-time-received-message'>{formattedTime}</small>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                        {!chat_id ? (
                            null
                        ) : (
                            <>
                                <div className="chat-right-row4">
                                    <div className='chat-icon-buttons'>
                                        <label htmlFor="imageInput">
                                            <div className='chat-upload-img-btn' onClick={() => handleChatImageClick} >
                                                <UploadImgIcon />
                                            </div>
                                        </label>
                                        <input
                                            id="imageInput"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                        />
                                        <div onClick={() => setShowEmotePicker(!showEmotePicker)} ref={emojiPickerRef} className='chat-emote-btn'>
                                            <SmileyIcon />
                                            {showEmotePicker &&
                                                <div className='emoji-picker'>
                                                    <Picker data={data} emojiSize={20} emojiButtonSize={28} maxFrequentRows={2} onEmojiSelect={handleEmoteSelect} />
                                                </div>
                                            }
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
                                    <button onClick={sendMessage} disabled={!input.trim()} className='chat-send-icon-btn'>
                                        <div className='chat-send-icon'>
                                            <SendIcon />
                                        </div>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatMessages
