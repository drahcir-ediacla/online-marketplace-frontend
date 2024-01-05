import React from 'react'
import './style.scss'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import BtnGreen from '../../components/Button/BtnGreen'
import FilterBy from '../../components/Button/FilterBy'
import Input from '../../components/FormField/Input'
import UserChatImage from '../../assets/images/review-1_icon.png';
import ItemThumbnail from '../../assets/images/cap-5.jpg'
import { ReactComponent as ThreeDots } from '../../assets/images/three-dots.svg'

function Home() {

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
                                <span className="chat-sent-message-box">
                                    Hi, I’m Interested
                                </span>
                                <span className="chat-sent-message-box">
                                    Are there pictures from other angles?
                                </span>
                            </div>
                            <div className="date-messages">
                                <span>22/05 9:45 AM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
