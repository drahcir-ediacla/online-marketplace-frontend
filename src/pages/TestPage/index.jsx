import React, { useState } from 'react';

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
    </div>
  );
}

export default ImageUploader;
