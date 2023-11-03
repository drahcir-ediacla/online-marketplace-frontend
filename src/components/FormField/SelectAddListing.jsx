import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as MagnifyingGlass } from "../../assets/images/magnifying-glass.svg";
import axios from '../../apicalls/axios'
import Input from '../../components/FormField/Input'
import RadioButton from '../../components/FormField/RadioButton'
import TextArea from '../../components/FormField/TextArea'
import CheckBox from '../../components/FormField/CheckBox/CheckBox'
import CheckboxWithTextarea from '../../components/FormField/CheckBox/CheckboxWithTextarea'
import BtnGreen from '../../components/Button/BtnGreen'


const SelectAddListing = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const dropDownCategory = useRef(null);
    const [condition, setCondition] = useState('Brand New')

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

    const handleConditionChange = (event) => {
        setCondition(event.target.value);
    };

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
        axios.get("/api/getProductCategories")
            .then((response) => setCategories(response.data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const handleGlobalClick = (event) => {
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
                        <input type="text" id='selectCategory' value={selectedOption || 'Select Category'} readOnly />
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
                                                className={`parent-category ${category.subcategories.length > 0 ? "collapsible" : ""} ${category.isOpen && category.subcategories.length > 0 ? "active" : ""}`}
                                                onClick={() => handleCategoryClick(category)}
                                            >
                                                <img src={category.icon} alt="" />
                                                {category.label}
                                            </div>
                                            {category.isOpen && category.subcategories && category.subcategories.length > 0 ? (
                                                <ul className='sub-category'>
                                                    {category.subcategories.map((subcategory) => (
                                                        <li key={subcategory.value}>
                                                            <div className={`first-level-sub-category ${subcategory.subcategories.length > 0 ? "collapsible" : ""} ${subcategory.isOpen && subcategory.subcategories.length > 0 ? "active" : ""}`}
                                                                onClick={() => {
                                                                    if (subcategory.subcategories.length === 0) {
                                                                        handleOptionClick(subcategory.label);
                                                                    } else {
                                                                        handleSubcategoryClick(subcategory, category);
                                                                    }
                                                                }}>
                                                                {subcategory.label}
                                                            </div>

                                                            {subcategory.isOpen && subcategory.subcategories && subcategory.subcategories.length > 0 ? (
                                                                <ul className='sub-sub-category'>
                                                                    {subcategory.subcategories.map((subsubcategory) => (
                                                                        <li key={subsubcategory.value}>
                                                                            <div className="second-level-sub-category" onClick={() => handleOptionClick(subsubcategory.label)}>
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

                {selectedOption === 'Nike' && (
                    <div className="add-prod-details-form">
                        <div>
                            <label>Title</label>
                            <Input
                                type='text'
                                id='listingTitleID'
                                name='title'
                                className='listing-input-field'
                                placeholder='Listing Title'
                            ></Input>
                        </div>
                        <h3>About the item</h3>
                        <div>
                            <label>Condition</label>
                            <div className="product-conditions">
                                <RadioButton
                                    id="brandNewID"
                                    name="brandNew"
                                    value="Brand New"
                                    label="Brand New"
                                    checked={condition === 'Brand New'}
                                    onChange={handleConditionChange}
                                />
                                <RadioButton
                                    id="likeNewID"
                                    name="likeNew"
                                    value="Like New"
                                    label="Like New"
                                    checked={condition === 'Like New'}
                                    onChange={handleConditionChange}
                                />
                                <RadioButton
                                    id="lightlyUsedID"
                                    name="lightlyUsed"
                                    value="Lightly Used"
                                    label="Lightly Used"
                                    checked={condition === 'Lightly Used'}
                                    onChange={handleConditionChange}
                                />
                                <RadioButton
                                    id="wellUsedID"
                                    name="wellUsed"
                                    value="Well Used"
                                    label="Well Used"
                                    checked={condition === 'Well Used'}
                                    onChange={handleConditionChange}
                                />
                                <RadioButton
                                    id="heavilyUsedID"
                                    name="heavilyUsed"
                                    value="Heavily Used"
                                    label="Heavily Used"
                                    checked={condition === 'Heavily Used'}
                                    onChange={handleConditionChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label>Price</label>
                            <Input
                                type='text'
                                id='listingTitleID'
                                name='listingTitle'
                                className='listing-input-field'
                                placeholder='Price of your listing'
                            ></Input>
                        </div>
                        <div>
                            <label>Description</label>
                            <div>
                                <TextArea
                                    id='listingDescID'
                                    name='listingDesc'
                                    className='listing-description'
                                    placeholder="Type the details of your product here..."
                                    rows='7' />
                            </div>
                        </div>
                        <h3>Deal Method</h3>
                        <div>
                            <CheckBox label='Meet Up' />
                            <CheckboxWithTextarea label='Mailing & Delivery' />
                        </div>
                        <BtnGreen label='List Now' />
                    </div>
                )}

                {selectedOption === 'Adidas' && (
                    <div>
                        <h3>Adidas</h3>
                        {/* Render your Form 2 component here */}
                    </div>
                )}

                {selectedOption === 'New Balance' && (
                    <div>
                        <h3>New Balance</h3>
                        {/* Render your Form 3 component here */}
                    </div>
                )}

                {selectedOption && selectedOption !== 'Nike' && selectedOption !== 'Adidas' && selectedOption !== 'New Balance' && (
                    <div className="default-form">
                        <h3>Default Form</h3>
                        {/* Default form content */}
                    </div>
                )}
            </div>
        </>
    );
}

export default SelectAddListing;
