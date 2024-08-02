import React from 'react';
import { Link } from 'react-router-dom'
import './style.scss'

const Breadcrumb = ({ categories, selectedCategory }) => {

    const selectedCategoryId = parseInt(selectedCategory, 10);


    // Helper function to recursively find a category by ID in the hierarchy
    const findCategoryById = (categories, categoryId) => {
        for (const category of categories) {
            if (category.id === categoryId) {
                return category;
            }
            if (category.subcategories && category.subcategories.length > 0) {
                const subcategory = findCategoryById(category.subcategories, categoryId);
                if (subcategory) {
                    console.log('Subcategory found:', subcategory);
                    return subcategory;
                }
            }
        }
        return null;
    };




    const renderBreadcrumb = () => {
        const breadcrumbItems = [];
        let currentCategoryId = selectedCategoryId;

        const findCategoryByIdRecursive = (categoryId) => {
            const category = findCategoryById(categories, categoryId);
            if (category) {
                breadcrumbItems.unshift(category);

                // Check if there is a parent category
                if (category.parent_id !== null && category.parent_id !== undefined) {
                    findCategoryByIdRecursive(category.parent_id);
                }
            }
        };



        findCategoryByIdRecursive(currentCategoryId);

        return breadcrumbItems.map((category, index) => {
            const categoryLabel = category ? category.value : `Category ${category.id} Not Found`;
            const isLastItem = index === breadcrumbItems.length - 1;

            return (
                <span key={category.id} className={isLastItem ? 'last-item' : ''}>
                    {isLastItem ? (
                        categoryLabel
                    ) : (
                        <Link to={`/category/${category.id}/${category.value}`}>{categoryLabel}</Link>
                    )}
                    {!isLastItem && ' / '}
                </span>
            );
        });
    };




    return (
        <div className="breadcrumb">
           <Link to="/">Home</Link> &nbsp;/&nbsp; {renderBreadcrumb()}
        </div>
    );
};

export default Breadcrumb;
