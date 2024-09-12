import { useState } from 'react'
import './style.scss'
import useAuthentication from '../../../hooks/authHook'
import Header from '../../../layouts/Forum/Header'
import FilterNavigation from '../../../layouts/Forum/FilterNavigation'
import GTranslate from '../../../components/GTranslate';
import LoginModal from '../../../components/Modal/LoginModal';
import SearchDiscussionBox from '../../../components/SearchDiscussionBox'
import BtnReply from '../../../components/Button/BtnReply';
import { ReactComponent as Like } from '../../../assets/images/like-icon.svg'
import { ReactComponent as MsgIcon } from '../../../assets/images/message-icon.svg'
import { ReactComponent as EyeIcon } from '../../../assets/images/eye-solid.svg'
import DefaultAvatar from '../../../assets/images/avatar-icon.png'



const AddDiscussion = () => {

    const { user } = useAuthentication()
    const [loginModalOpen, setLoginModalOpen] = useState(false)

    const toggleLoginModal = () => {
        setLoginModalOpen((prev) => !prev)
    }

    const loginModal = () => {
        setLoginModalOpen(true)
    }

    return (
        <>
            {loginModalOpen && <LoginModal onClick={toggleLoginModal} />}
            <Header authUser={user} />
            <div className='language-selector-container'>
                <GTranslate />
            </div>
            <div className="forum-discussion-page-container">
                <FilterNavigation
                    authUser={user}
                    onClick={loginModal}
                />
                <div className='forum-discussion-page-container-col2'>
                    <SearchDiscussionBox />
                    <div className="started-discussion-container">
                        <div className='started-discussion-container-row1'>
                            <img src={DefaultAvatar} alt="" />
                            <div className='started-forum-discussion-info'>
                                <label>Review Violating Community Guidelines</label>
                                <small>by Seller_zGoDlPZLneGhF 3 hours ago</small>
                            </div>
                        </div>
                        <div className='started-discussion-container-row2'>
                            <p>The seller’s link: https://www.amazon.com/sp?ie=UTF8&seller=A3L0OOR9VMMCCA indicates their activity on Amazon, but all feedback appears to be crossed out. This seller seems to be exploiting a loophole by listing numerous products at extremely low prices. Many buyers have reported not receiving their orders, raising suspicions that the seller may be using fake tracking numbers</p>

                            <p>As a result, consumers are lured in by the attractive prices but are ultimately left disappointed. It is perplexing why Amazon continues to allow such sellers to operate. This situation not only negatively impacts the shopping experience but also tarnishes the credibility of the Amazon platform. Consumers should remain vigilant before making purchases, carefully checking seller ratings and reviews to avoid falling victim to similar scams.</p>
                        </div>
                        <div className='started-discussion-container-row3'>
                            <div className='view-reply-like-counter'>
                                <div className='like-counter'>
                                    <div className='like-msg-icon'><Like /></div>
                                    <span>4.5k</span>
                                </div>
                                <div className='reply-counter'>
                                    <div className='reply-msg-icon'><MsgIcon /></div>
                                    <span>4.5k</span>
                                </div>
                                <div className='view-counter'>
                                    <div className='view-msg-icon'><EyeIcon /></div>
                                    <span>1.2M</span>
                                </div>
                            </div>
                            <BtnReply label='Reply' />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default AddDiscussion;