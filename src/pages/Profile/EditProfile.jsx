import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser, updateUser } from '../../redux/actions/userActions';
import { Setloader } from '../../redux/reducer/loadersSlice';
import './style.scss';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import ManageAccountNav from '../../layouts/ManageAccountNav';
import ProfileAvatar from '../../assets/images/profile-avatar.png';
import BtnClear from '../../components/Button/BtnClear';
import BtnGreen from '../../components/Button/BtnGreen';
import Input from '../../components/FormField/Input';
import TextArea from '../../components/FormField/TextArea';
import Select from '../../components/FormField/Select';
import DependentSelect from '../../components/FormField/DependentSelect';
import DatePicker from '../../components/FormField/DatePicker';
import genderData from '../../data/genderData';
import userLocationData from '../../data/userLocationData.json'
import locationData from '../../data/locationData.json'
import AlertMessage from '../../components/AlertMessage';
import { ReactComponent as ImageLoadingSpinner } from "../../assets/images/loading-spinner.svg";



const EditProfile = () => {

  const [requiredFieldErrors, setRequiredFieldErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const user = useSelector((state) => state.user.data);
  const error = useSelector((state) => state.user.error);
  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false)
  const [coverPhotoSpinner, setCoverPhotoSpinner] = useState(false)

  const [updatedUserData, setUpdatedUserData] = useState({
    email: '',
    display_name: '',
    bio: '',
    first_name: '',
    last_name: '',
    country: '',
    region: '',
    city: '',
    latitude: '',
    longitude: '',
    phone: '',
    gender: '',
    birthday: '',
    profile_pic: '',
    cover_photo: '',
  });

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    // Set the loader to true when data fetching starts
    dispatch(Setloader(true));

    // Fetch the user's data
    dispatch(getUser())
      .then(() => {
        // Set the loader to false when data fetching is complete
        dispatch(Setloader(false));
      })
      .catch(error => {
        console.error("Error fetching user profile:", error);
        dispatch(Setloader(false));
      });
  }, [dispatch]);



  // Update the local state when user data changes
  useEffect(() => {
    if (user) {
      setUpdatedUserData({
        email: user.email || '',
        display_name: user.display_name || '',
        bio: user.bio || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        country: user.country || '',
        region: user.region || '',
        city: user.city || '',
        latitude: user.latitude || '',
        longitude: user.longitude || '',
        phone: user.phone || '',
        gender: user.gender || '',
        birthday: user.birthday || '',
        profile_pic: user.profile_pic || '',
        cover_photo: user.cover_photo || '',
      });
      // Set selectedCity when user data is available
      setSelectedRegion(user.region || '');
      setSelectedCity(user.city || '');
    }
  }, [user]);
  console.log('User Latitude:', user.latitude)



  const handleRegionChange = (event) => {
    const selectedRegion = event.target.value;
    setSelectedRegion(selectedRegion);
    setSelectedCity('');
    setUpdatedUserData({ ...updatedUserData, region: selectedRegion });
  };

  const handleCityChange = (event) => {
    const selectedCity = event.target.value;
    const coordinates = getCoordinates(selectedRegion, selectedCity);
    setSelectedCity(selectedCity);
    setUpdatedUserData({ 
      ...updatedUserData, 
      city: selectedCity,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    });
  };

  const getCoordinates = (region, city) => {
    if (locationData[region] && locationData[region][city]) {
      return locationData[region][city];
    }
    return null;
  };


  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    try {
      setShowSpinner(true)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'auwcvbw0');
      formData.append('cloud_name', 'yogeek-cloudinary');
      formData.append('folder', 'cover_photo');


      const response = await fetch(
        `https://api.cloudinary.com/v1_1/yogeek-cloudinary/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.secure_url;

        // Update the profile_pic property in the local state
        setUpdatedUserData({
          ...updatedUserData,
          profile_pic: imageUrl,
        });
        setShowSpinner(false)
      } else {
        setShowSpinner(false)
        console.error('Image upload failed.');
      }
    } catch (error) {
      setShowSpinner(false)
      console.error('Error uploading image to Cloudinary', error);
    }
  };

  const handleProfileImgClick = () => {
    document.getElementById('profileImage').click();
  };

  const handleRemoveProfileImage = () => {
    // Remove the profile_pic property from the local state
    setUpdatedUserData({
      ...updatedUserData,
      profile_pic: '',
    });
  };


  const handleCoverPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    try {
      setCoverPhotoSpinner(true)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'auwcvbw0');
      formData.append('cloud_name', 'yogeek-cloudinary');
      formData.append('folder', 'cover_photo');


      const response = await fetch(
        `https://api.cloudinary.com/v1_1/yogeek-cloudinary/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.secure_url;

        // Update the profile_pic property in the local state
        setUpdatedUserData({
          ...updatedUserData,
          cover_photo: imageUrl,
        });
        setCoverPhotoSpinner(false)
      } else {
        setCoverPhotoSpinner(false)
        console.error('Image upload failed.');
      }
    } catch (error) {
      setCoverPhotoSpinner(false)
      console.error('Error uploading image to Cloudinary', error);
    }
  };


  const handleCoverPhotoClick = () => {
    document.getElementById('coverPhoto').click();
  };

  const handleRemoveCoverPhoto = () => {
    // Remove the profile_pic property from the local state
    setUpdatedUserData({
      ...updatedUserData,
      cover_photo: '',
    });
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Limit the character count to 255
    const truncatedValue = value.slice(0, 255);
    setUpdatedUserData({ ...updatedUserData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    

    // Check for required fields
    const requiredFields = ['first_name', 'last_name', 'region', 'city', 'email'];
    const errors = {};
    let hasErrors = false;

    requiredFields.forEach((field) => {
      if (!updatedUserData[field]) {
        errors[field] = `${field.replace('_', ' ').toUpperCase()} is required`;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setRequiredFieldErrors(errors);
      return;
    }

    try {
      // Dispatch the action to update the user's profile
      dispatch(Setloader(true));
      dispatch(updateUser(updatedUserData));

      // Fetch the updated user's data after the update
      dispatch(getUser());

      // Show a success message or redirect the user to a different page upon successful update
      // (You can handle this as per your application's requirements)
      setShowAlert(true);

    } catch (error) {
      // Handle any errors, which are already handled in the action
    } finally {
      dispatch(Setloader(false)); // Move this line here to ensure it's always called
      setRequiredFieldErrors({}); // Clear validation errors
    }
  };


  const maxCharacterCount = 255;

  // Apply a class to change font color if character count exceeds 255
  const counterClassName =
    updatedUserData.bio.length > maxCharacterCount ? 'counter-exceeded' : '';

    const openManageAccountNav = () => {
      window.location.href = '/manage-account'
    }



  return (
    <>
      {showAlert && <AlertMessage type="success" message="Profile updated successfully" />}
      <Header />
      <div className="edit-profile-body" id='edit-profile-body'>
        <div className="container">
          <h3>Manage Account</h3>
          <div className="box">
            <div className="col-left"><ManageAccountNav className='active' /></div>
            <div className="col-right">
              <form className="edit-profile-form" onSubmit={handleFormSubmit}>
                <div className='row1'>
                  <div className="back-arrow" onClick={openManageAccountNav}></div>
                  <h5>ACCOUNT INFORMATION</h5>
                  <hr />
                  {error && <div className="error">{error}</div>}
                </div>
                {!updatedUserData.cover_photo ? (
                  <>
                    <div className="cover-photo-container">
                      <div className='cover-photo-buttons'>
                        {coverPhotoSpinner ? (
                          <div className='image-loading-spinner'><ImageLoadingSpinner /></div>
                        ) : (
                          <div className='cover-photo-recommended-size'>
                            <BtnClear type="button" label="Upload Cover Photo" onClick={handleCoverPhotoClick} />
                            <p>Cover photo recommended size is 1320 x 250 pixel</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="cover-photo-container">
                      <img src={updatedUserData.cover_photo} alt="" />
                      <div className='cover-photo-buttons'>
                        <BtnClear type="button" label="Update Cover Photo" className='cover-photo-btn' onClick={handleCoverPhotoClick} />
                        <BtnClear type="button" label="Remove Cover Photo" className='cover-photo-btn' onClick={handleRemoveCoverPhoto} />
                      </div>
                    </div>
                  </>
                )}
                <input type="file" id="coverPhoto" accept="image/png, image/jpg, image/jpeg" onChange={handleCoverPhotoUpload} style={{ display: 'none' }} />
                <div className='row2'>
                  <div className='col1'>
                    {showSpinner ? (
                      <div className='image-loading-spinner'><ImageLoadingSpinner /></div>
                    ) : (
                      <img src={updatedUserData.profile_pic || ProfileAvatar} alt="" className='profile-pic' />
                    )}
                  </div>
                  <div className='col2'>
                    <div>Buyers and sellers can learn a lot about each other by looking at clear frontal face photos.</div>
                    <div className='profile-pic-buttons'>
                      {!updatedUserData.profile_pic ? (
                        <BtnClear type="button" label="Upload Photo" onClick={handleProfileImgClick} />
                      ) : (
                        <>
                          <BtnClear type="button" label="Update Photo" onClick={handleProfileImgClick} />
                          <BtnClear type="button" label="Remove Photo" onClick={handleRemoveProfileImage} />
                        </>
                      )}
                    </div>
                    <input type="file" id="profileImage" accept="image/png, image/jpg, image/jpeg" onChange={handleProfileImageUpload} style={{ display: 'none' }} />
                  </div>
                </div>

                <div className='row3 flex'>
                  <label htmlFor='displaynameID' className='field-name tool-tip'>DISPLAY NAME / SHOP NAME</label>
                  <div className='form-field-container'>
                    <Input
                      type='text'
                      id='displaynameID'
                      name='display_name'
                      value={updatedUserData.display_name}
                      className='profile-data-input'
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className='row4 flex'>
                  <label htmlFor='bioID' className='field-name tool-tip'>BIO</label>
                  <div className='form-field-container'>
                    <TextArea
                      id='bioID'
                      name='bio'
                      placeholder="Write some introduction about your profile"
                      value={updatedUserData.bio}
                      className='profile-data-textarea'
                      onChange={handleInputChange}
                      rows='5' />
                    <br />
                    <small className={counterClassName}>{`${updatedUserData.bio.length}/${maxCharacterCount}`}</small>
                  </div>
                </div>
                <div className='row5 flex'>
                  <label htmlFor='firstnameID' className='field-name'>FIRST NAME <span className='asterisk'>*</span></label>
                  <div className='form-field-container'>
                    <Input
                      type='text'
                      id='firstnameID'
                      name='first_name'
                      placeholder="Enter First Name"
                      value={updatedUserData.first_name}
                      className='profile-data-input'
                      onChange={handleInputChange}
                    />
                    {requiredFieldErrors.first_name && <div className="errmsg">{requiredFieldErrors.first_name}</div>}
                  </div>
                </div>
                <div className='row6 flex'>
                  <label htmlFor='lastnameID' className='field-name'>LAST NAME <span className='asterisk'>*</span></label>
                  <div className='form-field-container'>
                    <Input
                      type='text'
                      id='lastnameID'
                      name='last_name'
                      placeholder="Enter Last Name"
                      value={updatedUserData.last_name}
                      className='profile-data-input'
                      onChange={handleInputChange}
                    />
                    {requiredFieldErrors.last_name && <div className="errmsg">{requiredFieldErrors.last_name}</div>}
                  </div>
                </div>
                <hr />
                <div className='row7'>
                  <div className='field-name'>LOCATION</div>
                </div>
                <div className='row8 flex'>
                  <label htmlFor='countryID' className='field-name'>Country</label>
                  <div className='form-field-container'>
                    <Input
                      type='text'
                      id='countryID'
                      name='country'
                      value='Philippines'
                      className='profile-data-input'
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                </div>
                <div className='row9 flex'>
                  <label htmlFor='regionID' className='field-name'>Region <span className='asterisk'>*</span></label>
                  <div className='form-field-container'>
                    <DependentSelect
                      id="regionID"
                      name='region'
                      value={selectedRegion}
                      data={Object.keys(locationData)}
                      defaultOption="Select your region --"
                      onChange={handleRegionChange}
                      className='profile-data-select'
                    />
                    {requiredFieldErrors.region && <div className="errmsg">{requiredFieldErrors.region}</div>}
                  </div>
                </div>
                <div className='row10 flex'>
                  <label htmlFor='cityID' className='field-name'>City <span className='asterisk'>*</span></label>
                  <div className='form-field-container'>
                    <DependentSelect
                      id="cityID"
                      name="city"
                      value={selectedCity}
                      data={selectedRegion ? Object.keys(locationData[selectedRegion]) : []}
                      defaultOption="Select your city --"
                      noOptionCaption="Please choose your region first --"
                      onChange={handleCityChange}
                      className='profile-data-select'
                    />
                    {requiredFieldErrors.city && <div className="errmsg">{requiredFieldErrors.city}</div>}
                  </div>
                </div>
                <hr />
                <div className='row11'>
                  <div className='field-name'>PRIVATE INFORMATION</div>
                  <small>We do not share this information with other users unless explicit permission is given by you.</small>
                </div>
                <div className='row12 flex'>
                  <label htmlFor="emailID" className='field-name'>Email <span className='asterisk'>*</span></label>
                  <div className='form-field-container'>
                    <Input
                      type="email"
                      id="emailID"
                      name="email"
                      placeholder="Enter Your Email"
                      value={updatedUserData.email}
                      className='profile-data-input'
                      onChange={handleInputChange}
                      readOnly
                    />
                    {requiredFieldErrors.email && <div className="errmsg">{requiredFieldErrors.email}</div>}
                  </div>
                </div>
                <div className='row13 flex'>
                  <label htmlFor="phoneID" className='field-name'>Phone Number</label>
                  <div className='form-field-container'>
                    <Input
                      type="number"
                      id="phoneID"
                      name="phone"
                      placeholder="Enter Phone Number"
                      value={updatedUserData.phone}
                      className='profile-data-input input-phone'
                      onChange={handleInputChange}
                    />
                    <div className="plus63">+63</div>
                  </div>
                </div>
                <div className='row14 flex'>
                  <label htmlFor="genderID" className='field-name'>Gender</label>
                  <div className='form-field-container'>
                    <Select
                      id="genderID"
                      name="gender"
                      defaultOption='Please select your gender --'
                      value={updatedUserData.gender}
                      data={genderData}
                      onChange={handleInputChange}
                      className='profile-data-select' />
                  </div>
                </div>
                <div className='row15 flex'>
                  <label htmlFor="birthdayID" className='field-name'>Birthday</label>
                  <div className='form-field-container'>
                    <DatePicker
                      id="birthdayID"
                      name="birthday"
                      value={updatedUserData.birthday}
                      className='birthday-date'
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div></div>
                <div><BtnGreen label='Save Changes' onClick={() => setShowAlert(false)} /></div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default EditProfile