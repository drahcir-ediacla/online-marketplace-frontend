import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile, updateUserProfile } from '../../redux/actions/userActions';
import { Setloader } from '../../redux/reducer/loadersSlice';
import './style.scss';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import ManageAccountNav from '../../layouts/ManageAccountNav';
import { ReactComponent as ToolTip } from '../../assets/images/tool-tip.svg';
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
import AlertMessage from '../../components/AlertMessage';



const EditProfile = () => {

  const [showAlert, setShowAlert] = useState(false);
  const user = useSelector((state) => state.user.data);
  const error = useSelector((state) => state.user.error);
  const dispatch = useDispatch();







  const [updatedUserData, setUpdatedUserData] = useState({
    email: '',
    display_name: '',
    bio: '',
    first_name: '',
    last_name: '',
    country: '',
    region: '',
    city: '',
    phone: '',
    gender: '',
    birthday: '',
    profile_pic: '',
  });


 

  useEffect(() => {
    // Fetch the user's data when the component mounts
    dispatch(fetchUserProfile());
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
        phone: user.phone || '',
        gender: user.gender || '',
        birthday: user.birthday || '',
        profile_pic: user.profile_pic || '',
      });
      // Set selectedCity when user data is available
      setSelectedRegion(user.region || ''); 
      setSelectedCity(user.city || '');
    }
  }, [user]);

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const handleRegionChange = (event) => {
    const selectedRegion = event.target.value;
    setSelectedRegion(selectedRegion);
    setSelectedCity('');

    // Update the updatedUserData with the selected region
    setUpdatedUserData({
      ...updatedUserData,
      region: selectedRegion,
    });
  };

  const handleCityChange = (event) => {
    const selectedCity = event.target.value;
    setSelectedCity(selectedCity);

    // Update the updatedUserData with the selected city
    setUpdatedUserData({
      ...updatedUserData,
      city: selectedCity,
    });
  };


  const handleFileInputClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'auwcvbw0');
      formData.append('cloud_name', 'yogeek-cloudinary');
      formData.append('folder', 'profile_picture');


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
      } else {
        console.error('Image upload failed.');
      }
    } catch (error) {
      console.error('Error uploading image to Cloudinary', error);
    }
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData({ ...updatedUserData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Dispatch the action to update the user's profile
      dispatch(Setloader(true));
      dispatch(updateUserProfile(updatedUserData));

      // Fetch the updated user's data after the update
      dispatch(fetchUserProfile());

      // Show a success message or redirect the user to a different page upon successful update
      // (You can handle this as per your application's requirements)
      setShowAlert(true);


    } catch (error) {
      // Handle any errors, which are already handled in the action
    } finally {
      dispatch(Setloader(false)); // Move this line here to ensure it's always called
    }
  };

  return (
    <>
      {showAlert && <AlertMessage type="success" message="Profile updated successfully" />}
      <Header />
      <div className="edit-profile-body">
        <div className="container">
          <h3>Manage Account</h3>
          <div className="box">
            <div className="col-left"><ManageAccountNav className='active' /></div>
            <div className="col-right">
              <form className="edit-profile-form" onSubmit={handleFormSubmit}>
                <div className='row1'>
                  <h5>Edit Profile</h5>
                  <hr />
                  {error && <div className="error">{error}</div>}
                </div>
                <div className='row2'>
                  <div className='col1'><img src={updatedUserData.profile_pic || ProfileAvatar} alt="" className='profile-pic' /></div>
                  <div className='col2'>
                    <div>Buyers and sellers can learn a lot about each other by looking at clear frontal face photos.</div>
                    <label htmlFor="fileInput" className="custom-file-upload">
                      <div><BtnClear type="button" label="Choose Photo" onClick={handleFileInputClick} /></div>
                    </label>
                    <input type="file" id="fileInput" accept="image/png, image/jpg, image/jpeg" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </div>
                </div>
                <div className='row3 flex'>
                  <label htmlFor='displaynameID' className='field-name'>DISPLAY NAME / SHOP NAME <ToolTip /> <span className='asterisk'>*</span></label >
                  <div>
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
                  <label htmlFor='bioID' className='field-name'>BIO</label>
                  <div>
                    <TextArea
                      id='bioID'
                      name='bio'
                      placeholder="Write some introduction about your profile"
                      value={updatedUserData.bio}
                      className='profile-data-textarea'
                      onChange={handleInputChange}
                      rows='5' />
                    <br /><small>0/255</small></div>
                </div>
                <div className='row5 flex'>
                  <label htmlFor='firstnameID' className='field-name'>FIRST NAME <span className='asterisk'>*</span></label>
                  <div>
                    <Input
                      type='text'
                      id='firstnameID'
                      name='first_name'
                      placeholder="Enter First Name"
                      value={updatedUserData.first_name}
                      className='profile-data-input'
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className='row6 flex'>
                  <label htmlFor='lastnameID' className='field-name'>LAST NAME <span className='asterisk'>*</span></label>
                  <div>
                    <Input
                      type='text'
                      id='lastnameID'
                      name='last_name'
                      placeholder="Enter Last Name"
                      value={updatedUserData.last_name}
                      className='profile-data-input'
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <hr />
                <div className='row7'>
                  <div className='field-name'>LOCATION</div>
                </div>
                <div className='row8 flex'>
                  <label htmlFor='countryID' className='field-name'>Country</label>
                  <div>
                    <Input
                      type='text'
                      id='countryID'
                      name='country'
                      value={updatedUserData.country || 'Philippines'}
                      className='profile-data-input'
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                </div>
                <div className='row9 flex'>
                  <label htmlFor='regionID' className='field-name'>Region</label>
                  <div>
                    <DependentSelect
                      id="regionID"
                      name='region'
                      value={selectedRegion}
                      data={Object.keys(userLocationData)}
                      defaultOption="Select your region --"
                      onChange={handleRegionChange}
                      className='profile-data-select'
                    />
                  </div>
                </div>
                <div className='row10 flex'>
                  <label htmlFor='cityID' className='field-name'>City</label>
                  <div>
                    <DependentSelect
                      id="cityID"
                      name="city"
                      value={selectedCity}
                      data={selectedRegion ? userLocationData[selectedRegion] : []}
                      defaultOption="Select your city --"
                      noOptionCaption="Please choose your region first --"
                      onChange={handleCityChange}
                      className='profile-data-select'
                    />
                  </div>
                </div>
                <hr />
                <div className='row11'>
                  <div className='field-name'>PRIVATE INFORMATION</div>
                  <small>We do not share this information with other users unless explicit permission is given by you.</small>
                </div>
                <div className='row12 flex'>
                  <label htmlFor="emailID" className='field-name'>Email <span className='asterisk'>*</span></label>
                  <div>
                    <Input
                      type="email"
                      id="emailID"
                      name="email"
                      placeholder="Enter Your Email"
                      value={updatedUserData.email}
                      className='profile-data-input'
                      onChange={handleInputChange}
                      readOnly
                    /></div>
                </div>
                <div className='row13 flex'>
                  <label htmlFor="phoneID" className='field-name'>Phone Number <span className='asterisk'>*</span></label>
                  <div>
                    <Input
                      type="text"
                      id="phoneID"
                      name="phone"
                      placeholder="Enter Phone Number"
                      value={updatedUserData.phone}
                      className='profile-data-input'
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className='row14 flex'>
                  <label htmlFor="genderID" className='field-name'>Gender</label>
                  <div>
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
                  <div>
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