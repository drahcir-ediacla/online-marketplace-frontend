import './style.scss'
import { Link } from 'react-router-dom'
import { ReactComponent as MagnifyingGlass } from '../../../assets/images/magnifying-glass.svg'
import Header from '../../../layouts/Forum/Header'
import Foorter from '../../../layouts/Forum/Footer'
import GTranslate from '../../../components/GTranslate';
import BtnCategory from '../../../components/Button/BtnCategory'
import NewDiscussionBtn from '../../../components/Button/NewDiscussionBtn'
import ForumDiscussionCard from '../../../components/Forum/ForumDiscussionCard'
import Select from '../../../components/FormField/Select'
import CustomSelect from '../../../components/FormField/CustomSelect'

const sortBy = [
    {
        label: 'Most Recent',
        value: 'Most Recent',
    },
    {
        label: 'Most Viewed',
        value: 'Most Viewed',
    },
    {
        label: 'Most Liked',
        value: 'Most Liked',
    },
];


const SubCategoryPage = () => {
    return (
        <>
            <Header />
            <div className='language-selector-container'>
                <GTranslate />
            </div>
            <div>
                <div className="forum-category-page-container">
                    <div className='forum-category-page-col1'>
                        <div className='forum-category-page-row1'>
                            <p>Join our community, elevate your marketplace experience!</p>
                            <button type='button' className='forum-login-btn'>Sign In</button>
                            <p>Don’t have a Yogeek account? <Link>Sign up</Link></p>
                        </div>
                        <div className='forum-sortby'>
                            <label>Sort By</label>
                            <CustomSelect
                                id="genderID"
                                name="gender"
                                defaultOption='Please select your gender --'
                                data={sortBy}
                                className='forum-sortby-dropdown-select'
                            />
                        </div>
                        <div className='forum-last-updated'>
                            <label>Last Updated</label>
                            <CustomSelect
                                id="genderID"
                                name="gender"
                                defaultOption='Please select your gender --'
                                data={sortBy}
                                className='forum-sortby-dropdown-select'
                            />
                        </div>
                        <div className='forum-category-page-row2'>
                            <label>Categories</label>
                            <div className="forum-category-btn-container">
                                <BtnCategory label='General Discussions' active />
                                <BtnCategory label='Product Categories' />
                                <BtnCategory label='Support and Feedback' />
                                <BtnCategory label='Seller Community' />
                                <BtnCategory label='Promotions and Deals' />
                                <BtnCategory label='Community Event' />
                                <BtnCategory label='Industry News & Trends' />
                                <BtnCategory label='Off-Topic' />
                            </div>
                        </div>
                        <div className='forum-category-page-row3'>
                            <label>Tags</label>
                            <div className="forum-category-btn-container">
                                <BtnCategory label='Mobile and Electronics' className='tag-btn active' />
                                <BtnCategory label='Furniture' className='tag-btn' />
                                <BtnCategory label={`Women's Fashion`} className='tag-btn' />
                                <BtnCategory label={`Men's Fashion`} className='tag-btn' />
                                <BtnCategory label='Beauty & Personal Care' className='tag-btn' />
                                <BtnCategory label='Sports & Leisure' className='tag-btn' />
                                <div className='more-tags'><Link>View more tags</Link></div>
                            </div>
                        </div>
                    </div>
                    <div className='forum-category-page-col2'>
                        <div className="search-box-container">
                            <div className='forum-search-box'>
                                <input
                                    type="text"
                                    placeholder='Search discussions...'
                                />
                                <button>
                                    <div className='magnifying-glass'><MagnifyingGlass /></div>
                                </button>
                            </div>
                        </div>
                        <div className="discussions-container">
                            <div className="category-container">
                                <div className="category-name">
                                    <h4>Welcome and Introductions</h4>
                                    <NewDiscussionBtn />
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
                        </div>
                    </div>
                </div>
            </div>
            <Foorter />
        </>
    )
}


export default SubCategoryPage;