import './style.scss'
import CategoryMenuBtn from '../CategoryMenuBtn'
import FilterTagButton from '../../../components/Forum/FilterTagButton'
import NewDiscussionBtn from '../../../components/Button/NewDiscussionBtn'


const SmallScreenNavMenu = ({ onClickBrwseByCategory }) => {

    return (
        <>
            <div className='ss-nav-btn-container'>
                <div className='ss-nav-btn-box'>
                    <div className='ss-nav-btn-box-row1'>
                        <CategoryMenuBtn />
                        <FilterTagButton label='Popular Tags' />
                    </div>
                    <div className='start-discussion'><NewDiscussionBtn label='Start a discussion' /></div>
                    <div className='new-discussion'><NewDiscussionBtn label='New' /></div>
                </div>
            </div>
        </>
    )
}

export default SmallScreenNavMenu