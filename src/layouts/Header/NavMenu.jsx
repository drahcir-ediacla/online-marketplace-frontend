import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GetAllCategories } from '../../apicalls/products';
import SlidingSideNav from '../SlidingSideNav'
import NavMenuSkeleton from '../../components/SkeletonLoader/NavMenuSkeleton';

const NavMenu = () => {

    const [categories, setCategories] = useState([]);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await GetAllCategories();
                setCategories(response.data);
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false); // Handle error by setting loading to false
            }
        };

        fetchCategories();
    }, []);

    const includedLabels = ["Mobile and Electronics", "Sports & Leisure", "Men's Fashion", "Women's Fashion", "Furniture", "Games, Hobbies & Crafts", "Jewelry & Watches"];
    
    // Render the skeleton loader while loading
    if (loading) {
        return <NavMenuSkeleton />;
    }


    return (
        <>
            <nav className='nav-menu'>
                <ul>
                    {categories
                        .filter(category => includedLabels.includes(category.label))
                        .map((category, index) => (
                            <li key={index}>
                                <div className='btm-border'>
                                    <Link to={`/maincategory/${category.id}/${category.label}`} className='parent-menu'>
                                        {category.label}
                                    </Link>
                                    {category.subcategories && category.subcategories.length > 0 && (
                                        <div className="drop-menu">
                                            <ul>
                                                {category.subcategories.map((subCategory, subIndex) => (
                                                    <li key={subIndex}>
                                                        <Link to={`/subcategory/${subCategory.id}/${subCategory.label}`}>
                                                            {subCategory.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </li>
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
