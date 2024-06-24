import React, { useState, useRef, useEffect } from 'react';
import ReactImageMagnify from 'react-image-magnify';
import './style.scss';
import Carousel from 'react-multi-carousel';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const ItemImgGallery = ({ gallery, index }) => {
  const [productImgSrc, setProductImgSrc] = useState(gallery[0]);
  const [thumbIndex, setThumbIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaType, setMediaType] = useState('image' || 'youtube');
  const thumbHeight = 76; // Update with the actual height of prod-img-thumb

  const thumbCarouselRef = useRef();
  const portalId = 'customPortal';



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
    return url.endsWith('.mp4') ? 'video' : (url.includes('youtube.com') ? 'youtube' : 'image');
  };



  //This prevents the right-click context menu from appearing
  const handleContextMenu = (event) => {
    event.preventDefault();
  };


  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 1
    },
    desktop: {
      breakpoint: { max: 3000, min: 1440 },
      items: 1,
      slidesToSlide: 1
    },
    tablet: {
      breakpoint: { max: 1440, min: 1024 },
      items: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 740 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 740, min: 0 },
      items: 1
    }
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
                    onContextMenu={handleContextMenu}
                  />
                ) : (
                  getMediaType(mediaSrc) === 'youtube' ? (
                    <>
                      <div onClick={() => handleSmallImgClick(index)} className="youtube-container" alt={`Youtube ${index + 1}`}>
                        <i className='fa fa-youtube-play' />
                      </div>
                    </>
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
                  )
                )}
              </>
            ))}
          </div>
          {!shouldHideThumbArrows && <button className='thumb-carousel-arrow bottom-arrow' onClick={nextThumbSlide} disabled={isAtLastThumb}></button>}
        </div>
        <div className="desktop-img-gallery">
          <div className='selected-prod-img-container'>
            {!shouldHideSelectedImgArrows && <button className='selected-img-arrow left-arrow' onClick={prevSlide} disabled={isAtFirstImage}></button>}
            <div className="carousel-container" style={{ transform: `translateX(${-currentIndex * 444}px)` }}>

              {gallery.map((mediaSrc, index) => (
                <>
                  {getMediaType(mediaSrc) === 'image' ? (
                    <ReactImageMagnify
                      key={index}
                      {...{
                        smallImage: {
                          alt: `Img ${index + 1}`,
                          isFluidWidth: true,
                          src: mediaSrc,
                        },
                        largeImage: {
                          src: mediaSrc,
                          width: 1200,
                          height: 1800,
                        },
                        enlargedImageContainerStyle: {
                          zIndex: "1500",
                        },
                        enlargedImageContainerDimensions: {
                          width: 900,
                          height: 650,
                        },
                        id: `ProductImg_${index}`,  // Unique ID for each ReactImageMagnify component
                        imageClassName: 'selected-prod-img',
                        enlargedImageClassName: "selected-prod-large-img",
                        alt: `Img ${index + 1}`,
                        enlargedImagePortalId: portalId,  // Pass the portalId variable
                      }}
                    />
                  ) : getMediaType(mediaSrc) === 'youtube' ? (
                    <div>
                      <iframe width="444" height="444" src={mediaSrc} frameborder="0" allowfullscreen ></iframe>
                    </div>
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
                      />
                    </div>
                  )}

                </>
              ))}
            </div>
            {!shouldHideSelectedImgArrows && <button className='selected-img-arrow right-arrow' onClick={nextSlide} disabled={isAtLastImage}></button>}
          </div>
        </div>
        <div className='custom-portal' id={portalId}></div>


      </div>
      {/* --------------------------------- PRODUCT IMAGE CAROUSEL FOR SMALL DEVICES ---------------------------*/}

      <div className='small-device-carousel-container'>
        <OwlCarousel className='owl-theme' items="1" dots>
          {gallery.map((mediaSrc, index) => (
            <>
              {getMediaType(mediaSrc) === 'image' ? (
                <div>
                  <img
                    key={index}
                    src={mediaSrc}
                    className='selected-prod-img'
                  />
                </div>
              ) : getMediaType(mediaSrc) === 'youtube' ? (
                <div>
                  <iframe src={mediaSrc} frameborder="0" allowfullscreen className='youtube-frame' ></iframe>
                </div>
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
                  />
                </div>
              )}
            </>
          ))}
        </OwlCarousel>
      </div>


    </>
  );
};

export default ItemImgGallery;