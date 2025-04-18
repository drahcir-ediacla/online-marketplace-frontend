import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProductCategories } from '../../redux/actions/productCategoriesActions';
import SlidingSideNav from '../SlidingSideNav';
import NavMenuSkeleton from '../../components/SkeletonLoader/NavMenuSkeleton';
import { ReactComponent as CommunityIcon } from '../../assets/images/community-icon-solid.svg';

const NavMenu = () => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.productcategories.data);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (categories.length === 0) {
            setLoading(true);
            dispatch(getProductCategories());
        }
        else {
            setLoading(false);
        }
    }, [dispatch, categories]);

    // useEffect(() => {
    //     const fetchCategories = async () => {
    //         try {
    //             setLoading(true);
    //             setCategories(productCategories);
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchCategories();
    // }, []);

    // Specify the labels you want to include
    const includedLabels = ["Mobile and Electronics", "Sports & Leisure", "Men's Fashion", "Women's Fashion", "Beauty & Personal Care", "Furniture", "Games, Hobbies & Crafts"];

    // Filter the categories based on the included labels
    const filteredCategories = categories.filter(category => includedLabels.includes(category.label));

    return (
        <nav className='nav-menu'>
            <ul>
                <li>
                    <div className='btm-border'>
                        <div className='community-icon'><CommunityIcon /></div>
                        <Link to={'/forum'} className='parent-menu community-menu'>Community</Link>
                    </div>
                </li>
                {loading && <NavMenuSkeleton menus={7} />}
                {filteredCategories.map(category => (
                    <li key={category.id} className='filtered-categories'>
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
