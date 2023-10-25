import React, { useEffect, useState } from "react";
import { ReactComponent as MagnifyingGlass } from "../../assets/images/magnifying-glass.svg";
import productCategoryData from '../../data/productCategoryData.json'



const SelectAddListing = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const filteredOptions = productCategoryData.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    useEffect(() => {
        const collapsibleElements = document.getElementsByClassName("collapsible");

        const handleCollapsibleClick = function () {
            this.classList.toggle("active");
            const content = this.nextElementSibling;

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        };

        for (let i = 0; i < collapsibleElements.length; i++) {
            collapsibleElements[i].addEventListener("click", handleCollapsibleClick);
        }

        return () => {
            // Clean up event listeners when the component unmounts
            for (let i = 0; i < collapsibleElements.length; i++) {
                collapsibleElements[i].removeEventListener("click", handleCollapsibleClick);
            }
        };
    }, []);


    return (
        <>
            <div className="select-category-container">
                <div className={`wrapper ${isOpen ? 'open' : ''}`}>
                    <div className="dropdown-category" onClick={toggleDropdown}>
                        <input type="text" id='selectCategory' value={selectedOption.label || 'Select Category'} readOnly />
                        <div className='select-arrow'></div>
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
                                {filteredOptions.map((option) => {
                                    console.log(option.label, option.subcategories); // Debugging

                                    return (
                                        <li key={option.value} className='main-category'>
                                            <div className={`category-icon ${option.subcategories ? "collapsible" : ""}`}>
                                                <img src={option.icon} alt="" />
                                                {option.label}
                                            </div>
                                            {option.subcategories && option.subcategories.length > 0 ? (
                                                <ul className='sub-category'>
                                                    {option.subcategories.map((subcategory) => (
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
    )
}

export default SelectAddListing;