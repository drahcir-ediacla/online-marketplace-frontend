import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetAllCategories } from '../../apicalls/products';
import SlidingSideNav from '../SlidingSideNav';
import NavMenuSkeleton from '../../components/SkeletonLoader/NavMenuSkeleton';

const NavMenu = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await GetAllCategories();
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Specify the labels you want to include
    const includedLabels = ["Mobile and Electronics", "Sports & Leisure", "Men's Fashion", "Women's Fashion", "Baby & Kids", "Beauty & Personal Care", "Furniture", "Games, Hobbies & Crafts", "Book, Music & Tickets"];

    // Filter the categories based on the included labels
    const filteredCategories = categories.filter(category => includedLabels.includes(category.label));

    return (
        <nav className='nav-menu'>
            <ul>
                {loading && <NavMenuSkeleton menus={7} />}
                {filteredCategories.map(category => (
                    <li key={category.id}>
                        <div className='btm-border'>
                            <Link to={`/category/${category.id}/${category.label}`} className='parent-menu'>
                                {category.label}
                            </Link>
                            {category.subcategories && category.subcategories.length > 0 && (
                                <div className="drop-menu">
                                    <ul>
                                        {category.subcategories.map(subCategory => (
                                            <li key={subCategory.id}>
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
    );
};

export default NavMenu;
