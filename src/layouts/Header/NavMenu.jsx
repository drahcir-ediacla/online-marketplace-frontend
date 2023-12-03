import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GetAllCategories } from '../../apicalls/products';
import SlidingSideNav from '../SlidingSideNav'
import { Setloader } from '../../redux/reducer/loadersSlice';

const NavMenu = () => {

    const [categories, setCategories] = useState([])
    const dispatch = (useDispatch())

    // FETCH ALL CATEGORIES //
    useEffect(() => {
        const fetchCategories = async () => {
          try {
            dispatch(Setloader(true))
            const response = await GetAllCategories();
            setCategories(response.data);
            dispatch(Setloader(false))
          } catch (error) {
            dispatch(Setloader(false))
            console.error("Error fetching data:", error);
          }
        };
    
        fetchCategories();
      }, [dispatch]);

    // Specify the labels you want to include
    const includedLabels = ["Mobile and Electronics", "Sports & Leisure", "Men's Fashion", "Women's Fashion", "Furniture", "Games, Hobbies & Crafts", "Jewelry & Watches"];

    // Filter the categories based on the included labels
    const filteredCategories = categories.filter(category => includedLabels.includes(category.label));


    return (
        <>
            <nav className='nav-menu'>
                <ul>
                    {filteredCategories.map((category, index) => (
                        <>
                            <li key={index}>
                                <div className='btm-border'>
                                    <Link to={`/subcategory/${category.id}/${category.label}`} className='parent-menu'>
                                        {category.label}
                                    </Link>
                                    {category.subcategories && category.subcategories.length > 0 && (
                                    <div className="drop-menu">
                                        <ul>
                                            {category.subcategories.map((subCategory, subIndex) => (
                                                <>
                                                    <li key={subIndex}>
                                                        <Link to={`/subcategory/${subCategory.id}/${subCategory.label}`}>
                                                            {subCategory.label}
                                                        </Link>
                                                    </li>
                                                </>
                                            ))}
                                        </ul>
                                    </div>
                                    )}
                                </div>
                            </li>
                            </>
                    ))}
                            <li>
                                <SlidingSideNav />
                            </li>
                        
                </ul>
            </nav>
        </>
    )
}

export default NavMenu
