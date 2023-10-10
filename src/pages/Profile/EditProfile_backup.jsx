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
import DatePicker from '../../components/FormField/DatePicker';
import regionData from '../../data/regionData';
import cityData from '../../data/cityData';
import genderData from '../../data/genderData';


const EditProfile = () => {

  const handleOptionSelect = (value) => {
    console.log('Selected value:', value);
  };

  const user = useSelector((state) => state.user.data);
  const error = useSelector((state) => state.user.error);
  const dispatch = useDispatch();

 

  // Check if the user object is null before accessing its properties
  const display_name = user?.display_name || ''; // Default to an empty string if user is null

  const [updatedUserData, setUpdatedUserData] = useState({
    display_name, // Use the value obtained from user or an empty string
    email: user?.email || '', // Default to an empty string if user is null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData({ ...updatedUserData, [name]: value });
  };


  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(Setloader(true));
      // Dispatch the action to update the user's profile
      dispatch(updateUserProfile(updatedUserData));

      // Show a success message or redirect the user to a different page upon successful update
      // (You can handle this as per your application's requirements)
      dispatch(Setloader(false));

    } catch (error) {
      dispatch(Setloader(false));
      // Handle any errors, which are already handled in the action
    }
  };

  // Check if user is null before rendering user data
  if (user === null) {
    dispatch(Setloader(true))
    return;
  }
  else {
    dispatch(Setloader(false))
  }

  return (
    <>
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
                  <div className='col1'><img src={ProfileAvatar} alt="" /></div>
                  <div className='col2'>
                    <div>Buyers and sellers can learn a lot about each other by looking at clear frontal face photos.</div>
                    <div><BtnClear label="Upload Photo" /></div>
                  </div>
                </div>
                <div className='row3 flex'>
                  <label htmlFor='displaynameID' className='field-name'>DISPLAY NAME / SHOP NAME <ToolTip /> <span className='asterisk'>*</span></label >
                  <div><Input
                    type='text'
                    id='displaynameID'
                    name='displayname'
                    value={updatedUserData.display_name}
                    className='profile-data-input'
                    onChange={handleInputChange}
                  /></div>
                </div>
                <div className='row4 flex'>
                  <div className='field-name'>BIO</div>
                  <div><TextArea className='profile-data-textarea' rows='5' /><br /><small>0/255</small></div>
                </div>
                <div className='row5 flex'>
                  <div className='field-name'>FIRST NAME <span className='asterisk'>*</span></div>
                  <div><Input className='profile-data-input' /></div>
                </div>
                <div className='row6 flex'>
                  <div className='field-name'>LAST NAME <span className='asterisk'>*</span></div>
                  <div><Input className='profile-data-input' /></div>
                </div>
                <hr />
                <div className='row7'>
                  <div className='field-name'>LOCATION</div>
                </div>
                <div className='row8 flex'>
                  <div className='field-name'>Country</div>
                  <div>
                    <input type="text" placeholder='Philippines' disabled />
                  </div>
                </div>
                <div className='row9 flex'>
                  <div className='field-name'>Region</div>
                  <div>
                    <Select data={regionData} onSelect={handleOptionSelect} className='profile-data-select' />
                  </div>
                </div>
                <div className='row10 flex'>
                  <div className='field-name'>City</div>
                  <div>
                    <Select data={cityData} onSelect={handleOptionSelect} className='profile-data-select' />
                  </div>
                </div>
                <hr />
                <div className='row11'>
                  <div className='field-name'>PRIVATE INFORMATION</div>
                  <small>We do not share this information with other users unless explicit permission is given by you.</small>
                </div>
                <div className='row12 flex'>
                  <label htmlFor="emailID" className='field-name'>Email <span className='asterisk'>*</span></label>
                  <div><Input
                    type="email"
                    id="emailID"
                    name="email"
                    value={updatedUserData.email}
                    className='profile-data-input'
                    onChange={handleInputChange}
                  /></div>
                </div>
                <div className='row13 flex'>
                  <div className='field-name'>Phone Number <span className='asterisk'>*</span></div>
                  <div><Input className='profile-data-input' /></div>
                </div>
                <div className='row14 flex'>
                  <div className='field-name'>Gender</div>
                  <div>
                    <Select data={genderData} onSelect={handleOptionSelect} className='profile-data-select' />
                  </div>
                </div>
                <div className='row15 flex'>
                  <div className='field-name'>Birthday</div>
                  <div>
                    <DatePicker className='birthday-date' />
                  </div>
                </div>
                <div></div>
                <div><BtnGreen label='Save Changes' onClick={handleFormSubmit} /></div>
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
