import React, { useState, useEffect, useRef } from 'react';
import axios from '../../apicalls/axios'
import './style.scss';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import { ReactComponent as MagnifyingGlass } from "../../assets/images/magnifying-glass.svg";
import { ReactComponent as UploadImgIcon } from '../../assets/images/upload-img-icon.svg';
import { ReactComponent as UploadVidIcon } from '../../assets/images/upload-vid-icon.svg';
import Input from '../../components/FormField/Input';
import RadioButton from '../../components/FormField/RadioButton'
import TextArea from '../../components/FormField/TextArea'
import CheckBox from '../../components/FormField/CheckBox/CheckBox'
import CheckboxWithTextarea from '../../components/FormField/CheckBox/CheckboxWithTextarea'
import BtnGreen from '../../components/Button/BtnGreen'

const AddListing = () => {

  const [activeRadio, setActiveRadio] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const dropDownCategory = useRef(null);
  const [condition, setCondition] = useState('Brand New');
  const [productDetails, setProductDetails] = useState({
    product_name: '',
    description: '',
    price: 0, // You can set a default value
    category_id: '', // Set the selected category's ID here
    product_condition: 'Brand New',
    youtube_link: '',
  });

  const openContent = (radioIndex) => {
    setActiveRadio(radioIndex);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  }

  const handleOptionClick = (option) => {
    // Find the category or subcategory object based on the selectedOption
    let selectedCategory = categories.find((category) => category.label === option);
  
    // If the selectedOption is not found in the top-level categories, search subcategories
    if (!selectedCategory) {
      for (const category of categories) {
        selectedCategory = category.subcategories.find((subcategory) => subcategory.label === option);
        if (selectedCategory) {
          break;
        }
      }
    }
  
    if (selectedCategory) {
      setSelectedOption(option); // Update the selectedOption
      setProductDetails({
        ...productDetails,
        category_id: selectedCategory.id, // Set the category ID
      });
    }
  
    setIsOpen(false);
  };
  

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  }

  const handleConditionChange = (event) => {
    const selectedCondition = event.target.value;
    setCondition(selectedCondition); // Update the local state
  
    setProductDetails({
      ...productDetails,
      product_condition: selectedCondition, // Set the product_condition in productDetails
    });
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
    axios.get("/api/getproductcategories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching data:", error));
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


  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    axios.post("/api/addnewproduct", productDetails)
      .then((response) => {
        console.log("Product added successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });
  };

  
  

  return (
    <>

      <Header />
      <div className="add-listing-body">
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
                    <Input name='youtube_link' value={productDetails.youtube_link} placeholder='Paste your Youtube URL link here' className='input-youtube-link' onChange={(e) => setProductDetails({ ...productDetails, youtube_link: e.target.value })} />
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
                        <TextArea
                          id='listingDescID'
                          name='description'
                          value={productDetails.description}
                          className='listing-description'
                          placeholder="Type the details of your product here..."
                          rows='7'
                          onChange={(e) => setProductDetails({ ...productDetails, description: e.target.value })}
                        />
                      </div>
                    </div>
                    <h3>Deal Method</h3>
                    <div>
                      <CheckBox label='Meet Up' />
                      <CheckboxWithTextarea label='Mailing & Delivery' />
                    </div>
                    <BtnGreen label='List Now' onClick={handleFormSubmit} />
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
