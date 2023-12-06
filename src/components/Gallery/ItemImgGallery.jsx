import React, { useState, useRef, useEffect } from 'react';
import './style.scss';

const ItemImgGallery = ({ gallery }) => {
  const [productImgSrc, setProductImgSrc] = useState(gallery[0]);
  const [thumbIndex, setThumbIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const thumbHeight = 76; // Update with the actual height of prod-img-thumb

  const thumbCarouselRef = useRef();

  const handleSmallImgClick = (index) => {
    setProductImgSrc(gallery[index]);
    setCurrentIndex(index);
  };

  const nextThumbSlide = () => {
    const newThumbIndex = (thumbIndex + 1) % gallery.length;
    setThumbIndex(newThumbIndex);
  };

  const prevThumbSlide = () => {
    const newThumbIndex = (thumbIndex - 1 + gallery.length) % gallery.length;
    setThumbIndex(newThumbIndex);
  };

  useEffect(() => {
    const translateYValue = -thumbIndex * thumbHeight;
    thumbCarouselRef.current.style.transform = `translateY(${translateYValue}px)`;
  }, [thumbIndex, thumbHeight]);

  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % gallery.length;
    setCurrentIndex(newIndex);
  };

  const prevSlide = () => {
    const newIndex = (currentIndex - 1 + gallery.length) % gallery.length;
    setCurrentIndex(newIndex);
  };

  const isAtFirstImage = currentIndex === 0;
  const isAtLastImage = currentIndex === gallery.length - 1;
  const isAtFirstThumb = thumbIndex === 0;
  const isAtLastThumb = thumbIndex === gallery.length - 1;

  const shouldHideThumbArrows = gallery.length <= 6;
  const shouldHideSelectedImgArrows = gallery.length <= 1;

  return (
    <>
      <div className='prod-img-gallery'>
      
        <div className='group-prod-img-thumb'>
          <button className={`thumb-carousel-arrow top-arrow ${shouldHideThumbArrows ? 'hide' : ''}`} onClick={prevThumbSlide} disabled={isAtFirstThumb}></button>
          <div className='thumb-carousel-container' ref={thumbCarouselRef}>
          {gallery.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Small Img ${index + 1}`}
                className='prod-img-thumb'
                onClick={() => handleSmallImgClick(index)}
              />
              ))}
          </div>
          <button className={`thumb-carousel-arrow bottom-arrow ${shouldHideThumbArrows ? 'hide' : ''}`} onClick={nextThumbSlide} disabled={isAtLastThumb}></button>
        </div>
          
        <div className='selected-prod-img-container'>
          <button className={`selected-img-arrow left-arrow ${shouldHideSelectedImgArrows ? 'hide' : ''}`} onClick={prevSlide} disabled={isAtFirstImage}></button>
          <div className="carousel-container" style={{ transform: `translateX(${-currentIndex * 100}%)` }}>
            {gallery.map((src, index) => (
              <img
                key={index}
                id="ProductImg"
                src={productImgSrc && src}
                className='selected-prod-img'
                alt={`Image ${index + 1}`}
              />
            ))}
          </div>
          <button className={`selected-img-arrow right-arrow ${shouldHideSelectedImgArrows ? 'hide' : ''}`} onClick={nextSlide} disabled={isAtLastImage}></button>
        </div>
      </div>
    </>
  );
};

export default ItemImgGallery;