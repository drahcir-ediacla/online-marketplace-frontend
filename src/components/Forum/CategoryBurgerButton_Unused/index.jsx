import { useState } from 'react'
import './style.scss'
import SSNavByCategory from '../SSNavByCategory'
import { ReactComponent as CategoryBurgerBtn } from '../../../assets/images/burger-btn_v2.svg'


const CategoryBurgerButton = ({ data }) => {
    const [ssNavByCategoryOpen, setSsNavByCategoryOpen] = useState(false)

    const toggleSsNavByCategory = () => {
        setSsNavByCategoryOpen((prev) => !prev)
    }

    return (
        <>
            {ssNavByCategoryOpen && <SSNavByCategory data={data} onClick={toggleSsNavByCategory} />}
            <button className='brwse-category-btn' onClick={toggleSsNavByCategory}><CategoryBurgerBtn /><span>Browse by Category</span></button>
        </>
    )
}


export default CategoryBurgerButton;