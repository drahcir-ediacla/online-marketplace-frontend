import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import './style.scss'
import useAuthentication from '../../../hooks/authHook'
import Header from '../../../layouts/Forum/Header'
import Footer from '../../../layouts/Forum/Footer'
import GTranslate from '../../../components/GTranslate';
import NewDiscussionBtn from '../../../components/Button/NewDiscussionBtn'
import ForumSubCategory from '../../../components/Forum/ForumSubCategoryCard'
import ForumDiscussionCard from '../../../components/Forum/ForumDiscussionCard'
import FilterNavigation from '../../../layouts/Forum/FilterNavigation'
import SearchDiscussionBox from '../../../components/SearchDiscussionBox'



const ForumCategoryPage = () => {

    const {user} = useAuthentication();
    const [discussionFilter, setDiscussionFilter] = useState(false)
    const navigate = useNavigate();

    const handleNewDiscussionClick = () => {
        navigate(`/forum/profile/${user.id}`, { 
            state: { 
                activeTab: 4, 
                discussionFilter: false 
            } 
        });
    };
    

    return (
        <>
            <Header authUser={user} />
            <div className='language-selector-container'>
                <GTranslate />
            </div>
            <div>
                <div className="forum-category-page-container">
                    <FilterNavigation authUser={user} discussionFilter={discussionFilter} />
                    <div className='forum-category-page-col2'>
                        <SearchDiscussionBox />
                        <div className="discussions-container">
                            <div className="category-container">
                                <div className="category-name">
                                    <h4>General Discussion</h4>
                                    <NewDiscussionBtn onClick={handleNewDiscussionClick} />
                                </div>
                                <ForumSubCategory
                                    title='Product Reviews'
                                    description='User-generated reviews and discussions about products available on your marketplace.'
                                    replies='102k'
                                    views='27.9M'
                                    lastActivity='1h ago'
                                />
                                <ForumSubCategory
                                    title='Product Reviews'
                                    description='User-generated reviews and discussions about products available on your marketplace.'
                                    replies='102k'
                                    views='27.9M'
                                    lastActivity='1h ago'
                                />
                            </div>
                            <div className='recent-discussion'>
                                <h6>Recent Discussions</h6>
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
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}


export default ForumCategoryPage;