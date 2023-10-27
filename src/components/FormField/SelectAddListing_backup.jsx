import React, { useEffect, useState } from "react";
import { ReactComponent as MagnifyingGlass } from "../../assets/images/magnifying-glass.svg";
import productCategoryData from '../../data/productCategoryData.json';

const SelectAddListing = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState(productCategoryData);

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

    

    return (
        <>
            <div className="select-category-container">
                <div className='wrapper'>
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
                                                className={`category-icon ${category.subcategories ? "collapsible" : ""} ${category.isOpen && category.subcategories ? "active" : ""}`}
                                                onClick={() => handleCategoryClick(category)}
                                            >
                                                <img src={category.icon} alt="" />
                                                {category.label}
                                            </div>
                                            {category.isOpen && category.subcategories && category.subcategories.length > 0 ? (
                                                <ul className='sub-category'>
                                                    {category.subcategories.map((subcategory) => (
                                                        <li key={subcategory.value} onClick={() => handleOptionClick(subcategory)}>{subcategory.label}</li>
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
