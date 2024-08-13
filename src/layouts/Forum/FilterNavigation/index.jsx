import './style.scss'
import { Link, useParams } from 'react-router-dom'
import DefaultAvatar from '../../../assets/images/avatar-icon.png'
import CustomSelect from '../../../components/FormField/CustomSelect'
import BtnCategory from '../../../components/Button/BtnCategory'


const FilterNavigation = ({ authUser }) => {
    const { userId } = useParams();
    console.log('userId:', userId)
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

    const originalDate = authUser?.createdAt || '';
    const formattedDate = new Date(originalDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

    const goLogin = () => {
        window.location.href = '/loginemail'
    }


    return (
        <>
            <div className='forum-category-page-filter-nav'>
                {!authUser ? (
                    <div className='forum-category-page-row1 not-authenticated'>
                        <p>Join our community, elevate your marketplace experience!</p>
                        <button type='button' className='forum-login-btn' onClick={goLogin}>Sign In</button>
                        <p>Don’t have a Yogeek account? <Link>Sign up</Link></p>
                    </div>
                ) : (
                    <>
                        {userId && (
                            <div className='forum-category-page-row1'>
                                <div className='forum-category-page-row1-row1'>
                                    <img src={authUser?.profile_pic || DefaultAvatar} alt="" className='forum-profile-pic' />
                                    <div className='user-display-name'>
                                        <p>{authUser?.display_name}</p>
                                        <small>Joined in {formattedDate}</small>
                                    </div>
                                </div>
                                <ul className='forum-profile-menu'>
                                    <li>Created Discussions <span className='forum-activity-counter'>(29)</span></li>
                                    <li>Joined Discussions <span className='forum-activity-counter'>(82)</span></li>
                                    <li>Likes <span className='forum-activity-counter'>(82)</span></li>
                                    <li className='forum-notifications'>Notifications <div className='forum-notification-counter'>2</div></li>
                                </ul>
                            </div>
                        )}
                    </>
                )}
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
        </>
    )
}


export default FilterNavigation;