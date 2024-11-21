import './style.scss'
import FilterTagButton from '../../../components/Forum/FilterTagButton'
import NewDiscussionBtn from '../../../components/Button/NewDiscussionBtn'
import { ReactComponent as CategoryBurgerBtn } from '../../../assets/images/burger-btn_v2.svg'


const SmallScreenNavMenu = ({ onClickBrwseByCategory }) => {

    return (
        <>
            <div className='ss-nav-btn-container'>
                <div className='ss-nav-btn-box'>
                    <div className='ss-nav-btn-box-row1'>
                        <button className='brwse-category-btn' onClick={onClickBrwseByCategory}><CategoryBurgerBtn /><span>Browse by Category</span></button>
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