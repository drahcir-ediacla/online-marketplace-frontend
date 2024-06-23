import React, { useState } from 'react';
import ReportModal from '../../components/Modal/ReportModal';
import Notification from '../../components/Notification'
import CustomSelect from '../../components/FormField/CustomSelect';
import genderData from '../../data/genderData';
import './style.scss'
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import HeroBanner1 from '../../assets/images/hero-banner1.webp'
import HeroBanner2 from '../../assets/images/hero-banner2.webp'

function ImageUploader() {
  const [images, setImages] = useState([]);
  const [readyToUploadCount, setReadyToUploadCount] = useState(0);

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);

    // Filter out already uploaded images
    const newImages = selectedImages.filter(image => !images.some(existingImage => existingImage.name === image.name));

    setImages(prevImages => [...prevImages, ...newImages]);
    setReadyToUploadCount(prevCount => prevCount + newImages.length);
  };

  const handleUpload = () => {
    // Perform upload logic here
    console.log("Uploading images:", images);
    // After successful upload, reset state
    setImages([]);
    setReadyToUploadCount(0);
  };

  return (
    <div>
      <Notification />
      <h1>Image Uploader</h1>
      <input type="file" multiple onChange={handleImageChange} />
      <br />
      <br />
      <div>
        {readyToUploadCount > 0 && (
          <div>
            <p>Ready to Upload: {readyToUploadCount} images</p>
            <button onClick={handleUpload}>Upload</button>
          </div>
        )}
        <ul>
          {images.map((image, index) => (
            <li key={index}>{image.name}</li>
          ))}
        </ul>
      </div>
      
      <CustomSelect data={genderData} />

      <div className="container">
        <div className='hero-banner'>
        <OwlCarousel className='owl-theme' items="1" dots>
          <div style={{width: '444px', height: '444px'}}>
            <img src={HeroBanner1} alt="" />
          </div>
          <div style={{width: '444px', height: '444px'}}>
            <img src={HeroBanner2} alt="" />
          </div>
        </OwlCarousel>
        </div>
        
      </div>
    </div>


  );
}

export default ImageUploader;
