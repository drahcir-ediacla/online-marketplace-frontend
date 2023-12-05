import React, { useState } from 'react';
import './style.scss';

const ItemImgGallery = ({ gallery }) => {
  const [productImgSrc, setProductImgSrc] = useState(gallery[0]);
  const [thumbIndex, setThumbIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <>
      <div className='prod-img-gallery'>
        <div className='group-prod-img-thumb'>
          <button className="thumb-carousel-arrow top-arrow" onClick={prevThumbSlide} disabled={isAtFirstImage}></button>
          <div className='thumb-carousel-container' style={{ transform: `translateY(${-thumbIndex * 60}%)` }}>
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
          <button className="thumb-carousel-arrow bottom-arrow" onClick={nextThumbSlide}></button>
        </div>

        <div className='selected-prod-img-container'>
          <button className="selected-img-arrow left-arrow" onClick={prevSlide}></button>
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
          <button className="selected-img-arrow right-arrow" onClick={nextSlide}></button>
        </div>
      </div>
    </>
  );
};

export default ItemImgGallery;
