import React, { useState, useRef, useEffect } from 'react';
import './style.scss';

const ItemImgGallery = ({ gallery, index }) => {
  const [productImgSrc, setProductImgSrc] = useState(gallery[0]);
  const [thumbIndex, setThumbIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaType, setMediaType] = useState('image');
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
    setMediaType(getMediaType(gallery[newIndex]));
  };

  const prevSlide = () => {
    const newIndex = (currentIndex - 1 + gallery.length) % gallery.length;
    setCurrentIndex(newIndex);
    setMediaType(getMediaType(gallery[newIndex]));
  };

  const isAtFirstImage = currentIndex === 0;
  const isAtLastImage = currentIndex === gallery.length - 1;
  const isAtFirstThumb = thumbIndex === 0;
  const isAtLastThumb = thumbIndex === gallery.length - 1;

  const shouldHideThumbArrows = gallery.length <= 6;
  const shouldHideSelectedImgArrows = gallery.length <= 1;

  const getMediaType = (url) => {
    return url.endsWith('.mp4') ? 'video' : 'image';
  };


  //This prevents the right-click context menu from appearing
  const handleContextMenu = (event) => {
    event.preventDefault();
  };

  

  return (
    <>
      <div className='prod-img-gallery'>

        <div className='group-prod-img-thumb'>
          {!shouldHideThumbArrows &&
            <button className='thumb-carousel-arrow top-arrow' onClick={prevThumbSlide} disabled={isAtFirstThumb}></button>}
          <div className='thumb-carousel-container' ref={thumbCarouselRef}>
            {gallery.map((mediaSrc, index) => (
              <>
                {getMediaType(mediaSrc) === 'image' ? (
                  <img
                    key={index}
                    src={mediaSrc}
                    alt={`Small Img ${index + 1}`}
                    className='prod-img-thumb'
                    onClick={() => handleSmallImgClick(index)}
                  />
                ) : (
                  <div className='video-thumb-container'>
                    <video
                      src={mediaSrc}
                      alt={`Video ${index + 1}`}
                      className='prod-vid-thumb'
                      onClick={() => handleSmallImgClick(index)}
                    />
                    <div className='video-icon-container' onClick={() => handleSmallImgClick(index)} >
                      <i className='fa fa-play-circle' />
                    </div>
                  </div>
                )}
              </>
            ))}
          </div>
          {!shouldHideThumbArrows && <button className='thumb-carousel-arrow bottom-arrow' onClick={nextThumbSlide} disabled={isAtLastThumb}></button>}
        </div>

        <div className='selected-prod-img-container'>
          {!shouldHideSelectedImgArrows && <button className='selected-img-arrow left-arrow' onClick={prevSlide} disabled={isAtFirstImage}></button>}
          <div className="carousel-container" style={{ transform: `translateX(${-currentIndex * 444}px)` }}>

            {gallery.map((mediaSrc, index) => (
              <>
                {getMediaType(mediaSrc) === 'image' ? (
                  <img
                    key={index}
                    id="ProductImg"
                    src={mediaSrc}
                    className='selected-prod-img'
                    alt={`Img ${index + 1}`}
                    onContextMenu={handleContextMenu}
                  />

                ) : (
                  <div className='video-preview-container'>
                    <video
                      id="ProductVideo"
                      src={mediaSrc}
                      className='selected-prod-vid'
                      disablepictureinpicture
                      noplaybackrate
                      controls
                      controlslist="nodownload"
                      onContextMenu={handleContextMenu}
                    >
                    </video>
                  </div>
                )}
              </>
            ))}
          </div>
          {!shouldHideSelectedImgArrows && <button className='selected-img-arrow right-arrow' onClick={nextSlide} disabled={isAtLastImage}></button>}
        </div>
      </div>
    </>
  );
};

export default ItemImgGallery;