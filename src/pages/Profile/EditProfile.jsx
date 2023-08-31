import React from 'react'
import './style.scss'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import ManageAccountNav from '../../layouts/ManageAccountNav'
import { ReactComponent as ToolTip } from '../../assets/images/tool-tip.svg'
import ProfileAvatar from '../../assets/images/profile-avatar.png'
import BtnClear from '../../components/Button/BtnClear'
import BtnGreen from '../../components/Button/BtnGreen'
import Input from '../../components/FormField/Input'
import TextArea from '../../components/FormField/TextArea'
import Select from '../../components/FormField/Select'
import DatePicker from '../../components/FormField/DatePicker'
import regionData from '../../data/regionData'
import cityData from '../../data/cityData'
import genderData from '../../data/genderData'

const EditProfile = () => {

  const handleOptionSelect = (value) => {
    console.log('Selected value:', value);
  };

  return (
    <>
      <Header />
      <div className="edit-profile-body">
        <div className="container">
            <h3>Manage Account</h3>
            <div className="box">
                <div className="col-left"><ManageAccountNav /></div>
                <div className="col-right">
                  <form className="edit-profile-form">
                    <div className='row1'>
                      <h5>Edit Profile</h5>
                      <hr />
                    </div>
                    <div className='row2'>
                      <div className='col1'><img src={ProfileAvatar} alt="" /></div>
                      <div className='col2'>
                        <div>Buyers and sellers can learn a lot about each other by looking at clear frontal face photos.</div>
                        <div><BtnClear label="Upload Photo" /></div>
                      </div>
                    </div>
                    <div className='row3 flex'>
                      <div className='field-name'>DISPLAY NAME / SHOP NAME <ToolTip /> <span className='asterisk'>*</span></div>
                      <div><Input className='profile-data-input' /></div>
                    </div>
                    <div className='row4 flex'>
                      <div className='field-name'>BIO</div>
                      <div><TextArea className='profile-data-textarea' rows='5'/><br /><small>0/255</small></div>
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
                        <input type="text" placeholder='Philippines' disabled/>
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
                      <div className='field-name'>Email <span className='asterisk'>*</span></div>
                      <div><Input className='profile-data-input' /></div>
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
                    <div><BtnGreen label='Save Changes'/></div>
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
