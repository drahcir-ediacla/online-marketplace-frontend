import React from 'react'
import {Link} from 'react-router-dom'
import './style.scss'
import LogoGray from '../../assets/images/Yogeek-logo-gray.png'
import LoginBtn from '../../components/Button/LoginBtn'
import { ReactComponent as FBIcon } from '../../assets/images/facebook-icon.svg'
import { ReactComponent as GoogleIcon } from '../../assets/images/google-icon.svg'

const RegisterByPhoneForm = () => {

  const openPopup = (url, width, height) => {
    const left = window.innerWidth / 2 - width / 2 + window.screenX;
    const top = window.innerHeight / 2 - height / 2 + window.screenY;
  
    window.open(
      url,
      "_blank",
      `width=${width}, height=${height}, top=${top}, left=${left}`
    );
  };
  
  const google = () => {
    openPopup("http://localhost:8081/auth/google", 600, 400);
  };
  
  const facebook = () => {
    openPopup("http://localhost:8081/auth/facebook", 600, 400);
  };
  
  return (
    <>
      <form className='register-form'>
        <div className='row1'>
          <div className='col1'><Link to='/'><img src={LogoGray} alt="" /></Link></div>
          <div className='col2'><h4>Create an account</h4></div>
        </div>
        <div className='row2'>
          <div className='col1 input-container'>
            <div className='row1'><b>Phone Number</b><Link to="/RegisterByEmail">Verify with email</Link></div>
            <div className='row2'><input type="text" placeholder='Enter your phone number' className='phone-number' /><div className="plus63">+63</div></div>
          </div>
          <div className='col2 input-container'>
            <div className='row1'><b>Verification Code</b></div>
            <div className='row2'><input type="text" placeholder='Enter the verification code' /><div className="send-code"><Link to="#">Send Code</Link></div></div>
          </div>
        </div>
        <div className='row3'>
          <div className='col1 input-container'>
            <div className='row1'><b>Password</b></div>
            <div className='row2'><input type="text" placeholder='Enter your password' /></div>
          </div>
          <div className='col2 input-container'>
            <div className='row1'><b>Confirm Password</b></div>
            <div className='row2'><input type="text" placeholder='Re-enter your password' /></div>
          </div>
        </div>
        <div className='row4'><LoginBtn label="Continue" className='reset-pswrd-btn' /></div>
        <div className='row5'><div className='horizontal-line'></div><small>or</small><div className='horizontal-line'></div></div>
        <div className='row6'><LoginBtn icon={<FBIcon />} label='Continue with Facebook' className='facebook-btn' IconclassName='fb-icon' onClick={facebook} /></div>
        <div className='row7'><LoginBtn icon={<GoogleIcon />} label='Continue with Google' className='google-btn' IconclassName='google-icon' onClick={google} /></div>
        <div className='row8'><small>By continuing, you agree to Yogeek <Link to="#">Conditions of Use</Link> and <Link to="#">Privacy Notice</Link>.</small></div>
        <div className="row9"><small>Already have an account? <Link to="/LoginEmail">Sign in here!</Link></small></div>
      </form>
    </>
  )
}

export default RegisterByPhoneForm
