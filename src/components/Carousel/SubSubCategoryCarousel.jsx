import React, { useState, useEffect, useCallback } from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Link } from 'react-router-dom'
import './style.scss'
import NoImage from '../../assets/images/no-image-available.png'

const SubSubCategoryCarousel = ({ data }) => {


    // Check if data is null or undefined
    if (!data) {
        return null; // or return some default content or loading indicator
    }


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
                {data.map((subcategory, subIndex) => (
                    <div key={subcategory.id}>
                        <Link to={`/subsubcategory/${subcategory.id}/${subcategory.label}`} className="sub-category-thumbnail">
                            <img src={subcategory.thumbnail_image || NoImage} alt="" className="sub-category-img" />
                            <div className="sub-category-thumbnail-name">{subcategory.label}</div>
                        </Link>
                    </div>
                ))}
            </Carousel>
        </>
    );
}

export default SubSubCategoryCarousel
