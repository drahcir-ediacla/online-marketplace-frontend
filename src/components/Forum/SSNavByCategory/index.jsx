import React, { useState } from 'react'
import { useNavigate} from 'react-router-dom'
import './style.scss'
import { ReactComponent as GroupMsgIcon } from '../../../assets/images/group-message-icon.svg'

const SSNavByCategory = ({ data, onClick }) => {
    const navigate = useNavigate()
    const [ssNavByCategoryOpen, setSsNavByCategoryOpen] = useState(true)
    

    const goToCategoryPage = (id, name) => {
        navigate(`/forum/category/${id}/${name}`)
    }

    return (
        <>
            {ssNavByCategoryOpen &&
                <div className="ss-nav-category-container">
                    <div className="ss-nav-category-row1">
                        <span>Browse by Category</span>
                        <button className="close-btn" onClick={onClick}>
                            <i className="fa fa-times"></i>
                        </button>
                    </div>
                    <div className="ss-nav-category-row2">
                        <ul className='forum-category-list'>
                            {data?.categories?.map((category) => (
                                <li className='forum-main-category' key={category.id}>
                                    <div className='parent-forum-category'><div className='group-msg-icon'><GroupMsgIcon /></div>{category.name}</div>
                                    {category.subcategories.map((subcategory) => (
                                        <ul className='forum-subcategory' key={subcategory.id}>
                                            <li>
                                                <button onClick={() => goToCategoryPage(subcategory.id, subcategory.name)} className='first-level-forum-subcategory'>{subcategory.name}</button>
                                            </li>
                                        </ul>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="ss-nav-category-row3"></div>
                </div>
            }

        </>
    )
}

export default SSNavByCategory