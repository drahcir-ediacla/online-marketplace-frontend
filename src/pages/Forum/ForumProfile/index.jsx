import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import './style.scss'
import useAuthentication from '../../../hooks/authHook'
import Header from '../../../layouts/Forum/Header'
import Footer from '../../../layouts/Forum/Footer'
import FilterNavigation from '../../../layouts/Forum/FilterNavigation'
import GTranslate from '../../../components/GTranslate';
import NewDiscussionBtn from '../../../components/Button/NewDiscussionBtn'
import ForumDiscussionCard from '../../../components/Forum/ForumDiscussionCard'
import SearchDiscussionBox from '../../../components/SearchDiscussionBox'
import QuillEditor from '../../../components/QuillEditor';
import Input from '../../../components/FormField/Input';
import BtnGreen from '../../../components/Button/BtnGreen';
import BtnClear from '../../../components/Button/BtnClear';



const ForumProfile = () => {

    const { user } = useAuthentication()
    const [activeTab, setActiveTab] = useState(0);
    const [discussionFilter, setDiscussionFilter] = useState(true)
    const location = useLocation();
    const navigate = useNavigate()

    useEffect(() => {
        if (location.state && location.state.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    useEffect(() => {
        if (location.state && location.state.hasOwnProperty('discussionFilter')) {
            setDiscussionFilter(location.state.discussionFilter);
        }
    }, [location.state]);

    const openContent = (tabIndex) => {
        setActiveTab(tabIndex);
    };

    const handleNewDiscussionClick = () => {
        navigate(`/forum/profile/${user.id}/add_discussions`);
    };


    return (
        <>
            <Header authUser={user} />
            <div className='language-selector-container'>
                <GTranslate />
            </div>
            <div className="forum-profile-container">
                <FilterNavigation
                    authUser={user}
                    createdDiscussions={() => openContent(0)}
                    joinedDiscussions={() => openContent(1)}
                    likedDiscussions={() => openContent(2)}
                    forumNotifications={() => openContent(3)}
                    addDiscussions={() => openContent(4)}
                    discussionFilter={discussionFilter}
                />
                <div className='forum-profile-page-col2'>
                    <SearchDiscussionBox />
                    <div className="discussions-container">
                        <div className="tab-content" style={{ display: activeTab === 0 ? 'flex' : 'none' }}>
                            <div className="forum-profile-tab-title">
                                <h4>Created Discussions (29)</h4>
                                <NewDiscussionBtn onClick={handleNewDiscussionClick} />
                            </div>
                            <ForumDiscussionCard
                                title='Possible Scamming Ring Uncovered!'
                                postedMessage='I just recieved an email warning me that "Your account has a gap of two days or more between your set handling time and your actual handling time. You can choose to close this gap by manually setting an accurate handling time on your account and skus or by enabling automated handling time.'
                                author='Seller_zGoDlPZLneGhF'
                                date='3 hours ago'
                                like='4.5k'
                                replies='4.5k'
                                views='1.2M'
                            />
                            <ForumDiscussionCard
                                title='Possible Scamming Ring Uncovered!'
                                postedMessage='User-generated reviews and discussions about products available on your marketplace.'
                                author='Seller_zGoDlPZLneGhF'
                                date='3 hours ago'
                                like='4.5k'
                                replies='4.5k'
                                views='1.2M'
                            />
                            <ForumDiscussionCard
                                title='Possible Scamming Ring Uncovered!'
                                postedMessage='I was trying to print shipping labels the last several days, unable to successfully get it, when I clicked the inventories I’m about to ship out, instead of putting in the same labels it puts in to different boxes. Do to that the weight is too light, even I can’t ship in different boxes. An example I have 5 items, so it puts and pick like one here, two there… two…. I don’t get it'
                                author='Seller_zGoDlPZLneGhF'
                                date='3 hours ago'
                                like='4.5k'
                                replies='4.5k'
                                views='1.2M'
                            />
                        </div>
                        <div className='tab-content' style={{ display: activeTab === 1 ? 'flex' : 'none' }}>
                            <div className="forum-profile-tab-title">
                                <h4>Joined Discussions (29)</h4>
                                <NewDiscussionBtn onClick={handleNewDiscussionClick} />
                            </div>
                            <ForumDiscussionCard
                                title='Possible Scamming Ring Uncovered!'
                                postedMessage='I just recieved an email warning me that "Your account has a gap of two days or more between your set handling time and your actual handling time. You can choose to close this gap by manually setting an accurate handling time on your account and skus or by enabling automated handling time.'
                                author='Seller_zGoDlPZLneGhF'
                                date='3 hours ago'
                                like='4.5k'
                                replies='4.5k'
                                views='1.2M'
                            />
                            <ForumDiscussionCard
                                title='Possible Scamming Ring Uncovered!'
                                postedMessage='User-generated reviews and discussions about products available on your marketplace.'
                                author='Seller_zGoDlPZLneGhF'
                                date='3 hours ago'
                                like='4.5k'
                                replies='4.5k'
                                views='1.2M'
                            />
                            <ForumDiscussionCard
                                title='Possible Scamming Ring Uncovered!'
                                postedMessage='I was trying to print shipping labels the last several days, unable to successfully get it, when I clicked the inventories I’m about to ship out, instead of putting in the same labels it puts in to different boxes. Do to that the weight is too light, even I can’t ship in different boxes. An example I have 5 items, so it puts and pick like one here, two there… two…. I don’t get it'
                                author='Seller_zGoDlPZLneGhF'
                                date='3 hours ago'
                                like='4.5k'
                                replies='4.5k'
                                views='1.2M'
                            />
                        </div>
                        <div className='tab-content' style={{ display: activeTab === 2 ? 'flex' : 'none' }}>
                            <div className='forum-profile-tab-title'>
                                <h4>Likes (29)</h4>
                                <NewDiscussionBtn onClick={handleNewDiscussionClick} />
                            </div>
                            <ForumDiscussionCard
                                title='Possible Scamming Ring Uncovered!'
                                postedMessage='I just recieved an email warning me that "Your account has a gap of two days or more between your set handling time and your actual handling time. You can choose to close this gap by manually setting an accurate handling time on your account and skus or by enabling automated handling time.'
                                author='Seller_zGoDlPZLneGhF'
                                date='3 hours ago'
                                like='4.5k'
                                replies='4.5k'
                                views='1.2M'
                            />
                            <ForumDiscussionCard
                                title='Possible Scamming Ring Uncovered!'
                                postedMessage='User-generated reviews and discussions about products available on your marketplace.'
                                author='Seller_zGoDlPZLneGhF'
                                date='3 hours ago'
                                like='4.5k'
                                replies='4.5k'
                                views='1.2M'
                            />
                            <ForumDiscussionCard
                                title='Possible Scamming Ring Uncovered!'
                                postedMessage='I was trying to print shipping labels the last several days, unable to successfully get it, when I clicked the inventories I’m about to ship out, instead of putting in the same labels it puts in to different boxes. Do to that the weight is too light, even I can’t ship in different boxes. An example I have 5 items, so it puts and pick like one here, two there… two…. I don’t get it'
                                author='Seller_zGoDlPZLneGhF'
                                date='3 hours ago'
                                like='4.5k'
                                replies='4.5k'
                                views='1.2M'
                            />
                        </div>
                        <div className='tab-content' style={{ display: activeTab === 3 ? 'flex' : 'none' }}>
                            <div className='forum-profile-tab-title'>
                                <h4>Notifications</h4>
                                <NewDiscussionBtn onClick={handleNewDiscussionClick} />
                            </div>
                        </div>
                        <div className='tab-content' style={{ display: activeTab === 4 ? 'flex' : 'none' }}>
                            <div className='forum-profile-tab-title'>
                                <h4>Add Discussions</h4>
                            </div>
                            <form className='add-discussion-form'>
                                <div className='add-discussion-form-field-container'>
                                    <label htmlFor="">Title</label>
                                    <Input className="discussion-title-box" />
                                </div>
                                <div className='add-discussion-form-field-container'>
                                    <label htmlFor="">Category</label>
                                    <Input className="discussion-select-box" />
                                </div>
                                <div className='add-discussion-form-field-container'>
                                    <label htmlFor="">Message</label>
                                    <QuillEditor
                                        id='newDiscussion'
                                        name='newDiscussion'
                                        className='new-discussion-message'
                                    />
                                </div>
                                <div className='add-discussion-form-field-container'>
                                    <label htmlFor="">Tags</label>
                                    <Input className="discussion-select-box" />
                                </div>
                                <div className='add-discussion-button-container'>
                                    <BtnGreen label='Post Discussion' />
                                    <BtnClear label='Cancel' />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ForumProfile;