import React from 'react'
import axios from '../../apicalls/axios';
import './style.scss'
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import ManageAccountNav from '../../layouts/ManageAccountNav';
import Avatar from '../../assets/images/review-1_icon.png';



const NotificationList = () => {
    return (
        <>
            <Header />
            <div className="notification-list-body">
                <div className="container">
                    <h3>Manage Account</h3>
                    <div className="box">
                        <div className="col-left"><ManageAccountNav /></div>
                        <div className="col-right">
                            <div className="notification-list-container">
                                <h5>NOTIFICATIONS</h5>
                                <div className='view-options-btn-container'>
                                    <div className="all-btn">ALL</div>
                                    <div className="unread-btn">UNREAD</div>
                                </div>
                                <hr />
                                <ul>
                                    <li>
                                        <div className="user-avatar">
                                            <img src={Avatar} alt="" />
                                        </div>
                                        <div className='notification-info'>
                                            <div>James Howdy wishlisted your product JBL Quantum 400 USB Gaming Headset</div>
                                            <div className="date">10/27/2022 17:07</div>
                                        </div>
                                        <div className="circle-container">
                                            <div className="circle"></div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}


export default NotificationList;