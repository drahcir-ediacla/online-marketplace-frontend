import '.style.scss'
import { ReactComponent as CategoryBurgerBtn } from '../../assets/images/burger-btn_v2.svg'


const CategoryBurgerButton =() => {

    const toggleSsNavByCategory = () => {
        setSsNavByCategoryOpen((prev) => !prev)
    }
    
    return (
        <>
        <button className='brwse-category-btn' onClick={toggleSsNavByCategory}><CategoryBurgerBtn /><span>Browse by Category</span></button>
        </>
    )
}


export default CategoryBurgerButton;