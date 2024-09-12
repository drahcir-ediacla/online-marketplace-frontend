import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from '../../apicalls/axios'
import { useDispatch } from 'react-redux';
import { GetAllCategories } from '../../apicalls/products'
import useAuthentication from '../../hooks/authHook'
import './style.scss';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import { Setloader } from '../../redux/reducer/loadersSlice';
import { ReactComponent as MagnifyingGlass } from "../../assets/images/magnifying-glass.svg";
import { ReactComponent as UploadImgIcon } from '../../assets/images/upload-img-icon.svg';
import { ReactComponent as UploadVidIcon } from '../../assets/images/upload-vid-icon.svg';
import Input from '../../components/FormField/Input';
import RadioButton from '../../components/FormField/RadioButton'
import CheckBox from '../../components/FormField/CheckBox/CheckBox'
import BtnGreen from '../../components/Button/BtnGreen'
import BtnClear from '../../components/Button/BtnClear';
import MeetUpSelector from '../../components/MeetUpSelector';
import QuillEditor from '../../components/QuillEditor';
import CompleteProfileModal from '../../components/Modal/CompleteProfileModal';

const AddListing = () => {

  const dispatch = useDispatch()
  const { user } = useAuthentication();
  const userId = user?.id;
  const [activeRadio, setActiveRadio] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [accountVerified, setAccountVerified] = useState(true)
  const [selectedOption, setSelectedOption] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const dropDownCategory = useRef(null);
  const [delivery, setDelivery] = useState([]);
  const [condition, setCondition] = useState('Brand New');
  const [productDetails, setProductDetails] = useState({
    product_name: '',
    description: '',
    price: 0, // You can set a default value
    category_id: '', // Set the selected category's ID here
    product_condition: 'Brand New',
    mailing_delivery: '',
    youtube_link: '',
  });


  useEffect(() => {
    if(user?.account_verified === false) {
      setAccountVerified(false)
    }
  })

  const openContent = (radioIndex) => {
    setActiveRadio(radioIndex);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  }


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  }


  const handleDescriptionChange = (content) => {
    setProductDetails({ ...productDetails, description: content });
};

  const handleConditionChange = (event) => {
    const selectedCondition = event.target.value;
    setCondition(selectedCondition); // Update the local state

    setProductDetails({
      ...productDetails,
      product_condition: selectedCondition, // Set the product_condition in productDetails
    });
  };



  const selectedDelivery = delivery.join(' | ');

  const handleCheckboxDeliveryChange = (event) => {
    const deliveryOption = event.target.value;
    // Check if the delivery option is already selected
    const isSelected = delivery.includes(deliveryOption);

    // Toggle the delivery option based on its selection state
    if (isSelected) {
      // If already selected, remove it from the array
      setDelivery(prevDelivery => prevDelivery.filter(option => option !== deliveryOption));
    } else {
      // If not selected, add it to the array
      setDelivery(prevDelivery => [...prevDelivery, deliveryOption]);
    }

    setProductDetails({
      ...productDetails,
      mailing_delivery: selectedDelivery, // Set the product_condition in productDetails
    });
  };



  const handleOptionClick = (option) => {
    let selectedCategory = null;

    // Find the category or subcategory object based on the selectedOption
    for (const category of categories) {
      if (category.label === option) {
        selectedCategory = category;
        break;
      }

      for (const subcategory of category.subcategories) {
        if (subcategory.label === option) {
          selectedCategory = subcategory;
          break;
        }

        // Add handling for the second level of subcategories
        for (const subsubcategory of subcategory.subcategories) {
          if (subsubcategory.label === option) {
            selectedCategory = subsubcategory;
            break;
          }
        }

        if (selectedCategory) {
          break;
        }
      }

      if (selectedCategory) {
        break;
      }
    }

    if (selectedCategory) {
      setSelectedOption(option);
      setProductDetails({
        ...productDetails,
        category_id: selectedCategory.id,
      });
    }

    setIsOpen(false);
  };



  const handleCategoryClick = (clickedCategory) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => {
        if (category === clickedCategory) {
          return { ...category, isOpen: !category.isOpen };
        } else {
          return { ...category, isOpen: false };
        }
      })
    );
  };

  const handleSubcategoryClick = (clickedSubcategory, category) => {
    category.subcategories = category.subcategories.map((subcategory) => {
      if (subcategory === clickedSubcategory) {
        return { ...subcategory, isOpen: !subcategory.isOpen };
      } else {
        return { ...subcategory, isOpen: false };
      }
    });

    setCategories([...categories]); // This triggers a re-render
  };

  const resetCategoryState = () => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => {
        return { ...category, isOpen: false };
      })
    );
  };


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await GetAllCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCategories();
  }, []);


  useEffect(() => {
    const handleGlobalClick = (event) => {
      if (dropDownCategory.current && !dropDownCategory.current.contains(event.target)) {
        setIsOpen(false);
        resetCategoryState();
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);

  const handleSelectedPlacesChange = (places) => {
    setSelectedPlaces(places);
  };

  const maxImages = 10; // Define the maximum number of images allowed
  const maxVideos = 1; // Allow only one video

  const handleImgInputClick = () => {
    document.getElementById('imgUpload').click();
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    const selectedImagesArray = Array.from(files);

    if (selectedImagesArray.length + selectedImages.length > maxImages) {
      alert(`You can only select up to ${maxImages} images.`);
      return;
    }

    const imagePreviewsArray = [];

    selectedImagesArray.forEach((image) => {
      if (!image.type.startsWith('image/')) {
        alert('Only image files are allowed.');
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        imagePreviewsArray.push(e.target.result);
        if (imagePreviewsArray.length === selectedImagesArray.length) {
          setImagePreviews((prevPreviews) => [...prevPreviews, ...imagePreviewsArray]);
          setSelectedImages((prevImages) => [...prevImages, ...selectedImagesArray]);
        }
      };

      reader.readAsDataURL(image);
    });
  };

  const removeImage = (index) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
    setSelectedImages(updatedImages);
  };


  const handleVideoInputClick = () => {
    document.getElementById('videoUpload').click();
  };

  const handleVideoChange = (e) => {
    const files = e.target.files;

    if (files.length > maxVideos) {
      alert(`You can only select up to ${maxVideos} video.`);
      return;
    }

    const video = files[0];

    if (!video.type.startsWith('video/')) {
      alert('Only video files are allowed.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      setVideoPreviews([e.target.result]);
      setSelectedVideos([video]);
    };

    reader.readAsDataURL(video);
  };


  const removeVideo = () => {
    setVideoPreviews([]);
    setSelectedVideos([]);
  };



  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Check if the title is provided and meets the minimum length requirement
    if (!productDetails.product_name) {
      alert('Please enter a title for your listing.');
      return;
    } else if (productDetails.product_name.length < 5) {
      alert('Title must be at least 5 characters long.');
      return;
    }

    // Check if the price is a positive number
    if (!productDetails.price || isNaN(productDetails.price) || productDetails.price <= 0) {
      alert('Please enter a valid price for your listing.');
      return;
    }

    // Check if at least one image is uploaded
    if (selectedImages.length === 0) {
      alert('Please upload at least one image for your listing.');
      return;
    }

    // Handle image URLs
    const imageUrls = await handleFileUpload(selectedImages, 'image');

    // Handle video URL
    const videoUrls = await handleFileUpload(selectedVideos, 'video');

    // Combine image and video URLs into productDetails
    const productDetailsWithFiles = {
      ...productDetails,
      fileUrls: [...imageUrls, ...videoUrls],
      meetupLocations: selectedPlaces.map(place => ({
        placeId: place.placeId,
        name: place.name,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
      })),
    };

    console.log('productDetailsWithFiles:', productDetailsWithFiles)


    // Send the form data (including image URLs) to your backend
    axios.post('/api/addnewproduct', productDetailsWithFiles)
      .then((response) => {
        dispatch(Setloader(true))
        console.log('Product added successfully:', response.data);

        const productId = response.data.id;
        const productName = response.data.product_name;
        window.location.href = `/addlistingsuccess/${productId}/${encodeURIComponent(productName)}`;
      })
      .catch((error) => {
        dispatch(Setloader(false))
        console.error('Error adding the product:', error);
      });
  };


  const ProfilePage = () => {
    window.location.href = `/profile/${userId}`;
  };


  const handleFileUpload = async (files, fileType) => {
    const fileUrls = [];

    const formData = new FormData();
    formData.append('upload_preset', 'auwcvbw0');
    formData.append('cloud_name', 'yogeek-cloudinary');
    formData.append('folder', fileType === 'image' ? 'product_images' : 'product_videos');

    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);

      try {
        dispatch(Setloader(true))
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/yogeek-cloudinary/${fileType}/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          const fileUrl = data.secure_url;
          fileUrls.push(fileUrl);
        } else {
          console.error(`Error uploading ${fileType} to Cloudinary:`, response.statusText);
        }
      } catch (error) {
        console.error(`Error uploading ${fileType} to Cloudinary:`, error.message);
      } finally {
        console.log(`File ${i + 1} processed`);
      }
    }

    console.log(`Final fileUrls array for ${fileType}:`, fileUrls);
    productDetails.fileUrls = fileUrls;
    console.log(`productDetails.fileUrls:`, productDetails.fileUrls);
    return fileUrls;
  };



  return (
    <>
    {!accountVerified && <CompleteProfileModal />}
      <Header />
      <div className="add-listing-body" >

        <form className="container">
          <h3>What are you listing today?</h3>
          <div className="box">
            <div className="col-left">
              <div className="add-media-container">
                <div className="add-image-box">
                  <div className="addlisting-upload-img">
                    <UploadImgIcon />
                  </div>
                  <div>
                    <label htmlFor="imgUpload" className="custom-file-upload">
                      <BtnClear type='button' label='Add Image' className='add-img-btn' onClick={handleImgInputClick} />
                    </label>
                    <input type="file" id="imgUpload" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    <div>(Maximum of 10 photos)</div>
                  </div>
                </div>
                {/* <span className="atleast-one-photo">Add at least 1 photo.</span> */}
                <div className="upload-img-preview-container">
                  {imagePreviews.map((preview, index) => (
                    <div className="upload-img-box" key={index}>
                      <img src={preview} alt={`Img ${index}`} className='upload-img-preview' />
                      <div onClick={() => removeImage(index)} className="upload-img-close"></div>
                    </div>
                  ))}
                </div>
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
                      <label htmlFor="youtubelinkID" className="radio-container">Embed Youtube
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
                      {videoPreviews.length > 0 ? (
                        <div className='video-preview-container'>
                          <video width="498" height='280' controls>
                            <source src={videoPreviews[0]} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          <div className='remove-video-preview' onClick={removeVideo}></div>
                        </div>
                      ) : (
                        <>
                          <label htmlFor='videoUpload'>
                            <button type='button' className='upload-video-box' onClick={handleVideoInputClick}>
                              <div className='addlisting-upload-vid'><UploadVidIcon /></div>
                              <span>Add Video</span>
                            </button>
                          </label>
                          <div>
                            <ul>
                              <li>Min size: 480x480 px. max video length: 60 seconds. max file size: 100MB.</li>
                              <li>Supported Format: mp4</li>
                              <li>New Video might take up to 36 hrs to be approved</li>
                            </ul>
                          </div>
                        </>
                      )}
                      <input
                        type="file"
                        id="videoUpload"
                        accept="video/*"
                        style={{ display: 'none' }}
                        onChange={handleVideoChange}
                      />
                    </div>
                  </div>
                  <div style={{ display: activeRadio === 1 ? 'block' : 'none' }}>
                    <Input
                      name='youtube_link'
                      value={productDetails.youtube_link}
                      placeholder='Paste your Youtube Embed URL here'
                      className='input-youtube-link'
                      onChange={(e) => setProductDetails({ ...productDetails, youtube_link: e.target.value })}
                    />
                    <h6 className='embed-youtube-instructions'>Please follow instructions on how to embed youtube video.</h6>
                    <b>1. Get the Youtube Link:</b>
                    <p>Get the YouTube video ID from the video URL. For example, in the URL <span className='youtube-link'>https://www.youtube.com/watch?v=VIDEO_ID</span>, <span className='video-id'>"VIDEO_ID"</span> is the actual video ID.</p>

                    <b>2. Create Youtube Embed URL:</b>
                    <p>Use the YouTube video ID to create the YouTube embed URL. See sample URL below.</p>
                    <span className='sample-embed-url-label'>Sample Youtube Embed URL:</span>
                    <p className='sample-embed-url'>https://youtube.com/embed/VIDEO_ID</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-right">
              <div className="select-category-container">
                <div className='wrapper' ref={dropDownCategory}>
                  <div className={`select-arrow ${isOpen ? 'active' : ''}`} onClick={toggleDropdown}></div>
                  <div className="dropdown-category">
                    <input type="text" id='selectCategory' value={selectedOption} placeholder='Select Category' readOnly />
                  </div>
                  {isOpen && (
                    <div className="category-option-list">
                      <ul>
                        <li>
                          <div className='search-container'>
                            <input type="text" placeholder='Search Categories' value={searchTerm} onChange={handleSearchChange} />
                            <div className='magnifying-glass'><MagnifyingGlass /></div>
                          </div>
                        </li>
                        {categories.map((category) => {
                          if (!category.label.toLowerCase().includes(searchTerm.toLowerCase())) {
                            return null; // Skip rendering if not matching the search term
                          }
                          return (
                            <li key={category.value} className='main-category'>
                              <div
                                className={`parent-category ${category.subcategories.length > 0 ? "collapsible" : ""} ${category.isOpen && category.subcategories.length > 0 ? "active" : ""}`}
                                onClick={() => {
                                  if (category.subcategories.length === 0) {
                                    handleOptionClick(category.label);
                                  } else {
                                    handleCategoryClick(category);
                                  }
                                }}
                              >
                                <img src={category.icon} alt="" />
                                {category.label}
                              </div>
                              {category.isOpen && category.subcategories && category.subcategories.length > 0 ? (
                                <ul className='sub-category'>
                                  {category.subcategories.map((subcategory) => (
                                    <li key={subcategory.value}>
                                      <div className={`first-level-sub-category ${subcategory.subcategories.length > 0 ? "collapsible" : ""} ${subcategory.isOpen && subcategory.subcategories.length > 0 ? "active" : ""}`}
                                        onClick={() => {
                                          if (subcategory.subcategories.length === 0) {
                                            handleOptionClick(subcategory.label);
                                          } else {
                                            handleSubcategoryClick(subcategory, category);
                                          }
                                        }}>
                                        {subcategory.label}
                                      </div>

                                      {subcategory.isOpen && subcategory.subcategories && subcategory.subcategories.length > 0 ? (
                                        <ul className='sub-sub-category'>
                                          {subcategory.subcategories.map((subsubcategory) => (
                                            <li key={subsubcategory.value}>
                                              <div className="second-level-sub-category" onClick={() => handleOptionClick(subsubcategory.label)}>
                                                {subsubcategory.label}
                                              </div>
                                            </li>
                                          ))}
                                        </ul>
                                      ) : null}
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>

                {selectedOption === 'Nike' && (
                  <div>
                    <h3>Nike</h3>
                  </div>
                )}

                {selectedOption === 'Adidas' && (
                  <div>
                    <h3>Adidas</h3>
                    {/* Render your Form 2 component here */}
                  </div>
                )}

                {selectedOption === 'New Balance' && (
                  <div>
                    <h3>New Balance</h3>
                    {/* Render your Form 3 component here */}
                  </div>
                )}

                {selectedOption && selectedOption !== 'Nike' && selectedOption !== 'Adidas' && selectedOption !== 'New Balance' && (
                  <div className="add-prod-details-form">
                    <input type="hidden" name="category_id" value={productDetails.category_id} onChange={(e) => setProductDetails({ ...productDetails, category_id: e.target.value })} />
                    <div>
                      <label>Title</label>
                      <Input
                        type='text'
                        id='listingTitleID'
                        name='product_name'
                        value={productDetails.product_name}
                        className='listing-input-field'
                        placeholder='Listing Title'
                        onChange={(e) => setProductDetails({ ...productDetails, product_name: e.target.value })}

                      />
                    </div>
                    <h3>About the item</h3>
                    <div>
                      <label>Condition</label>
                      <div className="product-conditions">
                        <RadioButton
                          id="brandNewID"
                          name="product_condition"
                          value="Brand New"
                          label="Brand New"
                          checked={condition === 'Brand New'}
                          onChange={handleConditionChange}
                        />
                        <RadioButton
                          id="likeNewID"
                          name="product_condition"
                          value="Like New"
                          label="Like New"
                          checked={condition === 'Like New'}
                          onChange={handleConditionChange}
                        />
                        <RadioButton
                          id="lightlyUsedID"
                          name="product_condition"
                          value="Lightly Used"
                          label="Lightly Used"
                          checked={condition === 'Lightly Used'}
                          onChange={handleConditionChange}
                        />
                        <RadioButton
                          id="wellUsedID"
                          name="product_condition"
                          value="Well Used"
                          label="Well Used"
                          checked={condition === 'Well Used'}
                          onChange={handleConditionChange}
                        />
                        <RadioButton
                          id="heavilyUsedID"
                          name="product_condition"
                          value="Heavily Used"
                          label="Heavily Used"
                          checked={condition === 'Heavily Used'}
                          onChange={handleConditionChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label>Price</label>
                      <div className="listing-price-container">
                        <div className="listing-currency">₱</div>
                        <Input
                          type='number'
                          id='listingPriceID'
                          name='price'
                          value={productDetails.price}
                          className='listing-price-input-field'
                          placeholder='Price of your listing'
                          onChange={(e) => setProductDetails({ ...productDetails, price: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label>Description</label>
                      <div>
                        <QuillEditor
                          id='listingDescID'
                          name='description'
                          className='listing-description'
                          value={productDetails.description}
                          onChange={handleDescriptionChange}
                        />
                      </div>
                      {/* <div>
                        <TextArea
                          id='listingDescID'
                          name='description'
                          value={productDetails.description}
                          className='listing-description'
                          placeholder="Type the details of your product here..."
                          rows='7'
                          onChange={(e) => setProductDetails({ ...productDetails, description: e.target.value })}
                        />
                      </div> */}
                    </div>
                    <h3>Deal Method</h3>
                    <div>
                      <label>Meet Up</label><span style={{ fontSize: '14px' }}> (Maximum of 4 locations)</span>
                      <MeetUpSelector onSelectedPlacesChange={handleSelectedPlacesChange} />
                    </div>
                    <div>
                      <label>Mailing & Delivery</label>
                      <div className='delivery-options'>
                        <div className='delivery-options-col1'>
                          <CheckBox
                            label='Lalamove'
                            value='Lalamove'
                            onChange={handleCheckboxDeliveryChange}
                          />
                          <CheckBox
                            label='Grab Express'
                            value='Grab Express'
                            onChange={handleCheckboxDeliveryChange}
                          />
                          <CheckBox
                            label='Ninja Van'
                            value='Ninja Van'
                            onChange={handleCheckboxDeliveryChange}
                          />
                        </div>
                        <div className='delivery-options-col2'>
                          <CheckBox
                            label='LBC'
                            value='LBC'
                            onChange={handleCheckboxDeliveryChange}
                          />
                          <CheckBox
                            label='J&T'
                            value='J&T'
                            onChange={handleCheckboxDeliveryChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='update-listing-btns'>
                      <BtnGreen label='List Now' onClick={handleFormSubmit} className='list-now-btn' />
                      <BtnClear type='button' label='Cancel' onClick={ProfilePage} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddListing;
