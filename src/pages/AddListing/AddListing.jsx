import React, { useState, useEffect } from 'react';
import './style.scss';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import { ReactComponent as UploadImgIcon } from '../../assets/images/upload-img-icon.svg';
import { ReactComponent as UploadVidIcon } from '../../assets/images/upload-vid-icon.svg';
import Input from '../../components/FormField/Input';
import SelectAddListing from '../../components/FormField/SelectAddListing'

const AddListing = () => {

  

  const [activeRadio, setActiveRadio] = useState(0);

  const openContent = (radioIndex) => {
    setActiveRadio(radioIndex);
  };

  return (
    <>

      <Header />
      <div className="add-listing-body">
        <div className="container">
          <h3>What are you listing today?</h3>
          <div className="box">
            <div className="col-left">
              <div className="add-media-container">
                <div className="add-image-box">
                  <div className="addlisting-upload-img">
                    <UploadImgIcon />
                  </div>
                  <div>
                    Add Image
                    <div>(0/10 photos)</div>
                  </div>
                </div>
                <span className="atleast-one-photo">Add at least 1 photo.</span>
                <div className="add-video-container">
                  <span className='title-video'>Video</span>
                  <div className="upload-vid-options">
                    <div>
                      <label htmlFor="uploadvidID" className="radio-container">Upload Video
                        <input
                          type="radio"
                          id="uploadvidID"
                          checked={activeRadio === 0}
                          className={`${activeRadio === 0 ? 'active' : ''}`}
                          onClick={() => openContent(0)}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <div>
                      <label htmlFor="youtubelinkID" className="radio-container">Youtube Link
                        <input
                          type="radio"
                          id="youtubelinkID"
                          checked={activeRadio === 1}
                          className={`${activeRadio === 1 ? 'active' : ''}`}
                          onClick={() => openContent(1)}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                  </div>
                  <div style={{ display: activeRadio === 0 ? 'block' : 'none' }}>
                    <div className='upload-video-content'>
                      <div className='upload-video-box'>
                        <div className='addlisting-upload-vid'><UploadVidIcon /></div>
                        <span>Add Video</span>
                      </div>
                      <div>
                        <ul>
                          <li>Min size: 480x480 px. max video length: 60 seconds. max file size: 100MB.</li>
                          <li>Supported Format: mp4</li>
                          <li>New Video might take up to 36 hrs to be approved</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: activeRadio === 1 ? 'block' : 'none' }}>
                    <Input placeholder='Paste your Youtube URL link here' className='input-youtube-link' />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-right">
              <SelectAddListing />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddListing;
