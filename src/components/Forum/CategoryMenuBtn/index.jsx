import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../../apicalls/axios'
import './style.scss'
import { ReactComponent as CategoryBurgerBtn } from '../../../assets/images/burger-btn_v2.svg'
import { ReactComponent as GroupMsgIcon } from '../../../assets/images/group-message-icon.svg'
import { ReactComponent as StreamVideoIcon } from '../../../assets/images/video-solid-icon.svg'


const CategoryMenuBtn = ({ data }) => {
    const navigate = useNavigate()
    const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(false)
    const [forumCategories, setForumCategories] = useState([])

    useEffect(() => {
        const fetchForumCategories = async () => {
            try {
                const response = await axios.get('/api/fetchforumcategories')
                setForumCategories(response.data)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchForumCategories();
    }, [])

    const toggleSsNavByCategory = () => {
        setCategoriesMenuOpen((prev) => !prev)
    }

    const goToCategoryPage = (id, name) => {
        navigate(`/forum/category/${id}/${name}`)
        setCategoriesMenuOpen(false)
    }

    const goToMoviePage = () => {
        navigate(`/streaming-movies`);
    }

    return (
        <>
            <button className='brwse-category-btn' onClick={toggleSsNavByCategory}><CategoryBurgerBtn /><span>Browse by Category</span></button>
            {categoriesMenuOpen &&
                <div className="ss-nav-category-container">
                    <div className="ss-nav-category-row1">
                        <span>Browse by Category</span>
                        <button className="close-btn" onClick={toggleSsNavByCategory}>
                            <i className="fa fa-times"></i>
                        </button>
                    </div>
                    <div className="ss-nav-category-row2">
                        <ul className='forum-category-list'>
                            {forumCategories?.categories?.map((category) => (
                                <li className='forum-main-category' key={category.id}>
                                    <button className='parent-forum-category' onClick={() => goToCategoryPage(category.id, category.name)}><div className='group-msg-icon'><GroupMsgIcon /></div>{category.name}</button>
                                    {category.subcategories.map((subcategory) => (
                                        <ul className='forum-subcategory' key={subcategory.id}>
                                            <li>
                                                <button onClick={() => goToCategoryPage(subcategory.id, subcategory.name)} className='first-level-forum-subcategory'>{subcategory.name}</button>
                                            </li>
                                        </ul>
                                    ))}
                                </li>
                            ))}
                            <li className='forum-main-category'>
                                <button className='parent-forum-category' onClick={goToMoviePage}><div className='group-msg-icon'><StreamVideoIcon /></div>Streaming Movies</button>
                            </li>
                        </ul>
                    </div>
                    <div className="ss-nav-category-row3"></div>
                </div>
            }
        </>
    )
}


export default CategoryMenuBtn;