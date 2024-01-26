import React, { useState, useEffect, useCallback } from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Link } from 'react-router-dom'
import './style.scss'
import NoImage from '../../assets/images/no-image-available.png'
import SubCategory1 from '../../assets/images/sub-category-1.png'
import SubCategory2 from '../../assets/images/sub-category-2.png'
import SubCategory3 from '../../assets/images/sub-category-3.png'
import SubCategory4 from '../../assets/images/sub-category-4.png'
import SubCategory5 from '../../assets/images/sub-category-5.png'
import SubCategory6 from '../../assets/images/sub-category-6.png'
import SubCategory7 from '../../assets/images/sub-category-7.png'

const SubCategoryCarousel = ({ data }) => {

    
    // Check if data is null or undefined
    if (!data) {
        return null; // or return some default content or loading indicator
    }


    // Function to limit the number of characters
    const limitCharacters = (text, maxLength) => {
        if (!text) {
            return ''; // or return some default value
        }
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 7
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 7,
            slidesToSlide: 5
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2
        }
    };



    return (
        <>
            <Carousel responsive={responsive} draggable={true} containerClass="carousel-container">
                {data.map((subcategory, index) => (
                    <Link to={`/subcategory/${subcategory.id}/${subcategory.label}`} className="sub-category-thumbnail" key={index}>
                        <img src={subcategory.thumbnail_image || NoImage} alt="" className="sub-category-img" />
                        <div className="sub-category-thumbnail-name">{subcategory.label}</div>
                    </Link>
                ))}
            </Carousel>
        </>
    );
}

export default SubCategoryCarousel
