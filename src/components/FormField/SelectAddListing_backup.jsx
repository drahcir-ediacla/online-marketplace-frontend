import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as MagnifyingGlass } from "../../assets/images/magnifying-glass.svg";
import productCategoryData from '../../data/productCategoryData.json';

const SelectAddListing = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState(productCategoryData);
    const dropDownCategory = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const handleCategoryClick = (clickedCategory) => {
        setCategories((prevCategories) =>
            prevCategories.map((category) => {
                if (category === clickedCategory) {
                    return { ...category, isOpen: !category.isOpen };
                } else {
                    return { ...category, isOpen: false };
                }
            })
        );
    };

    const handleSubcategoryClick = (clickedSubcategory, category) => {
        category.subcategories = category.subcategories.map((subcategory) => {
            if (subcategory === clickedSubcategory) {
                return { ...subcategory, isOpen: !subcategory.isOpen };
            } else {
                return { ...subcategory, isOpen: false };
            }
        });

        setCategories([...categories]); // This triggers a re-render
    };

    const resetCategoryState = () => {
        setCategories((prevCategories) =>
            prevCategories.map((category) => {
                return { ...category, isOpen: false };
            })
        );
    };


    useEffect(() => {
        const handleGlobalClick = event => {
            if (dropDownCategory.current && !dropDownCategory.current.contains(event.target)) {
                setIsOpen(false);
                resetCategoryState();
            }
        };

        document.addEventListener('click', handleGlobalClick);

        return () => {
            document.removeEventListener('click', handleGlobalClick);
        };
    }, []);

    return (
        <>
            <div className="select-category-container">
                <div className='wrapper' ref={dropDownCategory}>
                    <div className={`select-arrow ${isOpen ? 'active' : ''}`} onClick={toggleDropdown}></div>
                    <div className="dropdown-category">
                        <input type="text" id='selectCategory' value={selectedOption.label || 'Select Category'} readOnly />
                    </div>
                    {isOpen && (
                        <div className="category-option-list">
                            <ul>
                                <li>
                                    <div className='search-container'>
                                        <input type="text" placeholder='Search Categories' value={searchTerm} onChange={handleSearchChange} />
                                        <div className='magnifying-glass'><MagnifyingGlass /></div>
                                    </div>
                                </li>
                                {categories.map((category) => {
                                    if (!category.label.toLowerCase().includes(searchTerm.toLowerCase())) {
                                        return null; // Skip rendering if not matching the search term
                                    }
                                    return (
                                        <li key={category.value} className='main-category'>
                                            <div
                                                className={`parent-category ${category.subcategories ? "collapsible" : ""} ${category.isOpen && category.subcategories ? "active" : ""}`}
                                                onClick={() => handleCategoryClick(category)}
                                            >
                                                <img src={category.icon} alt="" />
                                                {category.label}
                                            </div>
                                            {category.isOpen && category.subcategories && category.subcategories.length > 0 ? (
                                                <ul className='sub-category'>
                                                    {category.subcategories.map((subcategory) => (
                                                        <li key={subcategory.value}>
                                                            {subcategory.subcategories ? ( // Check if subcategories exist
                                                                <div className={`first-level-sub-category collapsible ${subcategory.isOpen ? "active" : ""}`}
                                                                    onClick={() => handleSubcategoryClick(subcategory, category)}
                                                                >
                                                                    {subcategory.label}
                                                                </div>
                                                            ) : ( // No subcategories, enable handleOptionClick
                                                                <div className="first-level-sub-category" onClick={() => handleOptionClick(subcategory)}>
                                                                    {subcategory.label}
                                                                </div>
                                                            )}
                                                            {subcategory.isOpen && subcategory.subcategories && subcategory.subcategories.length > 0 ? (
                                                                <ul className='sub-sub-category'>
                                                                    {subcategory.subcategories.map((subsubcategory) => (
                                                                        <li key={subsubcategory.value} onClick={() => handleOptionClick(subsubcategory)}>
                                                                            <div className="second-level-sub-category">
                                                                                {subsubcategory.label}
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : null}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : null}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default SelectAddListing;
