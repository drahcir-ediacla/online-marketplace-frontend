import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetAllCategories } from '../../apicalls/products';
import SlidingSideNav from '../SlidingSideNav'
import NavMenuSkeleton from '../../components/SkeletonLoader/NavMenuSkeleton';

const NavMenu = () => {

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     // Simulate data fetching
    //     setTimeout(() => {
    //         // Replace this with your actual data fetching logic
            
    //         setLoading(true);
    //     },); // Simulating a 2-second delay
    // }, []);


    // FETCH ALL CATEGORIES //
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await GetAllCategories();
                setCategories(response.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error("Error fetching data:", error);
            }
        };

        fetchCategories();
    }, []);

    // Specify the labels you want to include
    const includedLabels = ["Mobile and Electronics", "Sports & Leisure", "Men's Fashion", "Women's Fashion", "Furniture", "Games, Hobbies & Crafts", "Jewelry & Watches"];

    // Filter the categories based on the included labels
    const filteredCategories = categories.filter(category => includedLabels.includes(category.label));


    return (
        <>
            <nav className='nav-menu'>
                <ul>
                    {loading && <NavMenuSkeleton menus={7} />}
                    {filteredCategories.map((category, index) => (
                        <>
                            <li key={index}>
                                <div className='btm-border'>
                                    <Link to={`/category/${category.id}/${category.label}`} className='parent-menu'>
                                       {category.label }
                                    </Link>
                                    {category.subcategories && category.subcategories.length > 0 && (
                                        <div className="drop-menu">
                                            <ul>
                                                {category.subcategories.map((subCategory, subIndex) => (
                                                    <>
                                                        <li key={subIndex}>
                                                            <Link to={`/category/${subCategory.id}/${subCategory.label}`}>
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
